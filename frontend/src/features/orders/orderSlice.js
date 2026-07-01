import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { orderService } from '../../services/orderService';

const initialState = {
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  selectedOrder: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await orderService.getOrders(params);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load orders');
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await orderService.getOrderById(id);
    return res.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    return await orderService.createOrder(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create order');
  }
});

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      return await orderService.updateOrderStatus(id, orderStatus);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload.order);
        toast.success(`Order ${action.payload.order.orderNumber} created`);
      })
      .addCase(createOrder.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((o) => o._id === action.payload.order._id);
        if (idx !== -1) state.items[idx] = action.payload.order;
        toast.success('Order status updated');
      });
  },
});

export default orderSlice.reducer;
