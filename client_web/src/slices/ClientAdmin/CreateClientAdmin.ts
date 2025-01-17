import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface ClientAdmin {
  name: string;
  email: string;
  mobile: string;
  address: string;
  company: string;
  language: string;
  designation: string;
  state: string;
  country: string;
  zipcode: number;
}

interface ClientAdminCreationState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ClientAdminCreationState = {
  status: 'idle',
  error: null,
};

// Thunk to create a client admin
export const createClientAdmin = createAsyncThunk(
  'clientAdmin/createClientAdmin',
  async (payload: ClientAdmin, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.post('/create_client_admin', payload);
      return response.data.data;
    } catch (error) {
      console.error("Error occurred while creating client admin:", error);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

// Create slice
const createClientAdminSlice = createSlice({
  name: 'clientAdminCreation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createClientAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createClientAdmin.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createClientAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while creating client admin';
      });
  },
});

export const { reducer: createClientAdminReducer } = createClientAdminSlice;
