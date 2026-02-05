import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getSetting = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const setting = await prisma.systemSetting.findUnique({
            where: { key: String(key) }
        });
        res.json(setting || { key, value: '' });
    } catch (error: any) {
        console.error('Error fetching setting:', error);
        res.status(500).json({ error: 'Failed to fetch setting', details: error.message });
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
    } catch (error: any) {
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Failed to update setting', details: error.message });
    }
};
