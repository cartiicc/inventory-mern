import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { productService } from '../../services/productService';
import { Download, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

const ProductQRModal = ({ product, onClose }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product) return;
    setLoading(true);
    productService
      .getQRCode(product._id)
      .then((res) => setQrCode(res.qrCode))
      .finally(() => setLoading(false));
  }, [product]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${product.sku}-qrcode.png`;
    link.click();
  };

  return (
    <Modal open={!!product} onClose={onClose} title={`QR Code — ${product?.name || ''}`} size="sm">
      <div className="flex flex-col items-center py-4">
        {loading ? (
          <Loader2 className="animate-spin text-primary-600" size={32} />
        ) : (
          qrCode && <img src={qrCode} alt="Product QR" className="w-56 h-56 rounded-xl border border-gray-100 dark:border-gray-800" />
        )}
        <p className="text-xs text-gray-400 mt-3 text-center">Scan to view product SKU & ID details</p>
        <Button className="mt-4" icon={Download} onClick={handleDownload} disabled={!qrCode}>
          Download PNG
        </Button>
      </div>
    </Modal>
  );
};

export default ProductQRModal;
