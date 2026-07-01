import api from './api';

export const orderService = {
  getOrders: (params) => api.get('/orders', { params }).then((r) => r.data),
  getOrderById: (id) => api.get(`/orders/${id}`).then((r) => r.data),
  createOrder: (data) => api.post('/orders', data).then((r) => r.data),
  updateOrderStatus: (id, orderStatus) => api.patch(`/orders/${id}/status`, { orderStatus }).then((r) => r.data),
};
