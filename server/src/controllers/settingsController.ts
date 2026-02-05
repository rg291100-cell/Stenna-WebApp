import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSetting = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const setting = await prisma.systemSetting.findUnique({
            where: { key: String(key) }
        });
        res.json(setting || { key, value: '' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch setting' });
    }
};

export const updateSetting = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        const setting = await prisma.systemSetting.upsert({
            where: { key: String(key) },
            update: { value },
            create: { key: String(key), value }
        });

        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update setting' });
    }
};
