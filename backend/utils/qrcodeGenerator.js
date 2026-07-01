import QRCode from 'qrcode';

/**
 * Generates a base64 PNG data URL for a product QR code (encodes SKU/id).
 * Frontend renders this directly in an <img src="..." />.
 */
export const generateProductQRCode = async (product) => {
  const payload = JSON.stringify({
    id: product._id,
    sku: product.sku,
    name: product.name,
  });
  return QRCode.toDataURL(payload, { width: 300, margin: 1 });
};
