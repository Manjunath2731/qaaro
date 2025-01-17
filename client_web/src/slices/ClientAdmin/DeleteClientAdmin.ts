import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the slice state
interface DeleteClientAdminState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: DeleteClientAdminState = {
  status: 'idle',
  error: null,
};

// Thunk to delete a client admin
export const deleteClientAdmin = createAsyncThunk(
  'clientAdmin/deleteClientAdmin',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.delete(`/delete_client_admin?clientId=${clientId}`);
      return response.data;
    } catch (error) {
      console.error("Error occurred while deleting client admin:", error);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

// Create slice
const deleteClientAdminSlice = createSlice({
  name: 'deleteClientAdmin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteClientAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteClientAdmin.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteClientAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while deleting client admin';
      });
  },
});

export const { reducer: deleteClientAdminReducer } = deleteClientAdminSlice;
