import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Avatar {
  publicId: string;
  url: string;
  _id: string;
}

interface ClientId {
  _id: string;
  name: string;
  email: string;
  password: string;
  mobile: number;
  address: string;
  role: string;
  company: string;
  status: string;
  language: string;
  designation: string;
  zipcode: number;
  state: string;
  country: string;
  avatar: Avatar;
  plugoAdminId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PlanId {
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
  __v: number;
}

interface SubscriptionDetail {
  _id: string;
  clientId: ClientId[]; // This is an array of ClientId objects
  planId: PlanId[];     // This is an array of PlanId objects
  requestDate: string;
  requestType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubscriptionRequestState {
  subscriptionDetails: SubscriptionDetail[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Create async thunk for fetching subscription request data
export const fetchSubscriptionRequest = createAsyncThunk(
  'subscriptionRequest/fetchSubscriptionRequest',
  async () => {
    const response = await axiosAPIInstanceProject.get('/subscription/sub-req');
    return response.data.data as SubscriptionDetail[];
  }
);

// Create the slice with initial state and reducers
const subscriptionRequestSlice = createSlice({
  name: 'subscriptionRequest',
  initialState: {
    subscriptionDetails: [],
    status: 'idle', // Changed to 'idle' to represent initial state
    error: null,
  } as SubscriptionRequestState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubscriptionRequest.fulfilled, (state, action: PayloadAction<SubscriptionDetail[]>) => {
        state.status = 'succeeded';
        state.subscriptionDetails = action.payload;
      })
      .addCase(fetchSubscriptionRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { reducer: subscriptionRequestReducer } = subscriptionRequestSlice;
