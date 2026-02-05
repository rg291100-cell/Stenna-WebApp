import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Only load .env file in local development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
