import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Plan {
  _id: string;
  planCode: string;
  type: string;
  period: string;
  duration: number;
  band: string;
  cost: number;
  userLimit: number;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionPlansState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  plans: Plan[];
}

const initialState: SubscriptionPlansState = {
  status: 'idle',
  error: null,
  plans: [],
};

export const fetchSubscriptionPlans = createAsyncThunk(
  'subscription/fetchSubscriptionPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.get('subscription/plans');
      return response.data.data;
    } catch (error) {
      console.error('Error occurred while fetching subscription plans:', error);
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const subscriptionPlansSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.plans = action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while fetching subscription plans';
      });
  },
});

export const { reducer: subscriptionPlansReducer } = subscriptionPlansSlice;
