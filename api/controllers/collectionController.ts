import { Request, Response, RequestHandler } from 'express';
import { query } from '../lib/db.js';

export const getCollections: RequestHandler = async (req, res) => {
    try {
        const result = await query(`
      SELECT c.*, COUNT(p.id)::int AS "productCount"
      FROM "Collection" c
      LEFT JOIN "Product" p ON c.id = p."collectionId"
      GROUP BY c.id
    `);

        res.json(
            result.rows.map(c => ({
                ...c,
                _count: { products: c.productCount }
            }))
        );
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCollectionById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Collection ID is required' });

        const collectionResult = await query(
            'SELECT * FROM "Collection" WHERE id = $1',
            [id]
        );

        const collection = collectionResult.rows[0];
        if (!collection) return res.status(404).json({ message: 'Collection not found' });

        const productsResult = await query(
            'SELECT * FROM "Product" WHERE "collectionId" = $1',
            [id]
        );

        collection.products = productsResult.rows.map(p => ({
            ...p,
            specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs,
            images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
            videos: typeof p.videos === 'string' ? JSON.parse(p.videos) : p.videos
        }));

        res.json(collection);
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
