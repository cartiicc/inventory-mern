import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await userService.getUsers();
    return res.users;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load users');
  }
});

export const createStaffUser = createAsyncThunk('users/create', async (data, { rejectWithValue }) => {
  try {
    return await userService.createUser(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create user');
  }
});

export const updateStaffUser = createAsyncThunk('users/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await userService.updateUser(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update user');
  }
});

export const deleteStaffUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try {
    await userService.deleteUser(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStaffUser.fulfilled, (state, action) => {
        state.items.unshift(action.payload.user);
        toast.success('Staff account created');
      })
      .addCase(createStaffUser.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(updateStaffUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex((u) => u._id === action.payload.user._id);
        if (idx !== -1) state.items[idx] = action.payload.user;
        toast.success('User updated');
      })
      .addCase(deleteStaffUser.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u._id !== action.payload);
        toast.success('User removed');
      })
      .addCase(deleteStaffUser.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export default userSlice.reducer;
