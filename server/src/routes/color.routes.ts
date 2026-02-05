import express from 'express';
import { getColors, createColor } from '../controllers/colorController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.get('/', getColors);
router.post('/', authenticateToken, authorizeRole(['ADMIN']), createColor);

export default router;
