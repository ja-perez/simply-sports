import { Schema, model, Model } from 'mongoose';
import { 
    Article,
    Team,
    Player,
    Roster,
    CustomImage,
    Venue,
    TeamOdds,
    Match
} from './definitions';

var articleSchema = new Schema<Article>({
    article_id: { type: String, required: true },
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
} catch (_) {
    articleModel = model<Article>('articles', articleSchema);
}

var imageSchema = new Schema<CustomImage>({
    href:  { type: String, required: true },
    alt:  { type: String },
    width:  { type: Number, required: true },
    height:  { type: Number, required: true },
})

var playerSchema = new Schema<Player>({
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, default:"Unknown" },
    starter: { type: Boolean },
    jersey: { type: String },
    metadata: {
        site: { type: String, required: true },
        sport: { type: String, required: true },
        league: { type: String, required: true },
        date: { type: Date, required: true },
    }
})

var rosterSchema = new Schema<Roster>({
    players: [ playerSchema ],
    formation: { type: String }
})

var teamSchema = new Schema<Team>({
    id: { type: Number, required: true },
    name: { type: String, required: true},
    abbreviation: { type: String, default: ""},
    homeAway: { type: String },
    logos: [ imageSchema ],
    roster: rosterSchema,
    metadata: {
        sport: { type: String, required: true },
        league: { type: String, required: true },
    },
})

var venueSchema = new Schema<Venue>({
    id: { type: String },
    name: { type: String },
    images: [ imageSchema ],
})

var teamOddsSchema = new Schema<TeamOdds>({
    favorite: { type: Boolean, required: true},
    underdog: { type: Boolean, required: true},
    moneyLine: { type: Number, required: true},
    spreadOdds: { type: Number, required: true},
    spread: { type: Number, required: true},
})

var matchSchema = new Schema<Match>({
    label: { type: String, required: true },
    date: { type: Date, required: true },
    venue: venueSchema,
    official: { type: String },
    metadata: {
        sport: { type: String, required: true },
        league: { type: String, required: true },
        season: { type: String, required: true },
        seasonId: { type: String },
    },
    teams: {
        home: teamSchema,
        away: teamSchema,
    },
    odds: {
        overUnder: { type: Number },
        spread: { type: Number },
        overOdds: { type: Number },
        underOdds: { type: Number },
        drawOdds: { type: Number },
        home: teamOddsSchema,
        away: teamOddsSchema,
    }
})
let matchModel = Model<Match>
try {
    matchModel = model<Match>('articles');
} catch (_) {
    matchModel = model<Match>('articles', matchSchema);
}

export { articleModel, matchModel }