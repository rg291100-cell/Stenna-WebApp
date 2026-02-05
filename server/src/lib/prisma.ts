import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Only load .env file in local development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, '../../.env') });
}

let prisma: PrismaClient;

try {
    prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
} catch (e) {
    console.error('Prisma initialization failed:', e);
    // Fallback or rethrow - but for serverless, we usually want it to fail late or show a good error
    prisma = new PrismaClient();
}

export default prisma;
