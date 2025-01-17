import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface AddAcceptedPdfRequest {
    linkId: string; // Dynamic linkId parameter
    packageDate: string; // Additional payload fields
    cname: string;
    address: string;
    ticketId: string; // Existing fields
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
        const { linkId, packageDate, cname, address, ...rest } = requestData;
        const response = await axiosAPIInstanceProject.post<AddAcceptedPdfResponse>(
            `resource/accept-pdf?linkId=${linkId}`, // Dynamic URL with linkId
            {
                ...rest, // Existing fields
                packageDate,
                cname,
                address
            }
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
                state.error = null; // Clear error state on success if necessary
            })
            .addCase(addAcceptedPdf.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'An error occurred';
            });
    }
});

export const { reducer: pdfReducer } = pdfSlice;
