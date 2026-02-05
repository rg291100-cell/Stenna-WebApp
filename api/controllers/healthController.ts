import { Request, Response } from 'express';

export const checkHealth = async (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'ok',
        message: 'Server is healthy'
    });
};
