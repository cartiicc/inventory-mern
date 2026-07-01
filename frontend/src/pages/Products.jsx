import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Download, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  setFilters,
} from '../features/products/productSlice';
import ProductCard from '../components/products/ProductCard';
import ProductForm from '../components/products/ProductForm';
import ImageZoomModal from '../components/products/ImageZoomModal';
import ProductQRModal from '../components/products/ProductQRModal';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Pagination from '../components/ui/Pagination';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useDebounce } from '../hooks/useDebounce';
import { useConfirm } from '../hooks/useConfirm';
import { useAuth } from '../hooks/useAuth';
import { productService } from '../services/productService';
import { downloadBlob } from '../utils/exportCSV';

const Products = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const { items, categories, page, totalPages, filters, loading } = useSelector((s) => s.products);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [zoomProduct, setZoomProduct] = useState(null);
  const [qrProduct, setQrProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const loadProducts = useCallback(
    (overrides = {}) => {
      dispatch(
        fetchProducts({
          search: debouncedSearch,
          ...filters,
          ...overrides,
          force: true,
        })
      );
    },
    [dispatch, debouncedSearch, filters]
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    loadProducts({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.category, filters.stockStatus, filters.sortBy, filters.sortOrder]);

  const handleCreateOrUpdate = async (formData) => {
    setSubmitting(true);
    const action = editingProduct
      ? updateProduct({ id: editingProduct._id, formData })
      : createProduct(formData);
    const result = await dispatch(action);
    setSubmitting(false);
    if (result.meta.requestStatus === 'fulfilled') {
      setFormOpen(false);
      setEditingProduct(null);
    }
  };

  const handleDelete = async (product) => {
    const ok = await confirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
    });
    if (ok) dispatch(deleteProduct(product._id));
  };

  const handleExportCSV = async () => {
    try {
      const blob = await productService.exportCSV();
      downloadBlob(blob, 'products_export.csv');
      toast.success('CSV exported');
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your product catalog and stock levels</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="secondary" icon={Download} onClick={handleExportCSV}>
              Export CSV
            </Button>
          )}
          {isAdmin && (
            <Button
              icon={Plus}
              onClick={() => {
                setEditingProduct(null);
                setFormOpen(true);
              }}
            >
              Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-10"
            placeholder="Search by name, SKU, barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          placeholder="All Categories"
          options={categories.map((c) => ({ value: c, label: c }))}
          value={filters.category}
          onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
          className="sm:w-48"
        />
        <Select
          placeholder="All Stock Status"
          options={[
            { value: 'in-stock', label: 'In Stock' },
            { value: 'low-stock', label: 'Low Stock' },
            { value: 'out-of-stock', label: 'Out of Stock' },
          ]}
          value={filters.stockStatus}
          onChange={(e) => dispatch(setFilters({ stockStatus: e.target.value }))}
          className="sm:w-48"
        />
        <Select
          options={[
            { value: 'createdAt-desc', label: 'Newest First' },
            { value: 'createdAt-asc', label: 'Oldest First' },
            { value: 'sellingPrice-asc', label: 'Price: Low to High' },
            { value: 'sellingPrice-desc', label: 'Price: High to Low' },
            { value: 'quantity-asc', label: 'Quantity: Low to High' },
            { value: 'name-asc', label: 'Name: A-Z' },
          ]}
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            dispatch(setFilters({ sortBy, sortOrder }));
          }}
          className="sm:w-56"
        />
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <SlidersHorizontal className="mx-auto mb-3" size={32} />
          No products match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={(p) => {
                setEditingProduct(p);
                setFormOpen(true);
              }}
              onDelete={handleDelete}
              onViewQR={setQrProduct}
              onImageZoom={setZoomProduct}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => loadProducts({ page: p })} />

      {/* Modals */}
      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <ProductForm
          initialData={editingProduct}
          categories={categories}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setFormOpen(false)}
          loading={submitting}
        />
      </Modal>

      <ImageZoomModal product={zoomProduct} onClose={() => setZoomProduct(null)} />
      <ProductQRModal product={qrProduct} onClose={() => setQrProduct(null)} />
      <ConfirmDialog state={confirmState} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
};

export default Products;
