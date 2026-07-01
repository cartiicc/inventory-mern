import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: String,
    action: {
      type: String,
      enum: [
        'PRODUCT_CREATED',
        'PRODUCT_UPDATED',
        'PRODUCT_DELETED',
        'STOCK_UPDATED',
        'ORDER_CREATED',
        'ORDER_STATUS_CHANGED',
        'USER_CREATED',
        'USER_UPDATED',
        'USER_DELETED',
      ],
      required: true,
    },
    entityType: { type: String, enum: ['Product', 'Order', 'User'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
