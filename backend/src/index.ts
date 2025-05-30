import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {PrismaClient} from "@prisma/client";
import seasonRoutes from './routes/seasons';
//import {PrismaClient} from '@prisma/client';

// Load .env variables
dotenv.config();

// Initialize Express and Prisma
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use('/api', seasonRoutes);
// Root route (health check)
app.get('/api/seasons/:year', (req, res) => {
    res.json({ year: req.params.year, message: "It works!" });
});

app.listen(3000, () => console.log('Server started'));

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

async function connectToDBWithRetry(retries = 5, delay = 60000) {
    for (let i = 0; i < retries; i++) {
        try {
            await prisma.$connect();
            console.log('✅ Connected to DB');
            return;
        } catch (err) {
            console.error(`❌ DB not ready (attempt ${i + 1}/${retries})`);
            if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
            else throw err;
        }
    }
}

