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
    const result = await db.query(`
    SELECT p.*, c.title as "collectionTitle", c.description as "collectionDescription"
    FROM "Product" p
    LEFT JOIN "Collection" c ON p."collectionId" = c.id
  `);

    const products = result.rows.map((p: any) => ({
        ...p,
        specs: safeParse(p.specs),
        images: safeParse(p.images),
        videos: safeParse(p.videos),
        collection: p.collectionId
            ? { id: p.collectionId, title: p.collectionTitle, description: p.collectionDescription }
            : null
    }));

    res.json(products);
};

export const getProductById: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const result = await db.query(`SELECT * FROM "Product" WHERE id = $1`, [id]);

    if (!result.rows.length) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const p = result.rows[0];
    res.json({
        ...p,
        specs: safeParse(p.specs),
        images: safeParse(p.images),
        videos: safeParse(p.videos),
    });
};

export const createProduct: RequestHandler = async (req, res) => {
    const {
        name, sku, price, description,
        specs, images, videos,
        category, quantity, room, color, theme, collectionId
    } = req.body;

    const result = await db.query(
        `
    INSERT INTO "Product" (
      id, name, sku, price, description, specs, images, videos,
      category, quantity, room, color, theme, "collectionId"
    )
    VALUES (
      gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
    )
    RETURNING *
    `,
        [
            name, sku, price, description,
            specs ? JSON.stringify(specs) : null,
            images ? JSON.stringify(images) : '[]',
            videos ? JSON.stringify(videos) : null,
            category, quantity || 0, room, color, theme, collectionId
        ]
    );

    res.status(201).json(result.rows[0]);
};
