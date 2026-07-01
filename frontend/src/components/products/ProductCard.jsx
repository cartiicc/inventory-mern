import { motion } from 'framer-motion';
import { Edit2, Trash2, QrCode, Package } from 'lucide-react';
import { stockStatusMeta, formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';

const ProductCard = ({ product, onEdit, onDelete, onViewQR, onImageZoom }) => {
  const { isAdmin } = useAuth();
  const status = stockStatusMeta(product);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card overflow-hidden group"
    >
      <div className="relative h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-zoom-in" onClick={() => onImageZoom(product)}>
        {product.imageURL ? (
          <img
            src={product.imageURL}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package size={40} />
          </div>
        )}
        <span className={`absolute top-2.5 right-2.5 ${status.className}`}>{status.label}</span>
      </div>

      <div className="p-4">
        <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold mt-0.5 truncate" title={product.name}>
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-lg">{formatCurrency(product.sellingPrice)}</span>
          <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button onClick={() => onEdit(product)} className="btn-secondary flex-1 !py-2 text-xs">
            <Edit2 size={14} /> Edit
          </button>
          <button onClick={() => onViewQR(product)} className="btn-secondary !py-2 !px-2.5">
            <QrCode size={14} />
          </button>
          {isAdmin && (
            <button onClick={() => onDelete(product)} className="btn-danger !py-2 !px-2.5">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
