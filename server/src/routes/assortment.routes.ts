import express from 'express';
import {
    createAssortment,
    getAssortments,
    getAssortmentById,
    updateAssortment,
    deleteAssortment
} from '../controllers/assortmentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken); // All assortment routes require auth

router.post('/', createAssortment);
router.get('/', getAssortments);
router.get('/:id', getAssortmentById);
router.put('/:id', updateAssortment);
router.delete('/:id', deleteAssortment);

export default router;
