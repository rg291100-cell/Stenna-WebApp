import express from 'express';
import cors from 'cors';
import { getProducts, getProductById, createProduct, } from './controllers/productController.js';
const app = express();
app.use(cors());
app.use(express.json());
/**
 * PRODUCTS ROUTES
 */
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProductById);
app.post('/api/products', createProduct);
/**
 * Health check (important for Vercel sanity)
 */
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
export default app;
