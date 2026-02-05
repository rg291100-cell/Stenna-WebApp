import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js.js';
import { authenticateToken } from '../middleware/auth.js.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createOrder);
router.get('/', getOrders);

export default router;
