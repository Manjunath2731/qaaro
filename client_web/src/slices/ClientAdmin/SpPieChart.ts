import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the Lami Overview details
interface LamiOverviewDetails {
    _id: string;
    name: string;
    designation: string;
    activeCouriers: number;
    inactiveCouriers: number;
    totalCoureir: number;
    count: {
        open: number;
        returned: number;
        customerAccepted: number;
        customerDenied: number;
        total: number;
    };
    value: {
        open: string;
        success: string;
        lost: string;
        returned: string;
        total: string;
    };
    amount: {
        netLost: string;
    };
}

// Define the interface for the slice state
interface LamiOverviewDetailsState {
    details: LamiOverviewDetails | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state for the slice
const initialState: LamiOverviewDetailsState = {
    details: null,
    status: 'idle',
    error: null,
};

// Async thunk to fetch Lami Overview details
export const fetchLamiOverviewDetails = createAsyncThunk(
    'lamiOverviewDetails/fetchLamiOverviewDetails',
    async (lamiId: string) => {
        const response = await axiosAPIInstanceProject.get(`lami-overview?lamiId=${lamiId}`);
        return response.data.data;
    }
);

// Slice for managing Lami Overview details state
const lamiOverviewDetailsSlice = createSlice({
    name: 'lamiOverviewDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLamiOverviewDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLamiOverviewDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.details = action.payload;
            })
            .addCase(fetchLamiOverviewDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

// Export the reducer to be used in the store
export const lamiOverviewDetailsReducer = lamiOverviewDetailsSlice.reducer;
