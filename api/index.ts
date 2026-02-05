import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();

// Since we are in the 'api' directory, we need to go up one level to reach 'server/src'
import authRoutes from '../server/src/routes/auth.routes';
import productRoutes from '../server/src/routes/product.routes';
import collectionRoutes from '../server/src/routes/collection.routes';
import assortmentRoutes from '../server/src/routes/assortment.routes';
import colorRoutes from '../server/src/routes/color.routes';
import orderRoutes from '../server/src/routes/order.routes';
import { getSetting, updateSetting } from '../server/src/controllers/settingsController';
import { checkHealth } from '../server/src/controllers/healthController';

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

export default app;
