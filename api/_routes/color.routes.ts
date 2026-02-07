import { Router } from 'express';
import {
    getColors,
    createColor
} from '../_controllers/colorController.js';
import {
    authenticateToken,
    authorizeRole
} from '../_middleware/auth.js';

const router = Router();

router.get('/', getColors);
router.post('/', authenticateToken, authorizeRole(['ADMIN']), createColor);

export default router;
