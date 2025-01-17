import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the slice state
interface UpdateClientAdminState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: UpdateClientAdminState = {
  status: 'idle',
  error: null,
};

// Thunk to update a client admin
export const updateClientAdmin = createAsyncThunk(
  'clientAdmin/updateClientAdmin',
  async ({ clientId, updateData }: { clientId: string, updateData: any }, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.put(`/update_client_admin?clientId=${clientId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error occurred while updating client admin:", error);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

// Create slice
const updateClientAdminSlice = createSlice({
  name: 'updateClientAdmin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateClientAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateClientAdmin.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateClientAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while updating client admin';
      });
  },
});

export const { reducer: updateClientAdminReducer } = updateClientAdminSlice;
