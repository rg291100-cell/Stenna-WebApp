import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

try {
    prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
} catch (e) {
    console.error('Prisma initialization failed:', e);
    prisma = new PrismaClient();
}

export default prisma;
