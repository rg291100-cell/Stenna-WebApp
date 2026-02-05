import { Router } from 'express';
import {
    createOrder,
    getOrders
} from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createOrder);
router.get('/', getOrders);

export default router;
