import { getAllSeasons, getSeasonWinners } from './ergast.service';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

jest.mock('@prisma/client');
jest.mock('axios');

const mockPrisma = {
    season: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
    },
    $transaction: jest.fn(),
};

(PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);

describe('ergast.service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllSeasons', () => {
       /* it('should return known and unknown seasons', async () => {
            mockPrisma.season.findUnique.mockImplementation(({ where }) => {
                if (where.year === 2005) {
                    return { year: 2005, champion: 'Alonso' };
                }
                return null;
            });

            const seasons = await getAllSeasons();
            expect(seasons).toContainEqual({ year: 2005, champion: 'Alonso' });
            expect(seasons.find(s => s.year === 2006)).toEqual({ year: 2006, champion: 'Unknown' });
        });*/
    });

    describe('getSeasonWinners', () => {
        it('should throw for year outside 2005–current', async () => {
            await expect(getSeasonWinners(1990)).rejects.toThrow('Year must be between');
        });

       /* it('should return cached season if exists', async () => {
            const fakeSeason = { year: 2010, champion: 'Vettel', races: [] };
            mockPrisma.season.findUnique.mockResolvedValue(fakeSeason);

            const result = await getSeasonWinners(2010);
            expect(result).toBe(fakeSeason);
            expect(mockPrisma.season.findUnique).toHaveBeenCalled();
        });

        it('should fetch and store season if not cached', async () => {
            mockPrisma.season.findUnique.mockResolvedValue(null);
            mockedAxios.get.mockResolvedValue({
                data: {
                    MRData: {
                        RaceTable: {
                            Races: [
                                {
                                    round: '1',
                                    raceName: 'Test GP',
                                    date: '2023-03-01',
                                    Circuit: {
                                        circuitId: 'test-circuit',
                                        circuitName: 'Test Circuit',
                                        Location: {
                                            lat: '52.0',
                                            long: '13.0',
                                            locality: 'Test Town',
                                            country: 'Testland',
                                        },
                                    },
                                    Results: [{
                                        position: '1',
                                        points: '25',
                                        Driver: {
                                            driverId: 'hamilton',
                                            familyName: 'Hamilton',
                                            givenName: 'Lewis',
                                            dateOfBirth: '1985-01-07',
                                            nationality: 'British',
                                            permanentNumber: '44',
                                            code: 'HAM'
                                        },
                                        Constructor: {
                                            constructorId: 'mercedes',
                                            name: 'Mercedes',
                                            nationality: 'German'
                                        }
                                    }]
                                }
                            ]
                        }
                    }
                }
            });

            mockPrisma.$transaction.mockImplementation(async fn => {
                return fn({
                    season: { upsert: jest.fn().mockResolvedValue({ id: 1, year: 2023, champion: 'Hamilton' }) },
                    location: { upsert: jest.fn().mockResolvedValue({ id: 10 }) },
                    circuit: { upsert: jest.fn().mockResolvedValue({ id: 20 }) },
                    driver: { upsert: jest.fn().mockResolvedValue({ id: 30 }) },
                    constructor: { upsert: jest.fn().mockResolvedValue({ id: 40 }) },
                    race: { create: jest.fn().mockResolvedValue({ id: 50 }) },
                    result: { create: jest.fn() }
                });
            });

            const result = await getSeasonWinners(2023);
            expect(result?.champion).toBe('Hamilton');
            expect(axios.get).toHaveBeenCalled();
        });*/
    });
});
