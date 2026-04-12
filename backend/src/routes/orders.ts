import express from 'express';
import { createOrder, getOrders, updateOrderStatus, updateOrder, deleteOrder, completeOrder } from '../controllers/orderController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/', createOrder);
router.get('/', authMiddleware, getOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);
router.put('/:id', authMiddleware, updateOrder);
router.delete('/:id', authMiddleware, deleteOrder);
router.post('/:id/complete', authMiddleware, completeOrder);

export default router;