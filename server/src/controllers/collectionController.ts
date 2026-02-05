import { Request, Response, RequestHandler } from 'express';
import prisma from '../lib/prisma.js.js';

export const getCollections: RequestHandler = async (req, res) => {
    try {
        const collections = await prisma.collection.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        res.json(collections);
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCollectionById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Collection ID is required' });
            return;
        }

        const collection = await prisma.collection.findUnique({
            where: { id: id as string },
            include: {
                products: true,
            },
        });

        if (!collection) {
            res.status(404).json({ message: 'Collection not found' });
            return;
        }

        res.json(collection);
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
