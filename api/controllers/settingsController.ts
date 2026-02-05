import { Request, Response } from 'express';
import db from '../lib/db.js';

export const getSetting = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const result = await db.query('SELECT * FROM "SystemSetting" WHERE key = $1', [key]);
        const setting = result.rows[0];
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

        const queryText = `
            INSERT INTO "SystemSetting" (key, value)
            VALUES ($1, $2)
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
            RETURNING *
        `;
        const result = await db.query(queryText, [key, value]);

        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Failed to update setting', details: error.message });
    }
};
