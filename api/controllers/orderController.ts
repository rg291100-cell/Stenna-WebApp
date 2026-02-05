import { Request, Response, RequestHandler } from 'express';
import getDb, { query } from '../lib/db.js';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const createOrder: RequestHandler = async (req: AuthRequest, res: Response) => {
    const pool = getDb();
    const client = await pool.connect();

    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { type, items } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain items' });
        }

        await client.query('BEGIN');

        const orderResult = await client.query(
            `INSERT INTO "Order" (id, "userId", type, status, "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())
       RETURNING *`,
            [userId, type || 'SAMPLE', 'PENDING']
        );

        const order = orderResult.rows[0];

        for (const item of items) {
            await client.query(
                `INSERT INTO "OrderItem"
         (id, "orderId", "productId", quantity)
         VALUES (gen_random_uuid(), $1, $2, $3)`,
                [order.id, item.productId, item.quantity || 1]
            );
        }

        await client.query('COMMIT');

        const fullOrder = await query(
            `
      SELECT o.*,
             json_agg(json_build_object(
               'id', oi.id,
               'productId', oi."productId",
               'quantity', oi.quantity,
               'product', json_build_object(
                 'id', p.id,
                 'name', p.name,
                 'price', p.price,
                 'sku', p.sku
               )
             )) AS items
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
      LEFT JOIN "Product" p ON oi."productId" = p.id
      WHERE o.id = $1
      GROUP BY o.id
      `,
            [order.id]
        );

        res.status(201).json(fullOrder.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
};

export const getOrders: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await query(
            `
      SELECT o.*,
             json_agg(json_build_object(
               'id', oi.id,
               'productId', oi."productId",
               'quantity', oi.quantity,
               'product', json_build_object(
                 'id', p.id,
                 'name', p.name,
                 'price', p.price,
                 'sku', p.sku
               )
             )) AS items
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
      LEFT JOIN "Product" p ON oi."productId" = p.id
      WHERE o."userId" = $1
      GROUP BY o.id
      ORDER BY o."createdAt" DESC
      `,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
