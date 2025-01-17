// Import necessary dependencies
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define interfaces for payload and state
interface SendEmailPayload {
    email: string;
    ticketId: string;
    language: string; // Add language field
}

interface CustomerEmailState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define initial state
const initialState: CustomerEmailState = {
    status: 'idle',
    error: null,
};

// Create async thunk for sending customer email
export const sendCustomerEmail = createAsyncThunk(
    'customer/sendCustomerEmail',
    async (payload: SendEmailPayload, { rejectWithValue }) => {
        try {
            const { email, ticketId, language } = payload;
            const response = await axiosAPIInstanceProject.post(`/tickets/contact-customer?ticketId=${ticketId}`, { email, language });
            return response.data; // Return any data returned by the API if needed
        } catch (error) {
            console.error('Error occurred while sending customer email:', error);
            return rejectWithValue(error.response?.data); // Return error response data
        }
    }
);

// Create customer email slice
const customerEmailSlice = createSlice({
    name: 'customerEmail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendCustomerEmail.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(sendCustomerEmail.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
                console.log('Customer email sent successfully!');
            })
            .addCase(sendCustomerEmail.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    (action.payload as { message: string } | undefined)?.message ||
                    'An error occurred while sending customer email';
                console.error('Error occurred while sending customer email:', state.error);
            });
    },
});

// Export reducer and actions
export const { reducer: customerEmailReducer, actions: customerEmailActions } = customerEmailSlice;
