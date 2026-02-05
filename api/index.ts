import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes with .js extension for ESM compatibility
import authRoutes from '../server/src/routes/auth.routes.js';
import productRoutes from '../server/src/routes/product.routes.js';
import collectionRoutes from '../server/src/routes/collection.routes.js';
import assortmentRoutes from '../server/src/routes/assortment.routes.js';
import colorRoutes from '../server/src/routes/color.routes.js';
import orderRoutes from '../server/src/routes/order.routes.js';
import { getSetting, updateSetting } from '../server/src/controllers/settingsController.js';
import { checkHealth } from '../server/src/controllers/healthController.js';

// Initialize environment variables
dotenv.config();

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', checkHealth);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/assortments', assortmentRoutes);
app.use('/api/colors', colorRoutes);
app.get('/api/settings/:key', getSetting);
app.put('/api/settings/:key', updateSetting);
app.use('/api/orders', orderRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Stenna API is operational' });
});

export default app;
