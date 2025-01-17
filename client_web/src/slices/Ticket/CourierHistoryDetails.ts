import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface CourierHistoryDetails {
    _id: string;
    routeNo: string;
    name: string
    count: {
        total: number;
        open: number;
        returned: number;
        customerAccepted: number;
        customerDenied: number;
    };
    value: {

        returned: number;
        total: number;
        open: number;
        success: number;
        lost: number;
    };
    amount: {
        netLost: number;
    }


}

interface CourierHistoryDetailsState {
    details: CourierHistoryDetails | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CourierHistoryDetailsState = {
    details: null,
    status: 'idle',
    error: null,
};

export const fetchCourierHistoryDetails = createAsyncThunk(
    'courierHistoryDetails/fetchCourierHistoryDetails',
    async (courierId: string) => {
        const response = await axiosAPIInstanceProject.get(`courier-history-details?courierId=${courierId}`);
        return response.data.data;
    }
);

const courierHistoryDetailsSlice = createSlice({
    name: 'courierHistoryDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourierHistoryDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCourierHistoryDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.details = action.payload;
            })
            .addCase(fetchCourierHistoryDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const courierHistoryDetailsReducer = courierHistoryDetailsSlice.reducer;
