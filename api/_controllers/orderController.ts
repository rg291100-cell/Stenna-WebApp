import { Request, Response } from 'express';
import { query } from '../_lib/db.js';

interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { type, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain items' });
        }

        const orderResult = await query(
            `
            INSERT INTO "Order" (id, "userId", type, status)
            VALUES (gen_random_uuid(), $1, $2, 'PENDING')
            RETURNING *
            `,
            [userId, type ?? 'SAMPLE']
        );

        const order = orderResult[0];

        for (const item of items) {
            await query(
                `
                INSERT INTO "OrderItem"
                (id, "orderId", "productId", quantity)
                VALUES (gen_random_uuid(), $1, $2, $3)
                `,
                [order.id, item.productId, item.quantity ?? 1]
            );
        }

        res.status(201).json(order);
    } catch (error: any) {
        console.error('createOrder error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const rows = await query(
            `
            SELECT *
            FROM "Order"
            WHERE "userId" = $1
            `,
            [userId]
        );

        res.json(rows);
    } catch (error: any) {
        console.error('getOrders error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
