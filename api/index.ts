import express from 'express';
import cors from 'cors';

// Explicitly use .js extensions for Vercel ESM compatibility
import authRoutes from '../server/src/routes/auth.routes.js.js';
import productRoutes from '../server/src/routes/product.routes.js.js';
import collectionRoutes from '../server/src/routes/collection.routes.js.js';
import assortmentRoutes from '../server/src/routes/assortment.routes.js.js';
import colorRoutes from '../server/src/routes/color.routes.js.js';
import orderRoutes from '../server/src/routes/order.routes.js.js';
import { getSetting, updateSetting } from '../server/src/controllers/settingsController.js.js';
import { checkHealth } from '../server/src/controllers/healthController.js.js';

const app = express();

app.use(cors());
app.use(express.json());

// Main API Routes
app.get('/api/health', checkHealth);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/assortments', assortmentRoutes);
app.use('/api/colors', colorRoutes);
app.get('/api/settings/:key', getSetting);
app.put('/api/settings/:key', updateSetting);
app.use('/api/orders', orderRoutes);

// Catch-all for API root
app.get('/api', (req, res) => {
    res.json({ message: 'Stenna API Operational' });
});

// Fallback for debugging
app.get('/', (req, res) => {
    res.json({ status: 'alive', info: 'B2B API Entry Point' });
});

export default app;
