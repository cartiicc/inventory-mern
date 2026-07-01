import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';

/**
 * Order-creation form. Staff pick products + quantities from a live list,
 * and the running total is computed client-side from current selling prices.
 * The backend re-validates stock & recomputes totals server-side regardless.
 */
const CreateOrderForm = ({ products, onSubmit, onCancel, loading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [lineItems, setLineItems] = useState([{ product: '', quantity: 1 }]);

  const productOptions = products.map((p) => ({ value: p._id, label: `${p.name} (${p.quantity} in stock)` }));

  const addLineItem = () => setLineItems([...lineItems, { product: '', quantity: 1 }]);
  const removeLineItem = (idx) => setLineItems(lineItems.filter((_, i) => i !== idx));

  const updateLineItem = (idx, field, value) => {
    const updated = [...lineItems];
    updated[idx][field] = value;
    setLineItems(updated);
  };

  const total = useMemo(() => {
    return lineItems.reduce((sum, item) => {
      const product = products.find((p) => p._id === item.product);
      return sum + (product ? product.sellingPrice * Number(item.quantity || 0) : 0);
    }, 0);
  }, [lineItems, products]);

  const submitHandler = (data) => {
    const validItems = lineItems.filter((i) => i.product && i.quantity > 0);
    if (validItems.length === 0) return;
    onSubmit({ ...data, products: validItems.map((i) => ({ product: i.product, quantity: Number(i.quantity) })) });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Customer Name"
          placeholder="e.g. John Doe"
          error={errors.customerName?.message}
          {...register('customerName', { required: 'Customer name is required' })}
        />
        <Input label="Customer Email (optional)" type="email" {...register('customerEmail')} />
      </div>

      <div>
        <label className="label">Order Items</label>
        <div className="space-y-3">
          {lineItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Select
                options={productOptions}
                placeholder="Select product"
                value={item.product}
                onChange={(e) => updateLineItem(idx, 'product', e.target.value)}
                className="flex-1"
              />
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateLineItem(idx, 'quantity', e.target.value)}
                className="input w-20"
              />
              {lineItems.length > 1 && (
                <button type="button" onClick={() => removeLineItem(idx)} className="text-danger-600 p-2">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addLineItem} className="btn-ghost mt-2 text-primary-600 !px-0">
          <Plus size={16} /> Add another item
        </button>
      </div>

      <div>
        <label className="label">Notes (optional)</label>
        <textarea rows={2} className="input" {...register('notes')} />
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-primary-50 dark:bg-primary-500/10">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Order Total</span>
        <span className="text-xl font-bold text-primary-700 dark:text-primary-400">{formatCurrency(total)}</span>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create Order
        </Button>
      </div>
    </form>
  );
};

export default CreateOrderForm;
