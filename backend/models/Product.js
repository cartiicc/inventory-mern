import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    buyingPrice: {
      type: Number,
      required: [true, 'Buying price is required'],
      min: [0, 'Buying price cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    supplier: {
      type: String,
      trim: true,
      default: '',
    },
    imageURL: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
      select: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual stock status — computed, never stored, always accurate
productSchema.virtual('stockStatus').get(function () {
  if (this.quantity <= 0) return 'out-of-stock';
  if (this.quantity <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

productSchema.virtual('profitMargin').get(function () {
  if (!this.buyingPrice) return 0;
  return Number((((this.sellingPrice - this.buyingPrice) / this.buyingPrice) * 100).toFixed(2));
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Compound text index for global search
productSchema.index({ name: 'text', sku: 'text', category: 'text', barcode: 'text' });

export default mongoose.model('Product', productSchema);
