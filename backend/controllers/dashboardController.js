import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Aggregated dashboard statistics
// @route   GET /api/dashboard
// @access  Private (admin, staff)
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalProducts, lowStockCount, outOfStockCount, totalOrders, revenueAgg, recentOrders, recentActivity, categoryDistribution, monthlySales] =
    await Promise.all([
      Product.countDocuments({ isArchived: false }),

      Product.countDocuments({ isArchived: false, $expr: { $and: [{ $gt: ['$quantity', 0] }, { $lte: ['$quantity', '$lowStockThreshold'] }] } }),

      Product.countDocuments({ isArchived: false, quantity: { $lte: 0 } }),

      Order.countDocuments(),

      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),

      Order.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name'),

      AuditLog.find().sort({ createdAt: -1 }).limit(8),

      Product.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: '$category', count: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } },
        { $sort: { count: -1 } },
      ]),

      // Last 6 months of sales, grouped by year-month
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)) },
            orderStatus: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            totalSales: { $sum: '$totalPrice' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  res.status(200).json({
    success: true,
    stats: {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalOrders,
      revenue: revenueAgg[0]?.total || 0,
    },
    recentOrders,
    recentActivity,
    categoryDistribution: categoryDistribution.map((c) => ({ category: c._id || 'Uncategorized', count: c.count, totalQuantity: c.totalQuantity })),
    monthlySales: monthlySales.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      sales: m.totalSales,
      orders: m.orderCount,
    })),
  });
});
