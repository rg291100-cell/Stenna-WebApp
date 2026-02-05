import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import collectionRoutes from './routes/collection.routes';
import assortmentRoutes from './routes/assortment.routes';
import colorRoutes from './routes/color.routes';
import orderRoutes from './routes/order.routes';
import { getSetting, updateSetting } from './controllers/settingsController';
import { checkHealth } from './controllers/healthController';

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

// Conditional listen for local dev, export for Vercel
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
