import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

export interface ReturnToLocoRequest {
    to: string[];
    cc: string[]; // Include cc field
    bcc: string[]; // Include bcc field
    signature?: string;
    subject: string;
    message: string;
    description: string;
    attachment: string; // Change attachment type to string
    newsignature?: File | null;
    newAttachment?: File[];
}

interface ReturnToLocoState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ReturnToLocoState = {
    status: 'idle',
    error: null,
};

export const returnToLoco = createAsyncThunk(
    'returnToLoco/returnToLoco',
    async ({ ticketId, requestData }: { ticketId: string; requestData: ReturnToLocoRequest }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            const { to, cc, bcc, signature, subject, message, description, attachment, newsignature, newAttachment } = requestData;
            formData.append('to', JSON.stringify(to));
            formData.append('cc', JSON.stringify(cc)); // Append cc
            formData.append('bcc', JSON.stringify(bcc)); // Append bcc
            formData.append('signature', signature);
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('description', description);
            formData.append('attachment', attachment); // Append attachment as string

            if (newsignature) {
                formData.append('newsignature', newsignature);
            }

            if (newAttachment && newAttachment.length > 0) {
                newAttachment.forEach(file => formData.append('newAttachment', file));
            }

            const response = await axiosAPIInstanceProject.post(`tickets/return-to-loco?ticketId=${ticketId}`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const returnToLocoSlice = createSlice({
    name: 'returnToLoco',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(returnToLoco.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(returnToLoco.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(returnToLoco.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: returnToLocoReducer } = returnToLocoSlice;
