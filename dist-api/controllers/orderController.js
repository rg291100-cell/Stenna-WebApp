import { query } from '../lib/db.js';
export const createOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { type, items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain items' });
        }
        const orderResult = await query(`
            INSERT INTO "Order" (id, "userId", type, status)
            VALUES (gen_random_uuid(), $1, $2, 'PENDING')
            RETURNING *
            `, [userId, type ?? 'SAMPLE']);
        const order = orderResult.rows[0];
        for (const item of items) {
            await query(`
                INSERT INTO "OrderItem"
                (id, "orderId", "productId", quantity)
                VALUES (gen_random_uuid(), $1, $2, $3)
                `, [order.id, item.productId, item.quantity ?? 1]);
        }
        res.status(201).json(order);
    }
    catch (error) {
        console.error('createOrder error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = await query(`
            SELECT *
            FROM "Order"
            WHERE "userId" = $1
            ORDER BY "createdAt" DESC
            `, [userId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('getOrders error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
