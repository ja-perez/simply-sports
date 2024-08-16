import { connect, connection } from 'mongoose';
import {
    articleModel,
    sportModel,
    leagueModel,
    teamModel,
    playerModel,
} from './schemas';
import {
    Article,
    Sport,
    League,
    Team,
    Player,
} from './definitions';

export async function connectToDatabase() {
    try {
        if (connection.readyState === 1) {
            await connect('mongodb://localhost:27017/sports');
            console.log('Connected to database');
        } else {
            console.log('Already connected to database');
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
        const articlesQuery = articleModel.find({}, { _id: 0, __v: 0 });
        const articlesData = await articlesQuery.exec();
        const articles: Article[] = articlesData.map((article) => article.toJSON());
        return articles;
    } catch (err) {
        console.error("Error fetching articles");
        console.error("Error");
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

export async function fetchArticlesBySportLeague(sport: string, league: string) {
    try {
        await connectToDatabase();
        const articlesQuery = articleModel.find(
            { 'metadata.sport': sport, 'metadata.league': league }, 
            { _id: 0, __v: 0, metadata: 0 });
        const articlesData = await articlesQuery.exec();
        const articles: Article[] = articlesData.map((article) => article.toJSON());
        return articles;
    } catch (err) {
        console.error("Error fetching articles");
        console.error("Error: ", err);
    }

}