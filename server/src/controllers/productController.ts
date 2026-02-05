import { Request, Response, RequestHandler } from 'express';
import db from '../lib/db.js';

const safeParse = (val: any) => {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch (e) {
            return val;
        }
    }
    return val;
};

export const getProducts: RequestHandler = async (req, res) => {
    try {
        const { category, collectionId, search, minPrice, maxPrice, room, color, theme } = req.query;

        let queryText = `
            SELECT p.*, c.title as "collectionTitle", c.description as "collectionDescription"
            FROM "Product" p
            LEFT JOIN "Collection" c ON p."collectionId" = c.id
            WHERE 1=1
        `;
        const params: any[] = [];
        let paramIndex = 1;

        if (category) {
            queryText += ` AND p.category = $${paramIndex++}`;
            params.push(category);
        }

        if (collectionId) {
            queryText += ` AND p."collectionId" = $${paramIndex++}`;
            params.push(collectionId);
        }

        if (search) {
            queryText += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (minPrice) {
            queryText += ` AND p.price >= $${paramIndex++}`;
            params.push(parseFloat(minPrice as string));
        }

        if (maxPrice) {
            queryText += ` AND p.price <= $${paramIndex++}`;
            params.push(parseFloat(maxPrice as string));
        }

        if (room) {
            const rooms = Array.isArray(room) ? room : [room];
            queryText += ` AND p.room = ANY($${paramIndex++})`;
            params.push(rooms);
        }

        if (color) {
            const colors = Array.isArray(color) ? color : [color];
            queryText += ` AND p.color = ANY($${paramIndex++})`;
            params.push(colors);
        }

        if (theme) {
            const themes = Array.isArray(theme) ? theme : [theme];
            queryText += ` AND p.theme = ANY($${paramIndex++})`;
            params.push(themes);
        }

        const result = await db.query(queryText, params);
        const products = result.rows;

        const parsedProducts = products.map((p: any) => ({
            ...p,
            specs: safeParse(p.specs),
            images: Array.isArray(p.images) ? p.images : safeParse(p.images),
            videos: Array.isArray(p.videos) ? p.videos : safeParse(p.videos),
            collection: p.collectionId ? {
                id: p.collectionId,
                title: p.collectionTitle,
                description: p.collectionDescription
            } : null
        }));

        res.json(parsedProducts);
    } catch (error: any) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getProductById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Product ID is required' });
            return;
        }

        const queryText = `
            SELECT p.*, c.title as "collectionTitle", c.description as "collectionDescription"
            FROM "Product" p
            LEFT JOIN "Collection" c ON p."collectionId" = c.id
            WHERE p.id = $1
        `;
        const result = await db.query(queryText, [id]);
        const product = result.rows[0];

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        const parsedProduct = {
            ...product,
            specs: safeParse(product.specs),
            images: Array.isArray(product.images) ? product.images : safeParse(product.images),
            videos: Array.isArray(product.videos) ? product.videos : safeParse(product.videos),
            collection: product.collectionId ? {
                id: product.collectionId,
                title: product.collectionTitle,
                description: product.collectionDescription
            } : null
        };

        res.json(parsedProduct);
    } catch (error: any) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const createProduct: RequestHandler = async (req, res) => {
    try {
        const { name, sku, price, description, specs, images, videos, category, quantity, room, color, theme, collectionId } = req.body;

        const queryText = `
            INSERT INTO "Product" (
                id, name, sku, price, description, specs, images, videos, category, quantity, room, color, theme, "collectionId"
            ) VALUES (
                gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            ) RETURNING *
        `;

        const params = [
            name, sku, price, description,
            specs ? JSON.stringify(specs) : null,
            images ? JSON.stringify(images) : JSON.stringify([]),
            videos ? JSON.stringify(videos) : null,
            category, quantity || 0, room, color, theme, collectionId
        ];

        const result = await db.query(queryText, params);
        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
