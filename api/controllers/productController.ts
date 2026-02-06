import { Request, Response } from 'express';
import { query } from '../lib/db.js';

export const getProducts = async (_req: Request, res: Response) => {
    try {
        const result = await query(
            `SELECT * FROM "Product" ORDER BY "createdAt" DESC`
        );
        res.json(result.rows);
    } catch (error: any) {
        console.error('getProducts error:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT * FROM "Product" WHERE id = $1`,
            [id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('getProductById error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
