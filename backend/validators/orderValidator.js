import { body } from 'express-validator';

export const orderRules = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one product'),
  body('products.*.product').notEmpty().withMessage('Each item requires a product id'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Each item requires a quantity of at least 1'),
];
