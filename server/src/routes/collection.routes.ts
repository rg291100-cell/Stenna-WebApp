import express from 'express';
import { getCollections, getCollectionById } from '../controllers/collectionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', getCollections);
router.get('/:id', getCollectionById);

export default router;
