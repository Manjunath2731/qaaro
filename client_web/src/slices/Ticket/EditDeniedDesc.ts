import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface PostDeniedPdfState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface PostDeniedPdfPayload {
    ticketId: string;
    description: string;
}

const initialState: PostDeniedPdfState = {
    status: 'idle',
    error: null,
};

export const postDeniedPdf = createAsyncThunk(
    'postDeniedPdf/postDeniedPdf',
    async ({ ticketId, description }: PostDeniedPdfPayload, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.post(`resource/add-new-deniedpdf?ticketId=${ticketId}`, { description });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const postDeniedPdfSlice = createSlice({
    name: 'postDeniedPdf',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postDeniedPdf.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(postDeniedPdf.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postDeniedPdf.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: postDeniedPdfReducer } = postDeniedPdfSlice;
