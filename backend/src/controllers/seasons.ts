// src/controllers/seasons.ts
import { Request, Response } from 'express';
import { getSeasonWinners } from '../services/ergast.service';

export async function getSeasonData(req: Request, res: Response) {
    try {
        const year = parseInt(req.params.year);
        const data = await getSeasonWinners(year);
        res.json(data);
    } catch (error) {
        //res.status(500).json({ error: error.message });
    }
}