import { Router } from 'express';
import { getColors, createColor } from '../controllers/colorController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
const router = Router();
router.get('/', getColors);
router.post('/', authenticateToken, authorizeRole(['ADMIN']), createColor);
export default router;
