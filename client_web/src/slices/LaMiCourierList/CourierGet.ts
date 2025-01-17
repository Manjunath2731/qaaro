import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Courier {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  company: string;
  status: 'active' | 'inactive'; // Ensure status is typed correctly
  designation: string;
  avatar: {
    publicId: string;
    url: string;
    _id: string;
  };
}

interface CourierState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  couriers: Courier[];
}

const initialState: CourierState = {
  status: 'idle',
  error: null,
  couriers: [],
};

// Thunk to fetch couriers
export const fetchLamiCouriers = createAsyncThunk(
  'courier/fetchLamiCouriers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.get('get-lami-courier');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Create slice
const courierSlice = createSlice({
  name: 'courier',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLamiCouriers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLamiCouriers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.couriers = action.payload;
      })
      .addCase(fetchLamiCouriers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { reducer: courierReducer } = courierSlice;
