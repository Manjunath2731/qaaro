import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the type for the response of the approve API
interface SubscriptionApproveResponse {
  success: boolean;
  message: string;
}

// Define the state for the slice
interface SubscriptionApproveState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state for the approve slice
const initialState: SubscriptionApproveState = {
  status: 'idle',
  error: null,
};

// Create the asynchronous thunk for approving a subscription request
export const approveSubscriptionRequest = createAsyncThunk<
  SubscriptionApproveResponse, // Return type of the thunk
  string, // Argument type (requestId)
  { rejectValue: string } // Rejected action payload type
>(
  'subscriptionApprove/approveSubscriptionRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.post(`subscription/approve?requestId=${requestId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to approve subscription request');
    }
  }
);

// Create the slice
const subscriptionApproveSlice = createSlice({
  name: 'subscriptionApprove',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(approveSubscriptionRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(approveSubscriptionRequest.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(approveSubscriptionRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export the reducer in the requested format
export const { reducer: subscriptionApproveReducer } = subscriptionApproveSlice;
