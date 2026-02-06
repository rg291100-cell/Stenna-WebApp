import { query } from '../lib/db.js';
export const getProducts = async (_req, res) => {
    try {
        const rows = await query(`SELECT * FROM "Product" ORDER BY "createdAt" DESC`);
        res.json(rows);
    }
    catch (err) {
        console.error('getProducts error:', err);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};
export const getProductById = async (req, res) => {
    try {
        const rows = await query(`SELECT * FROM "Product" WHERE id = $1`, [req.params.id]);
        if (!rows.length) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(rows[0]);
    }
    catch (err) {
        console.error('getProductById error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;
        const rows = await query(`
            INSERT INTO "Product" (id, name, price)
            VALUES (gen_random_uuid(), $1, $2)
            RETURNING *
            `, [name, price]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error('createProduct error:', err);
        res.status(500).json({ message: 'Failed to create product' });
    }
};
