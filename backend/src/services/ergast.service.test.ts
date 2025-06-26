import { getSeasonWinners, calculateChampion } from './ergast.service';
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

    describe('getSeasonWinners', () => {
        it('should throw for year outside 2005–current', async () => {
            await expect(getSeasonWinners(1990)).rejects.toThrow('Year must be between');
        });

    });
    describe('calculateChampion', () => {
        const mockRaces = [
            {
                Results: [
                    {
                        Driver: { givenName: 'Max', familyName: 'Verstappen' },
                        points: '25',
                        position: '1'
                    },
                    {
                        Driver: { givenName: 'Lewis', familyName: 'Hamilton' },
                        points: '18',
                        position: '2'
                    }
                ]
            },
            {
                Results: [
                    {
                        Driver: { givenName: 'Lewis', familyName: 'Hamilton' },
                        points: '25',
                        position: '1'
                    },
                    {
                        Driver: { givenName: 'Max', familyName: 'Verstappen' },
                        points: '19',
                        position: '2'
                    }
                ]
            }
        ];

        it('should correctly calculate champion based on total points', () => {
            const champion = calculateChampion(mockRaces as any);
            expect(champion).toBe('Max Verstappen'); // 25 + 19 = 44 points
        });


        it('should skip invalid points', () => {
            const invalidRaces = JSON.parse(JSON.stringify(mockRaces));
            invalidRaces[0].Results[0].points = 'invalid';

            const champion = calculateChampion(invalidRaces);
            expect(champion).toBe('Lewis Hamilton');
        });

        it('should ignore negative points', () => {
            const negativeRaces = JSON.parse(JSON.stringify(mockRaces));
            negativeRaces[0].Results[0].points = '-10';

            const champion = calculateChampion(negativeRaces);
            expect(champion).toBe('Lewis Hamilton');
        });
    });
});
