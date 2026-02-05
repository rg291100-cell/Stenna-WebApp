import { Request, Response, RequestHandler } from 'express';
import prisma from '../lib/prisma.js';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const createAssortment: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { name, productIds } = req.body;

        const assortment = await prisma.assortment.create({
            data: {
                name,
                userId,
                items: {
                    create: productIds.map((id: string) => ({
                        product: { connect: { id } }
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

        res.status(201).json(assortment);
    } catch (error) {
        console.error('Error creating assortment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAssortments: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const assortments = await prisma.assortment.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                _count: {
                    select: { items: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

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

        const assortment = await prisma.assortment.findUnique({
            where: { id: id as string },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!assortment) {
            res.status(404).json({ message: 'Assortment not found' });
            return;
        }
        if (assortment.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        res.json(assortment);
    } catch (error) {
        console.error('Error fetching assortment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateAssortment: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { name, productIds } = req.body;

        if (!id) {
            res.status(400).json({ message: 'ID required' });
            return;
        }

        const existingAssortment = await prisma.assortment.findUnique({ where: { id: id as string } });
        if (!existingAssortment) {
            res.status(404).json({ message: 'Assortment not found' });
            return;
        }
        if (existingAssortment.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        // Transaction to update items
        const updatedAssortment = await prisma.$transaction(async (tx) => {
            // Update name if provided
            if (name) {
                await tx.assortment.update({
                    where: { id: id as string },
                    data: { name }
                });
            }

            // If productIds provided, replace items
            if (productIds) {
                // Delete existing
                await tx.assortmentItem.deleteMany({
                    where: { assortmentId: id as string }
                });

                // Add new
                // Add new
                await Promise.all(productIds.map((productId: string) =>
                    tx.assortmentItem.create({
                        data: {
                            assortmentId: id as string,
                            productId
                        }
                    })
                ));
            }

            return tx.assortment.findUnique({
                where: { id: id as string },
                include: {
                    items: {
                        include: { product: true }
                    }
                }
            });
        });

        res.json(updatedAssortment);
    } catch (error) {
        console.error('Error updating assortment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAssortment: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'ID required' });
            return;
        }

        const existingAssortment = await prisma.assortment.findUnique({ where: { id: id as string } });
        if (!existingAssortment) {
            res.status(404).json({ message: 'Assortment not found' });
            return;
        }
        if (existingAssortment.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        await prisma.assortmentItem.deleteMany({ where: { assortmentId: id as string } });
        await prisma.assortment.delete({ where: { id: id as string } });

        res.json({ message: 'Assortment deleted successfully' });
    } catch (error) {
        console.error('Error deleting assortment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
