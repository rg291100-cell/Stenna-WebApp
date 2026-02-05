import { Request, Response } from 'express';
import db from '../lib/db.js';

export const getColors = async (req: Request, res: Response) => {
    try {
        const result = await db.query('SELECT * FROM "Color" ORDER BY name ASC');
        res.json(result.rows);
    } catch (error: any) {
        console.error('Error fetching colors:', error);
        res.status(500).json({ error: 'Failed to fetch colors', details: error.message });
    }
};

export const createColor = async (req: Request, res: Response) => {
    try {
        const { name, hexCode } = req.body;

        // Check if color already exists
        const existingColorResult = await db.query('SELECT * FROM "Color" WHERE name = $1', [name]);

        if (existingColorResult.rows.length > 0) {
            return res.status(400).json({ error: 'Color already exists' });
        }

        const newColorResult = await db.query(
            'INSERT INTO "Color" (id, name, "hexCode") VALUES (gen_random_uuid(), $1, $2) RETURNING *',
            [name, hexCode]
        );

        res.status(201).json(newColorResult.rows[0]);
    } catch (error: any) {
        console.error('Error creating color:', error);
        res.status(500).json({ error: 'Failed to create color', details: error.message });
    }
};
