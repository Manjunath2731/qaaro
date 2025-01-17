import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface AttachmentState {
    attachments: string[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AttachmentState = {
    attachments: [],
    status: 'idle',
    error: null,
};

export const uploadAttachments = createAsyncThunk(
    'attachments/upload',
    async ({ ticketId, attachments }: { ticketId: string, attachments: string[] }) => {
        const response = await axiosAPIInstanceProject.post(`/tickets/drag-and-drop?ticketId=${ticketId}`, {
            attachment: attachments,
        });
        return response.data;
    }
);

const attachmentSlice = createSlice({
    name: 'attachments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadAttachments.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(uploadAttachments.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.status = 'succeeded';
                state.attachments = action.payload;
            })
            .addCase(uploadAttachments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to upload attachments';
            });
    },
});

const attachmentReducer = attachmentSlice.reducer;

export default attachmentReducer;
