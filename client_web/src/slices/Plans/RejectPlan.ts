import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the type for the response of the reject API
interface SubscriptionRejectResponse {
  success: boolean;
  message: string;
}

// Define the state for the slice
interface SubscriptionRejectState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state for the reject slice
const initialState: SubscriptionRejectState = {
  status: 'idle',
  error: null,
};

// Create the asynchronous thunk for rejecting a subscription request
export const rejectSubscriptionRequest = createAsyncThunk<
  SubscriptionRejectResponse, // Return type of the thunk
  string, // Argument type (requestId)
  { rejectValue: string } // Rejected action payload type
>(
  'subscriptionReject/rejectSubscriptionRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.post(`/api/subscription/reject?requestId=${requestId}`);
      return response.data as SubscriptionRejectResponse;
    } catch (err: any) {
      // If the error has a response, return the message, otherwise return a generic error
      if (err.response && err.response.data && err.response.data.message) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue('An error occurred while rejecting the subscription.');
      }
    }
  }
);

// Create the slice for handling subscription rejection
const subscriptionRejectSlice = createSlice({
  name: 'subscriptionReject',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(rejectSubscriptionRequest.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(rejectSubscriptionRequest.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(rejectSubscriptionRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export the reducer in the specified structure
export const { reducer: subscriptionRejectReducer } = subscriptionRejectSlice;
