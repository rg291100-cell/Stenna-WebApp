import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();
const port = process.env.PORT || 3000;

import authRoutes from './routes/auth.routes.js.js';
import productRoutes from './routes/product.routes.js.js';
import collectionRoutes from './routes/collection.routes.js.js';
import assortmentRoutes from './routes/assortment.routes.js.js';
import colorRoutes from './routes/color.routes.js.js';
import orderRoutes from './routes/order.routes.js.js';
import { getSetting, updateSetting } from './controllers/settingsController.js.js';
import { checkHealth } from './controllers/healthController.js.js';

app.use(cors());
app.use(express.json());

app.get('/api/health', checkHealth);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/assortments', assortmentRoutes);
app.use('/api/colors', colorRoutes);
app.get('/api/settings/:key', getSetting);
app.put('/api/settings/:key', updateSetting);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('B2B Retailer Platform API');
});

// For Vercel, we export the app. Local dev uses separate logic usually.
// But we can keep a simple listen if env is NOT production
if (process.env.NODE_ENV !== 'production' && process.env.RUN_LOCAL === 'true') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
