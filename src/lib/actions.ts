'use server';

import { z } from 'zod';

import { fetchMatchById } from '@/lib/data';
import { Match } from '@/lib/definitions';

const BetSlipSchema = z.object({
    matchId: z.string(),
    spread: z.enum(['home', 'away', 'none'], {
        invalid_type_error: 'Please select a valid spread option'
    }),
    moneyline: z.enum(['home', 'away', 'none'], {
        invalid_type_error: 'Please select a valid money option'
    }),
    total: z.enum(['home', 'away', 'none'], {
        invalid_type_error: 'Please select a valid total option'
    })
})

const SubmitBetSlip = BetSlipSchema;

export type Results = {
    spread?: { payout: number, success: true | false },
    moneyline?: { payout: number, success: true | false },
    total?: { payout: number, success: true | false }
}

export type State = {
    errors?: { 
        matchId?: string[];
        spread?: string[];
        moneyline?: string[];
        total?: string[];
    };
    message?: string | null;
    success?: true | false;
    results?: Results
}

export interface SlipChoices {
    matchId: string;
    spread: 'none' | 'home' | 'away';
    moneyline: 'none' | 'home' | 'away';
    total: 'none' | 'home' | 'away';
}

export async function submitBetSlip(prevState: State, slipChoices: SlipChoices) {
    const validatedFields = SubmitBetSlip.safeParse({
        matchId: slipChoices.matchId,
        spread: slipChoices.spread,
        moneyline: slipChoices.moneyline,
        total: slipChoices.total
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid Fields. Failed to Submit Bet Slip.',
            success: false,
            results: {}
        };
    }

    const { matchId, spread, moneyline, total } = validatedFields.data;

    if (spread === 'none' && moneyline === 'none' && total === 'none') {
        return {
            errors: {},
            message: 'Select at least one of the Bet Slip options.',
            success: false,
            results: {}
        }
    }

    const matchData = await fetchMatchById(matchId);
    if (!matchData) {
        return {
            errors: {},
            message: 'Invalid match ID',
            success: false,
            results: {}
        }
    }

    const matchResults = GetBetSlipResults({matchData:matchData, choices:slipChoices});

    return {
        errors: {},
        message: '',
        success: true,
        results: matchResults
    }
}

interface ResultsProps {
    matchData: Match,
    choices: SlipChoices
}

function GetBetSlipResults({ 
    matchData, choices
}: ResultsProps) {
    // Extracting into vars for convenience
    const odds= matchData.odds[0];
    const home = matchData.teams.home;
    const away = matchData.teams.away;
    const homeOdds = odds.home;
    const awayOdds = odds.away;
    
    const payoutOdds = {
        over:  Math.abs(odds.overOdds),
        under: Math.abs(odds.underOdds),
        homeMoneyline: Math.abs(odds.home.moneyLine),
        awayMoneyline: Math.abs(odds.away.moneyLine),
        homeSpread: Math.abs(odds.home.spreadOdds),
        awaySpread: Math.abs(odds.away.spreadOdds),
    }
    const result = {
        total: {
            payout: 0, success: false
        },
        moneyline: {
            payout: 0, success: false
        },
        spread: {
            payout: 0, success: false
        }
    }
    // Total
    const matchTotal = home.score + away.score;
    if (choices.total !== 'none') {
        const choiceOver = choices.total === 'home' ? true : false
        const choiceResult = choiceOver ? matchTotal > odds.overUnder : matchTotal < odds.overUnder;
        const isVoid = matchTotal === odds.overUnder;
        result.total = {
            payout: isVoid 
            ? (choiceOver ? payoutOdds.over : payoutOdds.under)
            : (choiceResult 
                ? (choiceOver
                    ? payoutOdds.over + 100
                    : payoutOdds.under + 100
                ) 
                : 0),
            success: choiceResult
        }
    } 

    // Spread
    const homeFavorite = homeOdds.favorite ? true : false;
    const favoriteOdds = homeFavorite ? homeOdds : awayOdds;
    const underdogOdds = homeFavorite ? awayOdds : homeOdds;
    const favorite = homeFavorite ? home : away;
    const underDog = homeFavorite ? away : home;
    const goalDiff = favorite.score - underDog.score;
    if (choices.spread !== 'none') {
        const choiceFavorite = choices.spread === favorite.homeAway ? true : false
        const choiceResult = choiceFavorite ? goalDiff > odds.spread : goalDiff < odds.spread;
        const isVoid = matchTotal === odds.overUnder;
        result.spread = {
            payout: isVoid 
            ? (choiceFavorite ? favoriteOdds.spreadOdds : underdogOdds.spreadOdds)
            : (choiceResult 
                ? (choiceFavorite 
                    ? (homeFavorite 
                        ? payoutOdds.homeSpread + 100
                        : payoutOdds.awaySpread + 100)
                    : (homeFavorite
                        ? payoutOdds.awaySpread + 100
                        : payoutOdds.homeSpread + 100)
                    )
                : 0),
            success: choiceResult
        }
    } 
    // Moneyline
    const winner = home.winner 
    ? home.homeAway 
    : (away.winner
        ? away.homeAway
        : 'draw')
    if (choices.moneyline !== 'none') {
        const choiceHome = choices.moneyline === 'home';
        const choiceResult = choices.moneyline === winner;
        const isDraw = winner === 'draw'
        result.moneyline = {
            payout: isDraw
            ? (choiceHome ? payoutOdds.homeMoneyline : payoutOdds.awayMoneyline)
            : (choiceResult
                ? (choiceHome
                    ? payoutOdds.homeMoneyline + 100
                    : payoutOdds.awayMoneyline + 100
                )
            : 0),
            success: choiceResult
        }
    }
    return result;
}