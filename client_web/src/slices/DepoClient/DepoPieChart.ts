import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the Depo Overview details
interface DepoOverviewDetails {
    _id: string;
    name: string;
    designation: string;
    totalLami: number;
    activeLami: number;
    inactiveLami: number;
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
interface DepoOverviewDetailsState {
    details: DepoOverviewDetails | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state for the slice
const initialState: DepoOverviewDetailsState = {
    details: null,
    status: 'idle',
    error: null,
};

// Async thunk to fetch Depo Overview details
export const fetchDepoOverviewDetails = createAsyncThunk(
    'depoOverviewDetails/fetchDepoOverviewDetails',
    async (depoAdminId: string) => {
        const response = await axiosAPIInstanceProject.get(`depo-overview?depoAdminId=${depoAdminId}`);
        return response.data.data;
    }
);

// Slice for managing Depo Overview details state
const depoOverviewDetailsSlice = createSlice({
    name: 'depoOverviewDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepoOverviewDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDepoOverviewDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.details = action.payload;
            })
            .addCase(fetchDepoOverviewDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

// Export the reducer to be used in the store
export const depoOverviewDetailsReducer = depoOverviewDetailsSlice.reducer;
