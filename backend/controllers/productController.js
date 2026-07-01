import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { logActivity } from '../utils/auditLogger.js';
import { sendEmail } from '../utils/sendEmail.js';
import { productAddedTemplate, productDeletedTemplate, lowStockTemplate, outOfStockTemplate } from '../utils/emailTemplates.js';
import { generateProductQRCode } from '../utils/qrcodeGenerator.js';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;

/**
 * Checks stock thresholds after any quantity mutation and fires the
 * appropriate email alert. Designed to be awaited but never block the
 * main response (caller can fire-and-forget).
 */
const checkStockAlerts = async (product) => {
  if (!ADMIN_EMAIL) return;
  if (product.quantity <= 0) {
    await sendEmail({ to: ADMIN_EMAIL, subject: `🚨 Out of Stock: ${product.name}`, html: outOfStockTemplate(product) });
  } else if (product.quantity <= product.lowStockThreshold) {
    await sendEmail({ to: ADMIN_EMAIL, subject: `⚠️ Low Stock: ${product.name}`, html: lowStockTemplate(product) });
  }
};

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Private (admin, staff)
export const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    stockStatus,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isArchived: false };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { barcode: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) query.category = category;

  if (minPrice || maxPrice) {
    query.sellingPrice = {};
    if (minPrice) query.sellingPrice.$gte = Number(minPrice);
    if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
  }

  if (stockStatus === 'low-stock') {
    query.$expr = { $and: [{ $gt: ['$quantity', 0] }, { $lte: ['$quantity', '$lowStockThreshold'] }] };
  } else if (stockStatus === 'out-of-stock') {
    query.quantity = { $lte: 0 };
  } else if (stockStatus === 'in-stock') {
    query.$expr = { $gt: ['$quantity', '$lowStockThreshold'] };
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const sortDirection = sortOrder === 'asc' ? 1 : -1;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email'),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    products,
  });
});

// @desc    Get single product by id
// @route   GET /api/products/:id
// @access  Private
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json({ success: true, product });
});

// @desc    Create product (with optional Cloudinary image upload)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, sku, barcode, buyingPrice, sellingPrice, quantity, supplier, lowStockThreshold } = req.body;

  const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
  if (existingSku) {
    res.status(409);
    throw new Error('A product with this SKU already exists');
  }

  let imageURL = '';
  let imagePublicId = '';

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    imageURL = result.url;
    imagePublicId = result.publicId;
  }

  const product = await Product.create({
    name,
    description,
    category,
    sku,
    barcode: barcode || undefined,
    buyingPrice,
    sellingPrice,
    quantity: quantity || 0,
    lowStockThreshold: lowStockThreshold || 5,
    supplier,
    imageURL,
    imagePublicId,
    createdBy: req.user._id,
  });

  await logActivity({
    user: req.user,
    action: 'PRODUCT_CREATED',
    entityType: 'Product',
    entityId: product._id,
    description: `${req.user.name} added new product "${product.name}"`,
  });

  if (ADMIN_EMAIL) {
    sendEmail({ to: ADMIN_EMAIL, subject: `✅ Product Added: ${product.name}`, html: productAddedTemplate(product) });
  }

  res.status(201).json({ success: true, product });
});

// @desc    Update product details
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = ['name', 'description', 'category', 'sku', 'barcode', 'buyingPrice', 'sellingPrice', 'supplier', 'lowStockThreshold'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  if (req.file) {
    if (product.imagePublicId) await deleteFromCloudinary(product.imagePublicId);
    const result = await uploadToCloudinary(req.file.buffer);
    product.imageURL = result.url;
    product.imagePublicId = result.publicId;
  }

  const updated = await product.save();

  await logActivity({
    user: req.user,
    action: 'PRODUCT_UPDATED',
    entityType: 'Product',
    entityId: product._id,
    description: `${req.user.name} updated product "${product.name}"`,
  });

  res.status(200).json({ success: true, product: updated });
});

// @desc    Delete (archive) a product — Admin only
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.imagePublicId) await deleteFromCloudinary(product.imagePublicId);
  await product.deleteOne();

  await logActivity({
    user: req.user,
    action: 'PRODUCT_DELETED',
    entityType: 'Product',
    entityId: product._id,
    description: `${req.user.name} deleted product "${product.name}"`,
  });

  if (ADMIN_EMAIL) {
    sendEmail({ to: ADMIN_EMAIL, subject: `🗑️ Product Deleted: ${product.name}`, html: productDeletedTemplate(product) });
  }

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Update stock quantity (staff & admin)
// @route   PATCH /api/products/:id/stock
// @access  Private (admin, staff)
export const updateStock = asyncHandler(async (req, res) => {
  const { quantity, operation = 'set' } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const previousQty = product.quantity;

  if (operation === 'increment') product.quantity += Number(quantity);
  else if (operation === 'decrement') product.quantity = Math.max(0, product.quantity - Number(quantity));
  else product.quantity = Math.max(0, Number(quantity));

  await product.save();

  await logActivity({
    user: req.user,
    action: 'STOCK_UPDATED',
    entityType: 'Product',
    entityId: product._id,
    description: `${req.user.name} changed stock for "${product.name}" from ${previousQty} to ${product.quantity}`,
    metadata: { previousQty, newQty: product.quantity },
  });

  checkStockAlerts(product); // fire-and-forget

  res.status(200).json({ success: true, product });
});

// @desc    Get distinct categories (for filters/dropdowns)
// @route   GET /api/products/categories
// @access  Private
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isArchived: false });
  res.status(200).json({ success: true, categories });
});

// @desc    Generate a QR code (base64 PNG) for a product
// @route   GET /api/products/:id/qrcode
// @access  Private
export const getProductQRCode = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const qrDataURL = await generateProductQRCode(product);
  res.status(200).json({ success: true, qrCode: qrDataURL });
});

// @desc    Export all products as CSV
// @route   GET /api/products/export/csv
// @access  Private/Admin
export const exportProductsCSV = asyncHandler(async (req, res) => {
  const products = await Product.find({ isArchived: false }).lean();

  const headers = ['Name', 'SKU', 'Barcode', 'Category', 'Buying Price', 'Selling Price', 'Quantity', 'Supplier', 'Stock Status'];
  const rows = products.map((p) => {
    const status = p.quantity <= 0 ? 'Out of Stock' : p.quantity <= p.lowStockThreshold ? 'Low Stock' : 'In Stock';
    return [p.name, p.sku, p.barcode || '', p.category, p.buyingPrice, p.sellingPrice, p.quantity, p.supplier || '', status];
  });

  const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="products_export.csv"');
  res.status(200).send(csv);
});
