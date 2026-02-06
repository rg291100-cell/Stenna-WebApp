import { Router } from 'express';
import {
    getCollections,
    getCollectionById
} from '../controllers/collectionController';

const router = Router();

router.get('/', getCollections);
router.get('/:id', getCollectionById);

export default router;
