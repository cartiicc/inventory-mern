import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';

const initialState = {
  items: [],
  categories: [],
  total: 0,
  page: 1,
  totalPages: 1,
  filters: { search: '', category: '', stockStatus: '', sortBy: 'createdAt', sortOrder: 'desc' },
  loading: false,
  error: null,
  lastFetched: null, // used to avoid redundant refetches within a short window
  selectedProduct: null,
};

const CACHE_TTL_MS = 30 * 1000;

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await productService.getProducts(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load products');
    }
  },
  {
    condition: (params, { getState }) => {
      const { products } = getState();
      const force = params?.force;
      if (force) return true;
      const isFresh = products.lastFetched && Date.now() - products.lastFetched < CACHE_TTL_MS;
      return !isFresh; // skip the call if cache is still fresh and not forced
    },
  }
);

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const res = await productService.getCategories();
  return res.categories;
});

export const createProduct = createAsyncThunk('products/create', async (formData, { rejectWithValue }) => {
  try {
    return await productService.createProduct(formData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    return await productService.updateProduct(id, formData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await productService.deleteProduct(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
  }
});

export const updateStock = createAsyncThunk('products/updateStock', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await productService.updateStock(id, payload);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update stock');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload.product);
        state.lastFetched = null; // invalidate cache
        toast.success('Product created successfully');
      })
      .addCase(createProduct.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload.product._id);
        if (idx !== -1) state.items[idx] = action.payload.product;
        toast.success('Product updated successfully');
      })
      .addCase(updateProduct.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
        toast.success('Product deleted');
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload.product._id);
        if (idx !== -1) state.items[idx] = action.payload.product;
        toast.success('Stock updated');
      })
      .addCase(updateStock.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export const { setFilters, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
