import { connect, connection } from 'mongoose';
import {
    articleModel,
    matchModel
} from '@/lib/schemas';
import {
    Article,
    Match
} from '@/lib/definitions';


export async function connectToDatabase() {
    try {
        if (connection.readyState === 0) {
            let url;
            if (process.env.MODE === "prod") {
                url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}?authSource=admin`;
            } else {
                url = `mongodb://localhost:27017/${process.env.MONGO_NAME}`;
            }
            await connect(url);
            console.log(`Connected to database: ${url}`);
        } else if (connection.readyState === 1) {
            console.log('Already connected to database: ', connection.name);
        }
    } catch (err) {
        console.error("Error connecting to the database");
        console.error("Connection state: ", connection.readyState);
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
            const query = articleModel.find(params).sort({"metadata.date": -1}).limit(3);
            const siteArticlesData = await query.exec();
            siteArticles[site] = siteArticlesData.map((article) => {
                const jsonArticle = JSON.parse(JSON.stringify(article));
                jsonArticle.metadata.date = new Date(jsonArticle.metadata.date);
                return jsonArticle;
            })
        }
        return siteArticles;
    } catch (err) {
        console.error("Error fetching articles");
        console.error("Error: ", err);
        return null;
    }

}


export async function fetchMatchById(id: string | number) {
    try {
        await connectToDatabase();
        const query = matchModel.findOne({"id":id})
        const match: Match = await query.exec();
        return match
    } catch (err) {
        console.error(`Error fetching match with id: ${id}`)
        console.error("Error: ", err);
        return null;
    }
}

export async function fetchMatchesByParams(params: { [key : string]: string }) {
    try {
        await connectToDatabase();
        const query = matchModel.find(params);
        const matches: Array<Match> = await query.exec();
        return matches
    } catch (err) {
        console.error(`Error fetching matches using params: ${params}`);
        console.error("Error: ", err);
        return null;
    }
}

export async function fetchRandomMatch() {
    try {
        await connectToDatabase();
        const matchCount = await matchModel.countDocuments().exec();
        var randomEntry = Math.floor(Math.random() * matchCount);
        const match = await matchModel.findOne().skip(randomEntry).exec()
        return match
    } catch (err) {
        console.error(`Error fetching random match`);
        console.error("Error: ", err);
        return null;
    }
}


export async function fetchMatchSports() {
    try {
        await connectToDatabase();
        const query = matchModel.distinct("metadata.sport");
        const sports = await query.exec();
        return sports;
    } catch (err) {
        console.error(`Error fetching sports`);
        console.error("Error: ", err);
        return null;
    }
}

export async function fetchMatchLeaguesBySport(sport: string) {
    try {
        await connectToDatabase();
        const query = matchModel.distinct("metadata.league", { "metadata.sport": sport });
        const sports = await query.exec();
        return sports;
    } catch (err) {
        console.error(`Error fetching sports`);
        console.error("Error: ", err);
        return null;
    }
}

export async function fetchTeamsByParams(params: { [key: string]: string}) {
    try {
    } catch (err) {

    }
}