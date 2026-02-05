import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Log connection info (safe)
if (process.env.NODE_ENV === 'production') {
    const dbUrl = process.env.DATABASE_URL || '';
    const host = dbUrl.split('@')[1]?.split(':')[0] || 'unknown';
    const port = dbUrl.split(':')[dbUrl.split(':').length - 1]?.split('/')[0] || 'unknown';
    console.log(`[Prisma] Initializing for host: ${host} on port: ${port}`);
}

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
