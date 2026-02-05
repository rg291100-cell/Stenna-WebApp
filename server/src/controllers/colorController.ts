import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getColors = async (req: Request, res: Response) => {
    try {
        const colors = await prisma.color.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(colors);
    } catch (error: any) {
        console.error('Error fetching colors:', error);
        res.status(500).json({ error: 'Failed to fetch colors', details: error.message });
    }
};

export const createColor = async (req: Request, res: Response) => {
    try {
        const { name, hexCode } = req.body;

        // Check if color already exists
        const existingColor = await prisma.color.findUnique({
            where: { name }
        });

        if (existingColor) {
            return res.status(400).json({ error: 'Color already exists' });
        }

        const color = await prisma.color.create({
            data: {
                name,
                hexCode
            }
        });

        res.status(201).json(color);
    } catch (error: any) {
        console.error('Error creating color:', error);
        res.status(500).json({ error: 'Failed to create color', details: error.message });
    }
};
