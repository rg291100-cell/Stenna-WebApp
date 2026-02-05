import express from 'express';
import cors from 'cors';

// Routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import collectionRoutes from './routes/collection.routes.js';
import assortmentRoutes from './routes/assortment.routes.js';
import colorRoutes from './routes/color.routes.js';
import orderRoutes from './routes/order.routes.js';

// Controllers
import { getSetting, updateSetting } from './controllers/settingsController.js';
import { checkHealth } from './controllers/healthController.js';

const app = express();


app.use(cors());
app.use(express.json());

// Main API Routes
app.get('/api/health', checkHealth);
app.get('/api/diag', (req, res) => {
    // Show what db.ts is doing
    const activeUrl = (process.env.DATABASE_URL || '').trim();
    const masked = activeUrl.replace(/:[^:@]+@/, ':****@');

    // We can't easily see the Modified string from here without exposing it or exporting it
    res.json({
        env: process.env.NODE_ENV,
        db_configured: !!activeUrl,
        raw_host: masked.split('@')[1] || 'none',
        timestamp: new Date().toISOString(),
        help: "Check /api/health for direct DB test"
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

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('[API Error]:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        code: err.code
    });
});

export default app;
