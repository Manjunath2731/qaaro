import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the type for the request payload
interface CreateSubscriptionPayload {
    type: string;
}

// Define the type for the response data
interface CreateSubscriptionResponse {
    success: boolean;
    message: string;
    // Include other fields returned in the response if necessary
}

// Async thunk for creating the subscription request
export const createSubscription = createAsyncThunk<CreateSubscriptionResponse, { planId: string; type: string }>(
    'subscription/createSubscription',
    async ({ planId, type }, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.post(`/subscription/create-req?planId=${planId}`, { type });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Define the slice with a specific name related to API
const createSubscriptionSlice = createSlice({
    name: 'createSubscription',
    initialState: {
        status: 'idle',
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createSubscription.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createSubscription.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(createSubscription.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// Export the reducer with the specific name
export const { reducer: createSubscriptionReducer } = createSubscriptionSlice;
