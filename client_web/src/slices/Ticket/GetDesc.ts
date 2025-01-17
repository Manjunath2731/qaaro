import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface PdfDataState {
    data: any; // Modify this type according to your PDF data structure
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PdfDataState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchPdfData = createAsyncThunk(
    'pdfData/fetchPdfData',
    async (ticketId: string, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get(`resource/get-pdf-data?ticketId=${ticketId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const pdfDataSlice = createSlice({
    name: 'pdfData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPdfData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPdfData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchPdfData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: pdfDataReducer } = pdfDataSlice;
