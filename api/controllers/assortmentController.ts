import { Request, Response, RequestHandler } from 'express';
import getDb, { query } from '../lib/db.js';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const createAssortment: RequestHandler = async (req: AuthRequest, res: Response) => {
    const pool = getDb();
    const client = await pool.connect();

    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { name, productIds } = req.body;

        await client.query('BEGIN');

        const assortmentResult = await client.query(
            `INSERT INTO "Assortment" (id, name, "userId", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, NOW())
       RETURNING *`,
            [name, userId]
        );

        const assortment = assortmentResult.rows[0];

        for (const productId of productIds) {
            await client.query(
                `INSERT INTO "AssortmentItem" (id, "assortmentId", "productId")
         VALUES (gen_random_uuid(), $1, $2)`,
                [assortment.id, productId]
            );
        }

        await client.query('COMMIT');

        const fullAssortment = await query(
            `
      SELECT a.*,
             json_agg(json_build_object(
               'id', ai.id,
               'productId', ai."productId",
               'product', json_build_object(
                 'id', p.id,
                 'name', p.name,
                 'price', p.price,
                 'sku', p.sku,
                 'images', p.images
               )
             )) FILTER (WHERE ai.id IS NOT NULL) AS items
      FROM "Assortment" a
      LEFT JOIN "AssortmentItem" ai ON a.id = ai."assortmentId"
      LEFT JOIN "Product" p ON ai."productId" = p.id
      WHERE a.id = $1
      GROUP BY a.id
      `,
            [assortment.id]
        );

        res.status(201).json(fullAssortment.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating assortment:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
};

export const getAssortments: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await query(
            `
      SELECT a.*,
             COUNT(ai.id)::int AS "itemCount",
             json_agg(json_build_object(
               'id', ai.id,
               'productId', ai."productId",
               'product', json_build_object(
                 'id', p.id,
                 'name', p.name,
                 'price', p.price,
                 'sku', p.sku,
                 'images', p.images
               )
             )) FILTER (WHERE ai.id IS NOT NULL) AS items
      FROM "Assortment" a
      LEFT JOIN "AssortmentItem" ai ON a.id = ai."assortmentId"
      LEFT JOIN "Product" p ON ai."productId" = p.id
      WHERE a."userId" = $1
      GROUP BY a.id
      ORDER BY a."updatedAt" DESC
      `,
            [userId]
        );

        res.json(
            result.rows.map(a => ({
                ...a,
                _count: { items: a.itemCount },
                items: a.items || []
            }))
        );
    } catch (error) {
        console.error('Error fetching assortments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
