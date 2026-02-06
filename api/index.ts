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

// DB (for diagnostics only)
import { query } from './lib/db.js';

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   Health & Diagnostics
========================= */

app.get('/api/health', checkHealth);

/**
 * DB connectivity test
 * This is TEMPORARY but CRITICAL for debugging
 */
app.get('/api/db-test', async (_req, res) => {
    try {
        const result = await query('SELECT 1 AS ok');
        res.json({
            db: 'connected',
            result: result.rows
        });
    } catch (err: any) {
        console.error('DB TEST ERROR:', err);
        res.status(500).json({
            db: 'failed',
            error: err.message,
            stack: err.stack
        });
    }
});

/**
 * Environment diagnostics
 */
app.get('/api/diag', (_req, res) => {
    const activeUrl = (process.env.DATABASE_URL || '').trim();
    const masked = activeUrl
        ? activeUrl.replace(/:[^:@]+@/, ':****@')
        : 'not-set';

    res.json({
        env: process.env.NODE_ENV,
        db_configured: !!activeUrl,
        db_host: masked.split('@')[1] || 'none',
        timestamp: new Date().toISOString()
    });
});

/* =========================
   API Routes
========================= */

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/assortments', assortmentRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/settings/:key', getSetting);
app.put('/api/settings/:key', updateSetting);

/* =========================
   Base Routes
========================= */

app.get('/api', (_req, res) => {
    res.json({ message: 'Stenna API Operational' });
});

app.get('/', (_req, res) => {
    res.json({ status: 'alive', service: 'Stenna API' });
});

/* =========================
   Global Error Handler
========================= */

app.use((err: any, _req: any, res: any, _next: any) => {
    console.error('[API Error]', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

export default app;
