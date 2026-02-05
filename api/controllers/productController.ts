import { Request, Response, RequestHandler } from 'express';
import { query } from '../lib/db.js';

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
        const { category, collectionId, search, minPrice, maxPrice, room, color, theme } = req.query;

        let sql = `
      SELECT p.*, c.title AS "collectionTitle", c.description AS "collectionDescription"
      FROM "Product" p
      LEFT JOIN "Collection" c ON p."collectionId" = c.id
      WHERE 1=1
    `;

        const params: any[] = [];
        let i = 1;

        if (category) { sql += ` AND p.category = $${i++}`; params.push(category); }
        if (collectionId) { sql += ` AND p."collectionId" = $${i++}`; params.push(collectionId); }
        if (search) {
            sql += ` AND (p.name ILIKE $${i} OR p.description ILIKE $${i})`;
            params.push(`%${search}%`);
            i++;
        }
        if (minPrice) { sql += ` AND p.price >= $${i++}`; params.push(Number(minPrice)); }
        if (maxPrice) { sql += ` AND p.price <= $${i++}`; params.push(Number(maxPrice)); }
        if (room) { sql += ` AND p.room = ANY($${i++})`; params.push([].concat(room as any)); }
        if (color) { sql += ` AND p.color = ANY($${i++})`; params.push([].concat(color as any)); }
        if (theme) { sql += ` AND p.theme = ANY($${i++})`; params.push([].concat(theme as any)); }

        const result = await query(sql, params);

        res.json(result.rows.map(p => ({
            ...p,
            specs: safeParse(p.specs),
            images: safeParse(p.images),
            videos: safeParse(p.videos),
            collection: p.collectionId ? {
                id: p.collectionId,
                title: p.collectionTitle,
                description: p.collectionDescription
            } : null
        })));
    } catch (error: any) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
