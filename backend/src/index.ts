import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {PrismaClient} from "@prisma/client";
import seasonRoutes from './routes/seasons';
// Add this import at the top of index.ts
import { getSeasonWinners } from './services/ergast.service';
//import {PrismaClient} from '@prisma/client';

// Load .env variables
dotenv.config();

// Initialize Express and Prisma
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
}));
app.use(express.json()); // Parses JSON bodies
app.use('/api', seasonRoutes);
// Root route (health check)
app.get('/api/seasons/:year', (req, res) => {
    res.json({ year: req.params.year, message: "It works!" });
});

//app.listen(3000, () => console.log('Server started'));

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await connectToDBWithRetry();
        console.log(`🚀 Server is running at http://localhost:${PORT}`);
    } catch (err) {
        console.error('❌ Could not connect to DB', err);
        process.exit(1);
    }
});

// In index.ts
/*
async function connectToDBWithRetry(retries = 5, delay = 60000) {
    for (let i = 0; i < retries; i++) {
        try {
            await prisma.$connect();
            console.log('✅ Connected to DB');

            // Pre-fetch all seasons
            const seasons = await prisma.season.findMany({
                where: { year: { gte: 2005, lte: 2025 } }
            });
            console.log(`Preloaded ${seasons.length} seasons from 2005-2025`);

            return;
        } catch (err) {
            console.error(`❌ DB not ready (attempt ${i + 1}/${retries})`);
            if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
            else throw err;
        }
    }
}
*/

// In index.ts
export async function connectToDBWithRetry(retries = 5, delay = 60000) {
    for (let i = 0; i < retries; i++) {
        try {
            await prisma.$connect();
            console.log('✅ Connected to DB');

            // Run migrations
            try {
                await prisma.$executeRaw`SELECT 1 FROM "Season" LIMIT 1`;
            } catch {
                console.log('⚙️ Database not migrated, running migrations...');
                const { execSync } = require('child_process');
                execSync('npx prisma migrate deploy');
            }

            // Ensure all seasons from 2005-2025 are cached
            for (let year = 2005; year <= 2025; year++) {
                try {
                    await getSeasonWinners(year); // This will fetch and cache if not exists
                } catch (error) {
                    console.warn(`⚠️ Could not fetch season ${year}:`, error);
                }
            }
            console.log('✅ Preloaded seasons from 2005-2025');

            return;
        } catch (err) {
            console.error(`❌ DB not ready (attempt ${i + 1}/${retries})`);
            if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
            else throw err;
        }
    }
}
