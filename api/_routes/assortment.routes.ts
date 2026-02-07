import { Router } from 'express';
import {
    createAssortment,
    getAssortments,
    getAssortmentById,
    updateAssortment,
    deleteAssortment
} from '../_controllers/assortmentController.js';
import { authenticateToken } from '../_middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createAssortment);
router.get('/', getAssortments);
router.get('/:id', getAssortmentById);
router.put('/:id', updateAssortment);
router.delete('/:id', deleteAssortment);

export default router;
