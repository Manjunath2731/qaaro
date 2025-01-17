// deniedPdfSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface AddDeniedPdfRequest {
    ticketId: string;
    description: string;
    signatureImage: string;
    place: string;
    name: string;

}

interface AddDeniedPdfResponse {
    // Define your response type here if needed
}

export const addDeniedPdf = createAsyncThunk(
    'pdf/addDeniedPdf',
    async (requestData: AddDeniedPdfRequest) => {
        const response = await axiosAPIInstanceProject.post<AddDeniedPdfResponse>(
            'resource/add-deniedPdf',
            requestData
        );
        return response.data;
    }
);

interface DeniedPdfState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DeniedPdfState = {
    status: 'idle',
    error: null
};

const deniedPdfSlice = createSlice({
    name: 'deniedPdf',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addDeniedPdf.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addDeniedPdf.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(addDeniedPdf.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'An error occurred';
            });
    }
});

export const { reducer: deniedPdfReducer } = deniedPdfSlice;
