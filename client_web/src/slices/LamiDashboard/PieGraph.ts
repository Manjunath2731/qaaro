// graph3Slice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

export interface Graph3Data {
    openAmount: number;
    lostAmount: number;
    successAmount: number;
    pendingAmount: number;
    totalAmount: number;
}

export interface Graph3State {
    data: Graph3Data | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: Graph3State = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchGraph3Data = createAsyncThunk(
    'graph3/fetchGraph3Data',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('/dashboard-graph3');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const graph3Slice = createSlice({
    name: 'graph3',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGraph3Data.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchGraph3Data.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload;
            })
            .addCase(fetchGraph3Data.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: graph3Reducer } = graph3Slice;
