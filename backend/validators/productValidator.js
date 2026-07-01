import { body } from 'express-validator';

export const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('buyingPrice').isFloat({ min: 0 }).withMessage('Buying price must be a positive number'),
  body('sellingPrice').isFloat({ min: 0 }).withMessage('Selling price must be a positive number'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
];

export const stockUpdateRules = [
  body('quantity').isInt().withMessage('Quantity must be an integer'),
  body('operation')
    .optional()
    .isIn(['set', 'increment', 'decrement'])
    .withMessage('Operation must be set, increment, or decrement'),
];
