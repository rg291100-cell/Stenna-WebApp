import express from 'express';
import { getProducts, getProductById, createProduct, } from './controllers/productController.js';
const router = express.Router();
/**
 * ORDER MATTERS
 * Static routes FIRST
 * Dynamic :id route LAST
 */
router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
export default router;
