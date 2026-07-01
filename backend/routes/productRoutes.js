import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getCategories,
  getProductQRCode,
  exportProductsCSV,
} from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import { productRules, stockUpdateRules } from '../validators/productValidator.js';
import { validate } from '../validators/authValidator.js';

const router = express.Router();

router.use(protect); // all product routes require authentication

router.get('/categories', getCategories);
router.get('/export/csv', authorize('admin'), exportProductsCSV);

router
  .route('/')
  .get(getProducts)
  .post(authorize('admin'), upload.single('image'), productRules, validate, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(authorize('admin'), upload.single('image'), updateProduct)
  .delete(authorize('admin'), deleteProduct);

router.patch('/:id/stock', stockUpdateRules, validate, updateStock); // admin + staff
router.get('/:id/qrcode', getProductQRCode);

export default router;
