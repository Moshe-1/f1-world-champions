//import request from 'supertest';
import { getSeasonWinners } from './services/ergast.service';
import express from "express";
import { Server } from 'http';
const request = require('supertest')
// Mock the ergast service
jest.mock('./services/ergast.service', () => ({
    getSeasonWinners: jest.fn()
}));

describe('Express App', () => {
    let app: express.Application;
    let server: Server;

    beforeAll(async () => {
        app = express();
        app.use(express.json());

        app.get('/api/seasons/:year', (req, res) => {
            res.json({ year: req.params.year, message: "It works!" });
        });

        app.get('/error', () => { throw new Error('Test error') });

        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(500).json({ error: 'Internal Server Error' });
        });

        server = app.listen(0); // Random available port
    });

    afterAll(async () => {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/seasons/:year', () => {
        it('should return health check message', async () => {
            const response = await request(app).get('/api/seasons/2023');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                year: '2023',
                message: "It works!"
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle 404 errors', async () => {
            const response = await request(app).get('/nonexistent-route');
            expect(response.status).toBe(404);
        });

        it('should handle 500 errors', async () => {
            const response = await request(app).get('/error');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
        });
    });
});

describe('connectToDBWithRetry', () => {
    const mockPrisma = {
        $connect: jest.fn(),
        $executeRaw: jest.fn(),
        $disconnect: jest.fn(),
        season: { findMany: jest.fn() }
    };

    beforeEach(() => {
        jest.resetModules();
        jest.mock('@prisma/client', () => ({
            PrismaClient: jest.fn(() => mockPrisma)
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should connect successfully', async () => {
        mockPrisma.$connect.mockResolvedValue(undefined);
        const { connectToDBWithRetry } = require('./index');
        await connectToDBWithRetry();
        expect(mockPrisma.$connect).toHaveBeenCalled();
    });

    it('should handle connection failure', async () => {
        mockPrisma.$connect.mockRejectedValue(new Error('Connection failed'));
        const { connectToDBWithRetry } = require('./index');
        await expect(connectToDBWithRetry(1, 100))
            .rejects.toThrow('Connection failed');
    });
});