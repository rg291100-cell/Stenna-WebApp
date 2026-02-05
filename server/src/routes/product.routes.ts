import express from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/productController.js.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, authorizeRole(['ADMIN']), createProduct);

export default router;
