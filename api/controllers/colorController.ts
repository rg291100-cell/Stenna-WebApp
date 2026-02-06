import { Request, Response } from 'express';
import { query } from '../lib/db.js';

export const getColors = async (_req: Request, res: Response) => {
    try {
        const result = await query(
            `SELECT * FROM "Color" ORDER BY name ASC`
        );
        res.json(result.rows);
    } catch (error: any) {
        console.error('getColors error:', error);
        res.status(500).json({ message: 'Failed to fetch colors' });
    }
};

export const createColor = async (req: Request, res: Response) => {
    try {
        const { name, hexCode } = req.body;

        const existing = await query(
            `SELECT 1 FROM "Color" WHERE name = $1`,
            [name]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Color already exists' });
        }

        const result = await query(
            `
            INSERT INTO "Color" (id, name, "hexCode")
            VALUES (gen_random_uuid(), $1, $2)
            RETURNING *
            `,
            [name, hexCode]
        );

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('createColor error:', error);
        res.status(500).json({ message: 'Failed to create color' });
    }
};
