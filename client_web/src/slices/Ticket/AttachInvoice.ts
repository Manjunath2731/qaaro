import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface AttachInvoiceState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface AttachInvoicePayload {
    ticketId: string;
    data: FormData | {
        mailHeaderNumber: string;
        dpdInvoiceNumber: string;
        date: string; // Change type to string to match FormData appending
        packageNumber: string;
        complainNumber: string;
        finalLostAmmount: number;
        notes: string;
        attachment?: File[]; // Change type to File[]
        files: string; // Change attachment type to string

    };
}

const initialState: AttachInvoiceState = {
    status: 'idle',
    error: null,
};

export const attachInvoice = createAsyncThunk(
    'invoice/attach',
    async (payload: AttachInvoicePayload, { rejectWithValue }) => {
        try {
            let formData: FormData;

            // Check if payload.data is FormData
            if (payload.data instanceof FormData) {
                formData = payload.data;
            } else {
                // Create FormData and append invoice data
                formData = new FormData();
                formData.append('mailHeaderNumber', payload.data.mailHeaderNumber);
                formData.append('dpdInvoiceNumber', payload.data.dpdInvoiceNumber);
                formData.append('date', payload.data.date);
                formData.append('packageNumber', payload.data.packageNumber);
                formData.append('complainNumber', payload.data.complainNumber);
                formData.append('finalLostAmmount', payload.data.finalLostAmmount.toString());
                formData.append('notes', payload.data.notes);
                formData.append('files', payload.data.files); // Append attachment as string

                // Append attachments to FormData
                if (payload.data.attachment) {
                    payload.data.attachment.forEach((file) => {
                        formData.append('attachment', file);
                    });
                }
            }

            const response = await axiosAPIInstanceProject.post(`tickets/add-invoice?ticketId=${payload.ticketId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(attachInvoice.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(attachInvoice.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(attachInvoice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: invoiceReducer } = invoiceSlice;
export const invoiceActions = invoiceSlice.actions;
