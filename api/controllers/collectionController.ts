import { Request, Response } from 'express';
import { query } from '../lib/db.js';

export const getCollections = async (_req: Request, res: Response) => {
    try {
        const result = await query(
            `SELECT * FROM "Collection" ORDER BY title ASC`
        );
        res.json(result.rows);
    } catch (error: any) {
        console.error('getCollections error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCollectionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT * FROM "Collection" WHERE id = $1`,
            [id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('getCollectionById error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
