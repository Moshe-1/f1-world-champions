import { Router, Request, Response } from 'express';
import { getSeasonWinners, getAllSeasons } from '../services/ergast.service';

const router = Router();

router.get('/seasons/:year', async (req: Request, res: Response): Promise<void> => {
    const year = Number(req.params.year);
    if (!Number.isInteger(year)) {
        res.status(400).json({ error: 'Invalid year format' });
        return;
    }

    try {
        const seasonData = await getSeasonWinners(year);
        res.json(seasonData);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error fetching season data: ${message}`);
        res.status(500).json({
            error: 'Failed to fetch season data',
            details: message
        });
    }
});


router.get('/seasons', async (req, res) => {
    try {
        const seasons = await getAllSeasons();
        res.json(seasons);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
export default router;
