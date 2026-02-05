import express from 'express';
import {
    createAssortment,
    getAssortments,
    getAssortmentById,
    updateAssortment,
    deleteAssortment
} from '../controllers/assortmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken); // All assortment routes require auth

router.post('/', createAssortment);
router.get('/', getAssortments);
router.get('/:id', getAssortmentById);
router.put('/:id', updateAssortment);
router.delete('/:id', deleteAssortment);

export default router;
