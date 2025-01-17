import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface SendEmailState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface EmailPayload {
    ticketId: string;
    data: FormData | {
        to: string;
        cc: string[];
        bcc: string[];
        subject: string;
        message: string;
        files: File[]; // Change type to File[]
        attachment: string; // Change attachment type to string

    };
}

const initialState: SendEmailState = {
    status: 'idle',
    error: null,
};

export const sendEmail = createAsyncThunk(
    'email/send',
    async (payload: EmailPayload, { rejectWithValue }) => {
        try {
            let formData: FormData;

            // Check if payload.data is FormData
            if (payload.data instanceof FormData) {
                formData = payload.data;
            } else {
                // Create FormData and append email data
                formData = new FormData();
                formData.append('to', payload.data.to);
                formData.append('cc', payload.data.cc.join(','));
                formData.append('bcc', payload.data.bcc.join(','));
                formData.append('subject', payload.data.subject);
                formData.append('message', payload.data.message);
                formData.append('attachment', payload.data.attachment); // Append attachment as string

                // Append files to FormData
                payload.data.files.forEach((file) => {
                    formData.append('files', file);
                });
            }

            const response = await axiosAPIInstanceProject.post(`send-mail?ticketId=${payload.ticketId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const emailSlice = createSlice({
    name: 'email',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendEmail.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(sendEmail.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(sendEmail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: emailReducer } = emailSlice;
export const emailActions = emailSlice.actions;
