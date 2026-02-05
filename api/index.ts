import express from 'express';
import cors from 'cors';

// Use local paths in the api folder to guarantee Vercel bundling
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import collectionRoutes from './routes/collection.routes.js';
import assortmentRoutes from './routes/assortment.routes.js';
import colorRoutes from './routes/color.routes.js';
import orderRoutes from './routes/order.routes.js';
import { getSetting, updateSetting } from './controllers/settingsController.js';
import { checkHealth } from './controllers/healthController.js';

const app = express();

app.use(cors());
app.use(express.json());

// Global Error Handler for better diagnostics on Vercel
app.use((err: any, req: any, res: any, next: any) => {
    console.error('[API Error]:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        code: err.code,
        path: req.path
    });
});

// Main API Routes
app.get('/api/health', checkHealth);
app.get('/api/diag', (req, res) => {
    const url = process.env.DATABASE_URL || '';
    const masked = url.replace(/:[^:@]+@/, ':****@');
    const user = url.split('://')[1]?.split(':')[0] || 'none';
    res.json({
        env: process.env.NODE_ENV,
        db_user: user.includes('.') ? `${user.split('.')[0]}.****` : user,
        db_configured: !!url,
        db_host_info: masked.split('@')[1] || 'none',
        timestamp: new Date().toISOString()
    });
});
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
    res.json({ message: 'Stenna API Operational - Unified Built' });
});

// Fallback for debugging
app.get('/', (req, res) => {
    res.json({ status: 'alive', info: 'B2B API Entry Point' });
});

export default app;
