import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the types for the response data
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
    __v: number;
}

interface SubscriptionDetail {
    _id: string;
    clientId: string;
    planId: Plan;
    startDate: string;
    endDate: string;
    availableCount: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// Define the types for the state
interface SubscriptionState {
    subscriptionDetails: SubscriptionDetail[] | null;
    message: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    pendingCount: number | null; // Add pendingCount to the state
}

// Define the initial state using the `SubscriptionState` type
const initialState: SubscriptionState = {
    subscriptionDetails: null,
    message: null,
    status: 'idle',
    error: null,
    pendingCount: null, // Initialize pendingCount
};

// Create an async thunk for fetching subscription details
export const fetchSubscriptionDetails = createAsyncThunk(
    'detailsSubscription/fetchSubscriptionDetails',
    async () => {
        const response = await axiosAPIInstanceProject.get('subscription/get');
        return response.data;
    }
);

// Create the slice
const detailsSubscriptionSlice = createSlice({
    name: 'detailsSubscription',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscriptionDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSubscriptionDetails.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'succeeded';
                // Check if the response contains 'data' with 'pendingCount'
                if (action.payload.data && action.payload.data.pendingCount !== undefined) {
                    state.pendingCount = action.payload.data.pendingCount;
                    state.subscriptionDetails = null; // Clear existing details if needed
                    state.message = action.payload.message || null;
                } else if (action.payload.message === 'No active subscription found.') {
                    state.subscriptionDetails = null;
                    state.message = action.payload.message;
                    state.pendingCount = null; // Reset pendingCount
                } else {
                    state.subscriptionDetails = action.payload.data;
                    state.message = null;
                    state.pendingCount = null; // Reset pendingCount
                }
            })
            .addCase(fetchSubscriptionDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch subscription details';
                state.pendingCount = null; // Reset pendingCount
            });
    },
});

// Export the reducer
export const { reducer: detailsSubscriptionReducer } = detailsSubscriptionSlice;
