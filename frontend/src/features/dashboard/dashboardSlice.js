import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../../services/dashboardService';

const initialState = {
  stats: { totalProducts: 0, lowStockCount: 0, outOfStockCount: 0, totalOrders: 0, revenue: 0 },
  recentOrders: [],
  recentActivity: [],
  categoryDistribution: [],
  monthlySales: [],
  loading: false,
  error: null,
  lastFetched: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getStats();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load dashboard');
    }
  },
  {
    condition: (_, { getState }) => {
      const { dashboard } = getState();
      const isFresh = dashboard.lastFetched && Date.now() - dashboard.lastFetched < 15000;
      return !isFresh;
    },
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentOrders = action.payload.recentOrders;
        state.recentActivity = action.payload.recentActivity;
        state.categoryDistribution = action.payload.categoryDistribution;
        state.monthlySales = action.payload.monthlySales;
        state.lastFetched = Date.now();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
