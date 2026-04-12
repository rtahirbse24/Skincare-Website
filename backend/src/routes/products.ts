import express from 'express';
import multer from 'multer';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// Configure multer for image uploads
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, upload.array('images', 10), createProduct);
router.put('/:id', authMiddleware, upload.array('images', 10), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;