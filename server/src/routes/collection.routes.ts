import express from 'express';
import { getCollections, getCollectionById } from '../controllers/collectionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCollections);
router.get('/:id', getCollectionById);

export default router;
