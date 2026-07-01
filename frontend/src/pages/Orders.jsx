import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { Plus, Printer, Eye } from 'lucide-react';
import { fetchOrders, createOrder, updateOrderStatus } from '../features/orders/orderSlice';
import { fetchProducts } from '../features/products/productSlice';
import CreateOrderForm from '../components/orders/CreateOrderForm';
import InvoiceTemplate from '../components/orders/InvoiceTemplate';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/Skeleton';
import { formatCurrency, formatDate, orderStatusMeta } from '../utils/formatters';

const Orders = () => {
  const dispatch = useDispatch();
  const { items, page, totalPages, loading } = useSelector((s) => s.orders);
  const { items: products } = useSelector((s) => s.products);

  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const invoiceRef = useRef();
  const handlePrint = useReactToPrint({ content: () => invoiceRef.current });

  useEffect(() => {
    dispatch(fetchOrders({ status: statusFilter || undefined }));
  }, [dispatch, statusFilter]);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const handleCreateOrder = async (data) => {
    setSubmitting(true);
    const result = await dispatch(createOrder(data));
    setSubmitting(false);
    if (result.meta.requestStatus === 'fulfilled') {
      setFormOpen(false);
      dispatch(fetchProducts({ force: true })); // stock levels changed
    }
  };

  const handleStatusChange = (order, orderStatus) => {
    dispatch(updateOrderStatus({ id: order._id, orderStatus }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Process orders and track fulfillment</p>
        </div>
        <Button icon={Plus} onClick={() => setFormOpen(true)}>
          New Order
        </Button>
      </div>

      <div className="card p-4 flex gap-3">
        <Select
          placeholder="All Statuses"
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:w-56"
        />
      </div>

      <div className="card p-5 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No orders found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100 dark:border-gray-800">
                <th className="pb-3 pr-4">Order #</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Items</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((order) => {
                const status = orderStatusMeta(order.orderStatus);
                return (
                  <tr key={order._id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <td className="py-3 pr-4 font-medium">{order.orderNumber}</td>
                    <td className="py-3 pr-4">{order.customerName}</td>
                    <td className="py-3 pr-4">{order.products.length} item(s)</td>
                    <td className="py-3 pr-4 font-semibold">{formatCurrency(order.totalPrice)}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                        className={`${status.className} border-none cursor-pointer text-xs`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{formatDate(order.createdAt)}</td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => setInvoiceOrder(order)}
                        className="btn-ghost !px-2 !py-1.5 text-primary-600"
                        title="View Invoice"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => dispatch(fetchOrders({ status: statusFilter || undefined, page: p }))} />

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Create New Order" size="lg">
        <CreateOrderForm products={products} onSubmit={handleCreateOrder} onCancel={() => setFormOpen(false)} loading={submitting} />
      </Modal>

      <Modal open={!!invoiceOrder} onClose={() => setInvoiceOrder(null)} title="Invoice" size="lg">
        <InvoiceTemplate ref={invoiceRef} order={invoiceOrder} />
        <div className="flex justify-end mt-4">
          <Button icon={Printer} onClick={handlePrint}>
            Print / Save PDF
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
