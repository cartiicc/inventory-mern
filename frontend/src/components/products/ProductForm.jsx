import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ImagePlus, X } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

/**
 * Shared form for both "Add Product" and "Edit Product" flows.
 * Builds a multipart/form-data payload so the image travels straight to
 * the backend, which streams it to Cloudinary.
 */
const ProductForm = ({ initialData, categories = [], onSubmit, onCancel, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: initialData || {} });

  const [preview, setPreview] = useState(initialData?.imageURL || null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    reset(initialData || {});
    setPreview(initialData?.imageURL || null);
  }, [initialData, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') formData.append(key, value);
    });
    if (imageFile) formData.append('image', imageFile);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Image upload */}
      <div>
        <label className="label">Product Image</label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center relative">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <ImagePlus className="text-gray-400" size={28} />
            )}
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setImageFile(null);
                }}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <label className="btn-secondary cursor-pointer">
            Choose Image
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Product Name"
          placeholder="e.g. Wireless Mouse"
          error={errors.name?.message}
          {...register('name', { required: 'Product name is required' })}
        />
        <Input
          label="Category"
          placeholder="e.g. Electronics"
          error={errors.category?.message}
          {...register('category', { required: 'Category is required' })}
          list="category-suggestions"
        />
        <datalist id="category-suggestions">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <Input label="SKU" placeholder="e.g. WM-2024-001" error={errors.sku?.message} {...register('sku', { required: 'SKU is required' })} />
        <Input label="Barcode (optional)" placeholder="e.g. 8901234567890" {...register('barcode')} />

        <Input
          label="Buying Price ($)"
          type="number"
          step="0.01"
          error={errors.buyingPrice?.message}
          {...register('buyingPrice', { required: 'Buying price is required', min: 0 })}
        />
        <Input
          label="Selling Price ($)"
          type="number"
          step="0.01"
          error={errors.sellingPrice?.message}
          {...register('sellingPrice', { required: 'Selling price is required', min: 0 })}
        />

        <Input label="Quantity" type="number" {...register('quantity', { min: 0 })} />
        <Input label="Low Stock Threshold" type="number" {...register('lowStockThreshold', { min: 0 })} />

        <Input label="Supplier" placeholder="e.g. Acme Supplies Ltd." className="sm:col-span-2" {...register('supplier')} />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          rows={3}
          className="input"
          placeholder="Short product description..."
          {...register('description')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
