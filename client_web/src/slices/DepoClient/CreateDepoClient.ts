import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface DepoAdmin {
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

interface DepoAdminCreationState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DepoAdminCreationState = {
  status: 'idle',
  error: null,
};

// Thunk to create a depo admin
export const createDepoAdmin = createAsyncThunk(
  'depoAdmin/createDepoAdmin',
  async ({ clientId, payload }: { clientId?: string; payload: DepoAdmin }, { rejectWithValue }) => {
    try {
      const endpoint = clientId ? `/create_depo_admin?clientId=${clientId}` : '/create_depo_admin';
      const response = await axiosAPIInstanceProject.post(endpoint, payload);
      return response.data.data;
    } catch (error) {
      console.error("Error occurred while creating depo admin:", error);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

// Create slice
const createDepoAdminSlice = createSlice({
  name: 'depoAdminCreation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDepoAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createDepoAdmin.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createDepoAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while creating depo admin';
      });
  },
});

export const { reducer: createDepoAdminReducer } = createDepoAdminSlice;
