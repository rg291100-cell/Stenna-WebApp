import { Request, Response } from 'express';
import { query } from '../lib/db.js';

export const getSetting = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;

        const result = await query(
            `SELECT * FROM "SystemSetting" WHERE key = $1`,
            [key]
        );

        res.json(result.rows[0] || { key, value: '' });
    } catch (error: any) {
        console.error('Error fetching setting:', error);
        res.status(500).json({ error: 'Failed to fetch setting' });
    }
};

export const updateSetting = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        const result = await query(
            `
      INSERT INTO "SystemSetting" (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key)
      DO UPDATE SET value = EXCLUDED.value
      RETURNING *
      `,
            [key, value]
        );

        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Failed to update setting' });
    }
};
