import { forwardRef } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Printable invoice. Wrapped in forwardRef so react-to-print can target it.
 */
const InvoiceTemplate = forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <div ref={ref} className="p-10 bg-white text-gray-800 max-w-2xl mx-auto">
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-700">INVOICE</h1>
          <p className="text-sm text-gray-500 mt-1">#{order.orderNumber}</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p className="font-semibold text-gray-800">Inventory Management System</p>
          <p>{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs uppercase text-gray-400 font-semibold">Billed To</p>
        <p className="font-medium">{order.customerName}</p>
        {order.customerEmail && <p className="text-sm text-gray-500">{order.customerEmail}</p>}
      </div>

      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b text-gray-400 uppercase text-xs">
            <th className="text-left py-2">Item</th>
            <th className="text-center py-2">Qty</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-100">
              <td className="py-2.5">{item.name}</td>
              <td className="text-center py-2.5">{item.quantity}</td>
              <td className="text-right py-2.5">{formatCurrency(item.price)}</td>
              <td className="text-right py-2.5">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-48 text-sm">
          <div className="flex justify-between py-1 font-bold text-base border-t pt-2">
            <span>Total</span>
            <span>{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-10 text-center">Thank you for your business!</p>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
export default InvoiceTemplate;
