// src/routes/seasons.test.ts
//import request from 'supertest';
//import * as request from 'supertest';

import express from 'express';
import router from './seasons';
import { getSeasonWinners, getAllSeasons } from '../services/ergast.service';
const request = require('supertest')
// Type the mocked functions
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
        app.use('/api/seasons', router); // Match your actual route prefix
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
            const mockData = {
                id: 1,
                year: 2023,
                champion: "Max Verstappen",
                createdAt: new Date(),
                updatedAt: new Date(),
                races: [
                    {
                        round: 1,
                        date: "2023-03-05",
                        circuit: {
                            id: 1,
                            name: "Bahrain International Circuit",
                            circuitId: "bahrain",
                            locationId: 1,
                            location: {
                                id: 1,
                                lat: 26.0325,
                                long: 50.5106,
                                locality: "Sakhir",
                                country: "Bahrain"
                            }
                        },
                        results: [
                            {
                                driver: {
                                    number: 1,
                                    id: 1,
                                    driverId: "verstappen",
                                    code: "VER",
                                    firstName: "Max",
                                    lastName: "Verstappen",
                                    dateOfBirth: new Date("1997-09-30"),
                                    nationality: "Dutch"
                                },
                                constructor: {
                                    id: 1,
                                    constructorId: "red_bull",
                                    name: "Red Bull",
                                    nationality: "Austrian",
                                    url: "https://example.com/red_bull",
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    caller: null
                                }
                            }
                        ]
                    }
                ]
            };



            //mockedGetSeasonWinners.mockResolvedValue(mockData);

            const response = await request(app).get('/api/seasons/seasons/2021');

            expect(response.status).toBe(200);
            //expect(response.body).toEqual(mockData);
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


    /* describe('GET /api/seasons/:year', () => {
         it('should return 400 for invalid year format', async () => {
             const response = await request(app).get('/api/seasons/not-a-number');
             expect(response.status).toBe(400);
             expect(response.body).toEqual({ error: 'Invalid year format' });
         });

         it('should return season data for valid year', async () => {
             const mockData = { year: 2021, champion: 'Verstappen', races: [] };
             mockedGetSeasonWinners.mockResolvedValue(mockData);

             const response = await request(app).get('/api/seasons/2021');

             expect(response.status).toBe(200);
             expect(response.body).toEqual(mockData);
             expect(mockedGetSeasonWinners).toHaveBeenCalledWith(2021);
         });

         it('should handle service errors', async () => {
             mockedGetSeasonWinners.mockRejectedValue(new Error('DB error'));

             const response = await request(app).get('/api/seasons/2021');

             expect(response.status).toBe(500);
             expect(response.body).toEqual({
                 error: 'Failed to fetch season data',
                 details: 'DB error'
             });
         });
     });

     describe('GET /api/seasons', () => {
         it('should return all seasons', async () => {
             const mockSeasons = [
                 { year: 2020, champion: 'Hamilton' },
                 { year: 2021, champion: 'Verstappen' }
             ];
             mockedGetAllSeasons.mockResolvedValue(mockSeasons);

             const response = await request(app).get('/api/seasons');

             expect(response.status).toBe(200);
             expect(response.body).toEqual(mockSeasons);
         });

         it('should handle errors when fetching all seasons', async () => {
             mockedGetAllSeasons.mockRejectedValue(new Error('Fetch error'));

             const response = await request(app).get('/api/seasons');

             expect(response.status).toBe(500);
             expect(typeof response.body.error).toBe('string');
         });
     });*/
});