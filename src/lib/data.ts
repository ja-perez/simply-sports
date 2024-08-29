import { connect, connection } from 'mongoose';
import {
    articleModel,
    sportModel,
    leagueModel,
    teamModel,
    playerModel,
} from '@/lib/schemas';
import {
    Article,
    Sport,
    League,
    Team,
    Player,
} from '@/lib/definitions';


export async function connectToDatabase() {
    try {
        if (connection.readyState === 0) {
            let url;
            if (process.env.MODE === "prod") {
                url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.MONGO_URL}`;
            } else {
                url = 'mongodb://localhost:27017/simply-sports';
            }
            await connect(url);
            console.log('Connected to database');
        } else if (connection.readyState === 1) {
            console.log('Already connected to database: ', connection.name);
            console.log(process.env.MONGO_URL);
        }
    } catch (err) {
        console.error("Error connecting to the database");
        console.error("Connection state: ", connection.readyState);
        console.error("Error: ", err);
    }
}


export async function fetchSports() {
    try {
        await connectToDatabase();
        const sportsQuery = sportModel.find({}, { _id: 0, __v: 0 });
        const sportsData = await sportsQuery.exec();
        const sports: Sport[] = sportsData.map((sport) => sport.toJSON());
        return sports;
    } catch (err) {
        console.error("Error fetching sports");
        console.error("Error: ", err);
    }
}

export async function fetchArticles() {
    try {
        await connectToDatabase();
        const articlesQuery = articleModel.find({});
        const articlesData = await articlesQuery.exec();
        const articles: Article[] = articlesData.map((article) => article.toJSON());
        return articles;
    } catch (err) {
        console.error("Error fetching articles");
        console.error("Error: ", err);
    }
}

export async function fetchArticleById(id: string) {
    try {
        await connectToDatabase();
        const articleQuery = articleModel.findOne({ id: id }, { _id: 0, __v: 0, metadata: 0 });
        const articleData = await articleQuery.exec();
        if (articleData === null) {
            throw new Error("Article not found: " + id);
        }
        const article = articleData.toObject();
    } catch (err) {
        console.error("Error fetching article");
        console.error("Error: ", err);
    }
}

export async function fetchArticlesByParams(params: { [key: string]: string }) {
    try {
        await connectToDatabase();
        const sites = await articleModel.distinct("metadata.site").exec();

        const siteArticles: {[site: string]: Article[]} = {};
        for (const siteIndex in sites) {
            const site = sites[siteIndex];
            params["metadata.site"] = site;
            const query = articleModel.find(params).sort({"metadata.date": -1}).limit(6);
            const siteArticlesData = await query.exec();
            siteArticles[site] = siteArticlesData.map((article) => article.toJSON());
        }
        return siteArticles;
    } catch (err) {
        console.error("Error fetching articles");
        console.error("Error: ", err);
        return null;
    }

}


export async function fetchArticlesBySportLeague(sport: string, league: string) {
    try {
        await connectToDatabase();
        console.log(`Fetching articles for sport: ${sport}, league: ${league}`);
        const sourcesQuery = articleModel.distinct("metadata.site");
        const sources: String[] = await sourcesQuery.exec();

        const articles = sources.map(async (source) => {
            const sourceArticlesQuery = articleModel.find({
                "metadata.site": source,
            });
            if (sport !== "all") {
                sourceArticlesQuery.find({ sport: sport });
            }
            if (league !== "all") {
                sourceArticlesQuery.find({ league: league });
            }
            const sourceArticlesData = await sourceArticlesQuery.limit(6).exec();
            const sourceArticles: Article[] = sourceArticlesData.map((article) => article.toJSON());
            return { source: source, articles: sourceArticles};
        })
        return articles;
    } catch (err) {
        console.error("Error fetching articles");
        console.error("Error: ", err);
        return null;
    }
}

export async function fetchArticlesBySourceSportLeague(source: string, sport: string, league: string) {
    try {
        await connectToDatabase();
        console.log(`Fetching articles for source: ${source}, sport: ${sport}, league: ${league}`);
        var query = articleModel.aggregate([
            { $match: {
                source: source,
                $or: [
                    { sport: sport },
                    { league: league },
                ],
            }}
        ])
     
        var articlesQuery = articleModel.find({ source: source });
        if (sport !== "all") {
            articlesQuery = articlesQuery.find({ sport: sport });
        }
        if (league !== "all") {
            articlesQuery = articlesQuery.find({ league: league });
        }
        const articlesData = await articlesQuery.limit(6).exec();
        const articles: Article[] = articlesData.map((article) => article.toJSON());
        console.log(`Fetched ${articles.length} articles`);
        return articles;
    } catch (err) {
        console.error("Error fetching articles");
        console.error("Error: ", err);
        return null;
    }
}