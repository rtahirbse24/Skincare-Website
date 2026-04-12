import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoriesController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authMiddleware, createCategory);
router.delete('/', authMiddleware, deleteCategory);

export default router;