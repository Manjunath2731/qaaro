import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Courier {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  status: string;
  designation: string;
  state: string;
  country: string;
  zipcode: number;
}

interface CreateCourierPayload {
  name: string;
  email: string;
  mobile: string;
  address: string;
  status: string;
  designation: string;
  state: string;
  country: string;
  zipcode: number;
}

interface CourierCreationState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CourierCreationState = {
  status: 'idle',
  error: null,
};

// Thunk to create a courier
export const createLamiCourier = createAsyncThunk(
  'courier/createLamiCourier',
  async (payload: CreateCourierPayload, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.post('create-lami-courier', payload);
      return response.data.data;
    } catch (error) {
      console.error("Error occurred while creating Admin:", error);

      return rejectWithValue(error.response.data);
    }
  }
);

// Create slice
const createCourierSlice = createSlice({
  name: 'courierCreation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createLamiCourier.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createLamiCourier.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createLamiCourier.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while creating Admin';
      });
  },
});

export const { reducer: createCourierReducer } = createCourierSlice;
