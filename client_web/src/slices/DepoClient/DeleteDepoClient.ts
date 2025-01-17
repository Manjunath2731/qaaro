import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the slice state
interface DeleteDepoAdminState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: DeleteDepoAdminState = {
  status: 'idle',
  error: null,
};

// Thunk to delete a depo admin
export const deleteDepoAdmin = createAsyncThunk(
  'depoAdmin/deleteDepoAdmin',
  async (depoAdminId: string, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.delete(`/delete_depo_admin?depoAdminId=${depoAdminId}`);
      return response.data;
    } catch (error) {
      console.error("Error occurred while deleting depo admin:", error);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

// Create slice
const deleteDepoAdminSlice = createSlice({
  name: 'deleteDepoAdmin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteDepoAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteDepoAdmin.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteDepoAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while deleting depo admin';
      });
  },
});

export const { reducer: deleteDepoAdminReducer } = deleteDepoAdminSlice;
export default deleteDepoAdminReducer;
