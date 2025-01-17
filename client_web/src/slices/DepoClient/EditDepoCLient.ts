import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the slice state
interface UpdateDepoAdminState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: UpdateDepoAdminState = {
  status: 'idle',
  error: null,
};

// Thunk to update a depo admin
export const updateDepoAdmin = createAsyncThunk(
  'depoAdmin/updateDepoAdmin',
  async ({ depoAdminId, updateData }: { depoAdminId: string, updateData: any }, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.put(`/update_depo_admin?depoAdminId=${depoAdminId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error occurred while updating depo admin:", error);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

// Create slice
const updateDepoAdminSlice = createSlice({
  name: 'updateDepoAdmin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateDepoAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateDepoAdmin.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateDepoAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while updating depo admin';
      });
  },
});

export const { reducer: updateDepoAdminReducer } = updateDepoAdminSlice;
