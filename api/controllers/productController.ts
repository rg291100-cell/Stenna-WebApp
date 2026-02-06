import { Request, Response } from 'express';
import { query } from '../lib/db.js';

export const getProducts = async (_req: Request, res: Response) => {
    try {
        const rows = await query(
            `SELECT * FROM "Product"`
        );
        res.json(rows);
    } catch (err) {
        console.error('getProducts error:', err);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const rows = await query(
            `SELECT * FROM "Product" WHERE id = $1 LIMIT 1`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};


export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price } = req.body;

        const rows = await query(
            `
            INSERT INTO "Product" (id, name, price)
            VALUES (gen_random_uuid(), $1, $2)
            RETURNING *
            `,
            [name, price]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('createProduct error:', err);
        res.status(500).json({ message: 'Failed to create product' });
    }
};
