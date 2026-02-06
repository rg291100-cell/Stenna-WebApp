import express from 'express';
import cors from 'cors';
import { getProducts, getProductById, } from './controllers/productController.js';
const app = express();
app.use(cors());
app.use(express.json());
/**
 * PRODUCTS ROUTES
 */
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProductById);
/**
 * Health check (important for Vercel sanity)
 */
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
export default app;
