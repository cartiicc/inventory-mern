import api from './api';

export const productService = {
  getProducts: (params) => api.get('/products', { params }).then((r) => r.data),
  getProductById: (id) => api.get(`/products/${id}`).then((r) => r.data),
  createProduct: (formData) =>
    api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  updateProduct: (id, formData) =>
    api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  deleteProduct: (id) => api.delete(`/products/${id}`).then((r) => r.data),
  updateStock: (id, payload) => api.patch(`/products/${id}/stock`, payload).then((r) => r.data),
  getCategories: () => api.get('/products/categories').then((r) => r.data),
  getQRCode: (id) => api.get(`/products/${id}/qrcode`).then((r) => r.data),
  exportCSV: () => api.get('/products/export/csv', { responseType: 'blob' }).then((r) => r.data),
};
