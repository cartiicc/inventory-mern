import express from 'express';
import { getOrders, getOrderById, createOrder, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { orderRules } from '../validators/orderValidator.js';
import { validate } from '../validators/authValidator.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getOrders).post(authorize('admin', 'staff'), orderRules, validate, createOrder);
router.route('/:id').get(getOrderById);
router.patch('/:id/status', authorize('admin', 'staff'), updateOrderStatus);

export default router;
