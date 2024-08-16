import { Schema, model, Model } from 'mongoose';
import { 
    Article,
    Sport,
    League,
    Team,
    Player,
} from './definitions';

var articleSchema = new Schema<Article>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        href: { type: String, required: true },
        alt: { type: String, default: "" },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
    },
    href: { type: String, required: true },
    metadata: {
        site: { type: String, required: true },
        sport: { type: String, required: true },
        league: { type: String, required: true },
        date: { type: Date, required: true },
    },
});
let articleModel: Model<Article>;
try {
    articleModel = model<Article>('articles');
} catch (err) {
    articleModel = model<Article>('articles', articleSchema);
}

var sportSchema = new Schema<Sport>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    league_ids: { type: [String], required: true },
})
let sportModel: Model<Sport>;
try {
    sportModel = model<Sport>('sports');
} catch (err) {
    sportModel = model<Sport>('sports', sportSchema);
}

var leagueSchema = new Schema<League>({
    id: { type: String, required: true },
    name: { type: String, required: true},
    team_ids: { type: [String] },
})
let leagueModel: Model<League>;
try {
    leagueModel = model<League>('leagues');
} catch (err) {
    leagueModel = model<League>('leagues', leagueSchema)
}

var teamSchema = new Schema<Team>({
    id: { type: String, required: true },
    name: { type: String, required: true},
    abbreviation: { type: String, default: ""},
    logos: [
        {
            href: { type: String },
            alt: { type: String },
            width: { type: Number },
            height: { type: Number },
        }
    ],
    metadata: {
        sport: { type: String, required: true },
        league: { type: String, required: true },
    },
    player_ids: { type: [String]}
})
let teamModel: Model<Team>;
try {
    teamModel = model<Team>('teams');
} catch (err) {
    teamModel = model<Team>('teams', teamSchema);
}

var playerSchema = new Schema<Player>({
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    image_url: { type: String },
    position: { type: String, required: true },
    status: { type: String, default: "UNKNOWN" },
    metadata: {
        sport: { type: String, required: true },
        league: { type: String, required: true },
        team: { type: String}
    }
})
let playerModel: Model<Player>;
try {
    playerModel = model<Player>('players');
} catch (err) {
    playerModel = model<Player>('players', playerSchema);
}

export { articleModel, sportModel, leagueModel, teamModel, playerModel }