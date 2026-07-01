import AuditLog from '../models/AuditLog.js';

/**
 * Writes an audit log entry. Fire-and-forget — never blocks the main request.
 */
export const logActivity = async ({ user, action, entityType, entityId, description, metadata = {} }) => {
  try {
    await AuditLog.create({
      user: user._id,
      userName: user.name,
      action,
      entityType,
      entityId,
      description,
      metadata,
    });
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
};

/**
 * Generates a human-readable, sortable order number: ORD-20260628-0001 style.
 */
export const generateOrderNumber = async (OrderModel) => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const countToday = await OrderModel.countDocuments({
    orderNumber: { $regex: `^ORD-${datePart}` },
  });
  const seq = String(countToday + 1).padStart(4, '0');
  return `ORD-${datePart}-${seq}`;
};
