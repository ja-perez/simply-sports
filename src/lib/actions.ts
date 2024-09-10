'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { fetchMatchById } from '@/lib/data';

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

export type State = {
    errors?: { 
        matchId?: string[];
        spread?: string[];
        moneyline?: string[];
        total?: string[];
    };
    message?: string | null;
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
        };
    }

    const { matchId, spread, moneyline, total } = validatedFields.data;

    if (spread === 'none' && moneyline === 'none' && total === 'none') {
        return {
            errors: {},
            message: 'Select at least one of the Bet Slip options.'
        }
    }

    const matchData = await fetchMatchById(matchId);
    if (!matchData) {
        return {
            errors: {},
            message: 'Invalid match ID'
        }
    }

    revalidatePath('/practice/result');
    redirect('/practice/result')
}
