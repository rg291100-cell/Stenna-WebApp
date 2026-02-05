import express from 'express';
import { getColors, createColor } from '../controllers/colorController.js.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js.js';

const router = express.Router();

router.get('/', getColors);
router.post('/', authenticateToken, authorizeRole(['ADMIN']), createColor);

export default router;
