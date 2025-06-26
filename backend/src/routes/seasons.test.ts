import express from 'express';
import router from './seasons';
import { getSeasonWinners, getAllSeasons } from '../services/ergast.service';
const request = require('supertest')
jest.mock('../services/ergast.service', () => ({
    getSeasonWinners: jest.fn(),
    getAllSeasons: jest.fn()
}));

const mockedGetSeasonWinners = getSeasonWinners as jest.MockedFunction<typeof getSeasonWinners>;
const mockedGetAllSeasons = getAllSeasons as jest.MockedFunction<typeof getAllSeasons>;



describe('Seasons Router', () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api/seasons', router);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/seasons/seasons/:year', () => {
        it('should return 400 for invalid year format', async () => {
            const response = await request(app).get('/api/seasons/seasons/not-a-number');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Invalid year format' });
        });

        it('should return season data for valid year', async () => {
            const response = await request(app).get('/api/seasons/seasons/2021');

            expect(response.status).toBe(200);
            expect(mockedGetSeasonWinners).toHaveBeenCalledWith(2021);
        });

        it('should handle service errors', async () => {
            mockedGetSeasonWinners.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/api/seasons/seasons/2021');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: 'Failed to fetch season data',
                details: 'DB error'
            });
        });
    });

    describe('GET /api/seasons/seasons', () => {
        it('should return all seasons', async () => {
            const mockSeasons = [
                { year: 2020, champion: 'Hamilton' },
                { year: 2021, champion: 'Verstappen' }
            ];
            mockedGetAllSeasons.mockResolvedValue(mockSeasons);

            const response = await request(app).get('/api/seasons/seasons');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSeasons);
        });

        it('should handle errors when fetching all seasons', async () => {
            mockedGetAllSeasons.mockRejectedValue(new Error('Fetch error'));

            const response = await request(app).get('/api/seasons/seasons');

            expect(response.status).toBe(500);
            expect(typeof response.body.error).toBe('object');
        });
    });
});