import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { generateOrderNumber, logActivity } from '../utils/auditLogger.js';
import { sendEmail } from '../utils/sendEmail.js';
import { newOrderTemplate } from '../utils/emailTemplates.js';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;

// @desc    Get all orders (filter, paginate)
// @route   GET /api/orders
// @access  Private (admin, staff)
export const getOrders = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status) query.orderStatus = status;
  if (search) query.$or = [{ customerName: { $regex: search, $options: 'i' } }, { orderNumber: { $regex: search, $options: 'i' } }];

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, parseInt(limit));

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('createdBy', 'name email'),
    Order.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    orders,
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('createdBy', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.status(200).json({ success: true, order });
});

// @desc    Create order — decrements inventory atomically per product
// @route   POST /api/orders
// @access  Private (admin, staff)
export const createOrder = asyncHandler(async (req, res) => {
  const { customerName, customerEmail, products: items, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Order must include at least one product');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}" — only ${product.quantity} left`);
      }

      product.quantity -= item.quantity;
      await product.save({ session });

      const subtotal = product.sellingPrice * item.quantity;
      totalPrice += subtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.sellingPrice,
        subtotal,
      });
    }

    const orderNumber = await generateOrderNumber(Order);

    const order = await Order.create(
      [
        {
          orderNumber,
          customerName,
          customerEmail,
          products: orderItems,
          totalPrice,
          createdBy: req.user._id,
          notes,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const createdOrder = order[0];

    await logActivity({
      user: req.user,
      action: 'ORDER_CREATED',
      entityType: 'Order',
      entityId: createdOrder._id,
      description: `${req.user.name} created order ${createdOrder.orderNumber} for ${customerName}`,
    });

    if (ADMIN_EMAIL) {
      sendEmail({ to: ADMIN_EMAIL, subject: `🛒 New Order: ${createdOrder.orderNumber}`, html: newOrderTemplate(createdOrder) });
    }

    res.status(201).json({ success: true, order: createdOrder });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    throw new Error(err.message);
  }
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (admin, staff)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = orderStatus;
  await order.save();

  await logActivity({
    user: req.user,
    action: 'ORDER_STATUS_CHANGED',
    entityType: 'Order',
    entityId: order._id,
    description: `${req.user.name} changed order ${order.orderNumber} status to ${orderStatus}`,
  });

  res.status(200).json({ success: true, order });
});
