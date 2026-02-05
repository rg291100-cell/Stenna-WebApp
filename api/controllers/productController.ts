import { Request, Response, RequestHandler } from 'express';
import db from '../lib/db.js';

const safeParse = (val: any) => {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    }
    return val;
};

export const getProducts: RequestHandler = async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM "Product"`);
        res.json(result.rows);
    } catch (error: any) {
        console.error('getProducts error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProductById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`SELECT * FROM "Product" WHERE id = $1`, [id]);
        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('getProductById error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createProduct: RequestHandler = async (req, res) => {
    try {
        const { name, price } = req.body;

        const result = await db.query(
            `INSERT INTO "Product"(id, name, price)
             VALUES (gen_random_uuid(), $1, $2)
             RETURNING *`,
            [name, price]
        );

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('createProduct error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
