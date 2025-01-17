import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface AddAcceptedPdfRequest {
    ticketId: string;
    signatureImage: string;
    name: string;
    place: string;
}

interface AddAcceptedPdfResponse {
    // Define your response type here if needed
}

export const addAcceptedPdf = createAsyncThunk(
    'pdf/addAcceptedPdf',
    async (requestData: AddAcceptedPdfRequest) => {
        const response = await axiosAPIInstanceProject.post<AddAcceptedPdfResponse>(
            'resource/add-acceptedpdf',
            requestData
        );
        return response.data;
    }
);

interface PdfState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PdfState = {
    status: 'idle',
    error: null
};

const pdfSlice = createSlice({
    name: 'pdf',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addAcceptedPdf.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addAcceptedPdf.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(addAcceptedPdf.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'An error occurred';
            });
    }
});

export const { reducer: pdfReducer } = pdfSlice;
