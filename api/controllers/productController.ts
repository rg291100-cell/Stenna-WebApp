import { Request, Response } from 'express';
import { query } from '../lib/db.js';

export const getProducts = async (_req: Request, res: Response) => {
    try {
        let rows = await query(`SELECT * FROM "Product"`);
        rows = rows.map(row => ({
            ...row,
            images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
            videos: typeof row.videos === 'string' && row.videos ? JSON.parse(row.videos) : (row.videos || [])
        }));
        res.json(rows);
    } catch (err) {
        console.error('getProducts error:', err);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const rows = await query(
            `SELECT * FROM "Product" WHERE id = $1`,
            [id]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = rows[0];
        const formattedProduct = {
            ...product,
            images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
            videos: typeof product.videos === 'string' && product.videos ? JSON.parse(product.videos) : (product.videos || [])
        };

        res.json(formattedProduct);
    } catch (err) {
        console.error('getProductById error:', err);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const {
            name, sku, price, description, quantity, weight, material,
            rollLength, rollWidth, designStyle, category, room, color,
            theme, images, videos, collectionId
        } = req.body;

        const rows = await query(
            `
            INSERT INTO "Product" (
                id, name, sku, price, description, quantity, weight, material,
                "rollLength", "rollWidth", "designStyle", category, room, color,
                theme, images, videos, "collectionId"
            ) VALUES (
                gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
            ) RETURNING *
            `,
            [
                name, sku, price, description, quantity || 0, weight, material,
                rollLength, rollWidth, designStyle, category, room, color,
                theme, JSON.stringify(images || []), JSON.stringify(videos || []), collectionId
            ]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('createProduct error:', err);
        res.status(500).json({ message: 'Failed to create product' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name, sku, price, description, quantity, weight, material,
            rollLength, rollWidth, designStyle, category, room, color,
            theme, images, videos, collectionId
        } = req.body;

        console.log(`Updating product ${id}:`, { name, sku, price });

        const rows = await query(
            `
            UPDATE "Product" SET
                name = $1, sku = $2, price = $3, description = $4, quantity = $5,
                weight = $6, material = $7, "rollLength" = $8, "rollWidth" = $9,
                "designStyle" = $10, category = $11, room = $12, color = $13,
                theme = $14, images = $15, videos = $16, "collectionId" = $17
            WHERE id = $18
            RETURNING *
            `,
            [
                name, sku, price, description, quantity || 0, weight, material,
                rollLength, rollWidth, designStyle, category, room, color,
                theme, JSON.stringify(images || []), JSON.stringify(videos || []), collectionId,
                id
            ]
        );

        console.log(`Update result for ${id}:`, rows.length > 0 ? 'Success' : 'Not Found');

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('updateProduct error:', err);
        res.status(500).json({ message: 'Failed to update product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await query(`DELETE FROM "Product" WHERE id = $1`, [id]);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error('deleteProduct error:', err);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};
