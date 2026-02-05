import { Router } from 'express';
import {
    createAssortment,
    getAssortments,
    getAssortmentById,
    updateAssortment,
    deleteAssortment
} from '../controllers/assortmentController.js';

import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createAssortment);
router.get('/', getAssortments);
router.get('/:id', getAssortmentById);
router.put('/:id', updateAssortment);
router.delete('/:id', deleteAssortment);

export default router;
