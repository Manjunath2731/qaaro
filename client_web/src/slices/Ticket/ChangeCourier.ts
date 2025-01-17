import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface ChangeCourierPayload {
    ticketId: string;
    courierId: string;
}

interface ChangeCourierState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ChangeCourierState = {
    status: 'idle',
    error: null,
};

// Thunk to change courier
export const changeCourier = createAsyncThunk(
    'changeCourier/changeCourier',
    async (payload: ChangeCourierPayload, { rejectWithValue }) => {
        try {
            const { ticketId, courierId } = payload;
            const response = await axiosAPIInstanceProject.post(`/tickets/cancel-courier?ticketId=${ticketId}&courierId=${courierId}`);
            return response.data; // Assuming the response contains necessary data
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to change courier');
        }
    }
);

// Create slice
const changeCourierSlice = createSlice({
    name: 'changeCourier',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(changeCourier.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(changeCourier.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(changeCourier.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: changeCourierReducer } = changeCourierSlice;
