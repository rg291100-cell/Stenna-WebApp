import { Request, Response, RequestHandler } from 'express';
import prisma from '../lib/prisma.js.js';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const createOrder: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { type, items } = req.body; // items: { productId: string, quantity: number }[]

        if (!items || items.length === 0) {
            res.status(400).json({ message: 'Order must contain items' });
            return;
        }

        const order = await prisma.order.create({
            data: {
                userId,
                type: (type as string) || 'SAMPLE',
                items: {
                    create: items.map((item: any) => ({
                        product: { connect: { id: item.productId } },
                        quantity: item.quantity || 1
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrders: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
