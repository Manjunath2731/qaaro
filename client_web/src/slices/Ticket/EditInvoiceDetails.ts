import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the payload
interface EditInvoiceDetailsPayload {
    ticketId: string; // Change to ticketId
    dpdInvoiceNumber: string;
    complainNumber: string;
    packageNumber: string;
    finalLostAmount: number;
}

// Define the initial state for the slice
interface InvoiceUpdateState {
    loading: boolean;
    error: string | null;
    success: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: InvoiceUpdateState = {
    loading: false,
    error: null,
    success: false,
    status: 'idle',
};

// Define the async action creator for updating the invoice details
export const editInvoiceDetails = createAsyncThunk(
    'invoices/editInvoiceDetails',
    async (payload: EditInvoiceDetailsPayload) => {
        try {
            // Destructure the ticketId from the payload
            const { ticketId, ...data } = payload;
            // Make a PATCH request to the API with ticketId in the query parameter
            const response = await axiosAPIInstanceProject.post(`/tickets/update-invoice?ticketId=${ticketId}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data);
        }
    }
);

// Create the slice
const invoiceUpdateSlice = createSlice({
    name: 'invoiceUpdate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(editInvoiceDetails.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.success = false;
            })
            .addCase(editInvoiceDetails.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
                state.success = true;
            })
            .addCase(editInvoiceDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
                state.success = false;
            });
    },
});

// Export the reducer
export const { reducer: invoiceUpdateReducer } = invoiceUpdateSlice;
