import express from 'express';
import cors from 'cors';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from './controllers/productController.js';
import authRoutes from './routes/auth.routes.js';
import collectionRoutes from './routes/collection.routes.js';
import orderRoutes from './routes/order.routes.js';
import assortmentRoutes from './routes/assortment.routes.js';
import colorRoutes from './routes/color.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProductById);
app.post('/api/products', createProduct);
app.put('/api/products/:id', updateProduct);
app.delete('/api/products/:id', deleteProduct);
app.use('/api/collections', collectionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/assortments', assortmentRoutes);
app.use('/api/colors', colorRoutes);

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', version: '2.0.1', timestamp: new Date().toISOString() });
});

export default app;
