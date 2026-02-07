import { Router } from 'express';
import {
    createOrder,
    getOrders
} from '../_controllers/orderController.js';
import { authenticateToken } from '../_middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createOrder);
router.get('/', getOrders);

export default router;
