import { Request, Response, RequestHandler } from 'express';
import prisma from '../lib/prisma.js';

const safeParse = (val: any) => {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch (e) {
            return val;
        }
    }
    return val;
};

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

        const parsedProducts = products.map((p: any) => ({
            ...p,
            specs: safeParse(p.specs),
            images: Array.isArray(p.images) ? p.images : safeParse(p.images),
            videos: Array.isArray(p.videos) ? p.videos : safeParse(p.videos),
        }));

        res.json(parsedProducts);
    } catch (error: any) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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
            specs: safeParse(product.specs),
            images: Array.isArray(product.images) ? product.images : safeParse(product.images),
            videos: Array.isArray(product.videos) ? product.videos : safeParse(product.videos),
        };

        res.json(parsedProduct);
    } catch (error: any) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
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
