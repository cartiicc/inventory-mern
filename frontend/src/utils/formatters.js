export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

export const formatDate = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
};

export const formatNumber = (value = 0) => new Intl.NumberFormat('en-US').format(value || 0);

export const stockStatusMeta = (product) => {
  if (product.quantity <= 0) return { label: 'Out of Stock', className: 'badge-danger' };
  if (product.quantity <= (product.lowStockThreshold ?? 5)) return { label: 'Low Stock', className: 'badge-warning' };
  return { label: 'In Stock', className: 'badge-success' };
};

export const orderStatusMeta = (status) => {
  const map = {
    pending: { label: 'Pending', className: 'badge-warning' },
    processing: { label: 'Processing', className: 'badge bg-primary-100 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' },
    completed: { label: 'Completed', className: 'badge-success' },
    cancelled: { label: 'Cancelled', className: 'badge-danger' },
  };
  return map[status] || map.pending;
};
