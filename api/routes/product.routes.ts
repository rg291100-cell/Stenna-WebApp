import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct
} from '../controllers/productController.js';
import {
    authenticateToken,
    authorizeRole
} from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, authorizeRole(['ADMIN']), createProduct);

export default router;
