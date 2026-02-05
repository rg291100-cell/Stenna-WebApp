import { Router } from 'express';
import {
    getCollections,
    getCollectionById
} from '../controllers/collectionController.js';

const router = Router();

router.get('/', getCollections);
router.get('/:id', getCollectionById);

export default router;
