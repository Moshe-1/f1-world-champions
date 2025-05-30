// src/controllers/seasons.ts
import { Request, Response } from 'express';
import { getSeasonWinners } from '../services/ergast.service';

export async function getSeasonData(req: Request, res: Response) {
    try {
        const year = parseInt(req.params.year);
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year format' });
        }

        const data = await getSeasonWinners(year);
        res.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error fetching season data: ${message}`);
        res.status(500).json({
            error: 'Failed to fetch season data',
            details: message
        });
    }
}