import { Request, Response, RequestHandler } from 'express';
import prisma from '../lib/prisma';

export const getProducts: RequestHandler = async (req, res) => {
    try {
        const { category, collectionId, search, minPrice, maxPrice } = req.query;

        const where: any = {};

        if (category) {
            where.category = category as string;
        }

        if (collectionId) {
            where.collectionId = collectionId as string;
        }

        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice as string);
            if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
        }

        // Filter Logic
        const { room, color, theme } = req.query;

        if (room) {
            where.room = { in: Array.isArray(room) ? (room as string[]) : [room as string] };
        }

        if (color) {
            where.color = { in: Array.isArray(color) ? (color as string[]) : [color as string] };
        }

        if (theme) {
            where.theme = { in: Array.isArray(theme) ? (theme as string[]) : [theme as string] };
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                collection: true,
            },
        });

        // Parse JSON strings back to objects
        const parsedProducts = products.map((p: any) => ({
            ...p,
            specs: p.specs ? JSON.parse(p.specs as string) : null,
            images: p.images ? JSON.parse(p.images as string) : [],
        }));

        res.json(parsedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProductById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Product ID is required' });
            return;
        }

        const product = await prisma.product.findUnique({
            where: { id: id as string },
            include: {
                collection: true,
            },
        });

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        const parsedProduct = {
            ...product,
            specs: product.specs ? JSON.parse(product.specs as string) : null,
            images: product.images ? JSON.parse(product.images as string) : [],
        };

        res.json(parsedProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Admin only: Create Product
export const createProduct: RequestHandler = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            specs: req.body.specs ? JSON.stringify(req.body.specs) : null,
            images: req.body.images ? JSON.stringify(req.body.images) : JSON.stringify([]),
        };

        const product = await prisma.product.create({
            data: productData,
        });
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
