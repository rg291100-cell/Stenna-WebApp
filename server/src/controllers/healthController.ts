import { Request, Response } from 'express';
import prisma from '../lib/prisma.js.js';

export const checkHealth = async (req: Request, res: Response) => {
    try {
        // Just try a simple query
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', message: 'Database connected' });
    } catch (error: any) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
            stack: error.stack
        });
    }
};
