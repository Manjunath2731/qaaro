import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface InvoiceListState {
    invoiceData: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: InvoiceListState = {
    invoiceData: [],
    status: 'idle',
    error: null,
};

export const fetchInvoiceListData = createAsyncThunk(
    'invoiceList/fetchInvoiceListData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('tickets/get-invoice-list'); // Replace with your API endpoint
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const invoiceListSlice = createSlice({
    name: 'invoiceList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoiceListData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchInvoiceListData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.invoiceData = action.payload;
                state.error = null;
            })
            .addCase(fetchInvoiceListData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: invoiceListReducer } = invoiceListSlice;
export const invoiceListActions = invoiceListSlice.actions;

export default invoiceListReducer;
