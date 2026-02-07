import { Request, Response } from 'express';

export const checkHealth = async (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
    });
};
