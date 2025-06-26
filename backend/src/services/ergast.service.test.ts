import { getSeasonWinners } from './ergast.service';
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
});
