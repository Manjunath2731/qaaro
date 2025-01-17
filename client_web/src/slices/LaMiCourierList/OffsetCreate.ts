import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface OffsetCourierState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface OffsetCourierRequest {
    courierId: string;
    date: Date;
    paidAmount: number;
}

const initialState: OffsetCourierState = {
    status: 'idle',
    error: null,
};

export const postOffsetCourier = createAsyncThunk(
    'courier/postOffsetCourier',
    async (request: OffsetCourierRequest, { rejectWithValue }) => {
        try {
            const { courierId, date, paidAmount } = request;
            const response = await axiosAPIInstanceProject.post(`tickets/add-paid-amount?courierId=${courierId}`, {
                date: date.toISOString(),
                paidAmount: paidAmount
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const offsetCourierSlice = createSlice({
    name: 'offsetCourier',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postOffsetCourier.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(postOffsetCourier.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(postOffsetCourier.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: offsetCourierReducer } = offsetCourierSlice;
