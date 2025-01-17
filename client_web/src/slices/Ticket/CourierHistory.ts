import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Courier {
    _id: string;
    name: string;
    avatar: {
        publicId: string;
        url: string;
        _id: string;
    };
    open: number;
    closed: number;
    ontime: number;
    'lost-count': number;
    'lost-value': number;
    'upcomming-one-day': number;
    'upcomming-two-day': number;
    'upcomming-three-day': number;
}

interface CourierHistoryState {
    couriers: Courier[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CourierHistoryState = {
    couriers: [],
    status: 'idle',
    error: null,
};

export const fetchCourierHistory = createAsyncThunk(
    'courierHistory/fetchCourierHistory',
    async () => {
        const response = await axiosAPIInstanceProject.get('courier-history');
        return response.data.data;
    }
);

const courierHistorySlice = createSlice({
    name: 'courierHistory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourierHistory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCourierHistory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.couriers = action.payload;
            })
            .addCase(fetchCourierHistory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const courierHistoryReducer = courierHistorySlice.reducer;
