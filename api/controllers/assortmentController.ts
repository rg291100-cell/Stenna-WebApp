import { Request, Response, RequestHandler } from 'express';
import db from '../lib/db.js';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const createAssortment: RequestHandler = async (req: AuthRequest, res: Response) => {
    const client = await db.pool.connect();
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { name, productIds } = req.body;

        await client.query('BEGIN');

        const assortmentResult = await client.query(
            'INSERT INTO "Assortment" (id, name, "userId", "updatedAt") VALUES (gen_random_uuid(), $1, $2, NOW()) RETURNING *',
            [name, userId]
        );
        const assortment = assortmentResult.rows[0];

        for (const productId of productIds) {
            await client.query(
                'INSERT INTO "AssortmentItem" (id, "assortmentId", "productId") VALUES (gen_random_uuid(), $1, $2)',
                [assortment.id, productId]
            );
        }

        await client.query('COMMIT');

        // Fetch completed assortment with items
        const fullAssortmentResult = await db.query(`
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
                   )) as items
            FROM "Assortment" a
            LEFT JOIN "AssortmentItem" ai ON a.id = ai."assortmentId"
            LEFT JOIN "Product" p ON ai."productId" = p.id
            WHERE a.id = $1
            GROUP BY a.id
        `, [assortment.id]);

        res.status(201).json(fullAssortmentResult.rows[0]);
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
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const queryText = `
            SELECT a.*, 
                   COUNT(ai.id)::int as "itemCount",
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
                   )) FILTER (WHERE ai.id IS NOT NULL) as items
            FROM "Assortment" a
            LEFT JOIN "AssortmentItem" ai ON a.id = ai."assortmentId"
            LEFT JOIN "Product" p ON ai."productId" = p.id
            WHERE a."userId" = $1
            GROUP BY a.id
            ORDER BY a."updatedAt" DESC
        `;
        const result = await db.query(queryText, [userId]);

        const assortments = result.rows.map(a => ({
            ...a,
            _count: { items: a.itemCount },
            items: a.items || []
        }));

        res.json(assortments);
    } catch (error) {
        console.error('Error fetching assortments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAssortmentById: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'ID required' });
            return;
        }

        const queryText = `
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
                   )) FILTER (WHERE ai.id IS NOT NULL) as items
            FROM "Assortment" a
            LEFT JOIN "AssortmentItem" ai ON a.id = ai."assortmentId"
            LEFT JOIN "Product" p ON ai."productId" = p.id
            WHERE a.id = $1
            GROUP BY a.id
        `;
        const result = await db.query(queryText, [id]);
        const assortment = result.rows[0];

        if (!assortment) {
            res.status(404).json({ message: 'Assortment not found' });
            return;
        }
        if (assortment.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        assortment.items = assortment.items || [];
        res.json(assortment);
    } catch (error) {
        console.error('Error fetching assortment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateAssortment: RequestHandler = async (req: AuthRequest, res: Response) => {
    const client = await db.pool.connect();
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { name, productIds } = req.body;

        if (!id) {
            res.status(400).json({ message: 'ID required' });
            return;
        }

        const existingResult = await db.query('SELECT * FROM "Assortment" WHERE id = $1', [id]);
        const existingAssortment = existingResult.rows[0];

        if (!existingAssortment) {
            res.status(404).json({ message: 'Assortment not found' });
            return;
        }
        if (existingAssortment.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        await client.query('BEGIN');

        if (name) {
            await client.query('UPDATE "Assortment" SET name = $1, "updatedAt" = NOW() WHERE id = $2', [name, id]);
        } else {
            await client.query('UPDATE "Assortment" SET "updatedAt" = NOW() WHERE id = $1', [id]);
        }

        if (productIds) {
            await client.query('DELETE FROM "AssortmentItem" WHERE "assortmentId" = $1', [id]);
            for (const productId of productIds) {
                await client.query(
                    'INSERT INTO "AssortmentItem" (id, "assortmentId", "productId") VALUES (gen_random_uuid(), $1, $2)',
                    [id, productId]
                );
            }
        }

        await client.query('COMMIT');

        // Return updated
        const fullAssortmentResult = await db.query(`
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
                   )) FILTER (WHERE ai.id IS NOT NULL) as items
            FROM "Assortment" a
            LEFT JOIN "AssortmentItem" ai ON a.id = ai."assortmentId"
            LEFT JOIN "Product" p ON ai."productId" = p.id
            WHERE a.id = $1
            GROUP BY a.id
        `, [id]);

        res.json(fullAssortmentResult.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating assortment:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
};

export const deleteAssortment: RequestHandler = async (req: AuthRequest, res: Response) => {
    const client = await db.pool.connect();
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'ID required' });
            return;
        }

        const existingResult = await db.query('SELECT * FROM "Assortment" WHERE id = $1', [id]);
        const existingAssortment = existingResult.rows[0];

        if (!existingAssortment) {
            res.status(404).json({ message: 'Assortment not found' });
            return;
        }
        if (existingAssortment.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        await client.query('BEGIN');
        await client.query('DELETE FROM "AssortmentItem" WHERE "assortmentId" = $1', [id]);
        await client.query('DELETE FROM "Assortment" WHERE id = $1', [id]);
        await client.query('COMMIT');

        res.json({ message: 'Assortment deleted successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting assortment:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
};
