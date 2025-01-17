import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

export interface DashboardCardState {
    data: {
        ticketdata: {
            open: number;
            completed: number;
            total: number;
        };
        ticketcopletion: {
            delayedTicket: number;
            deleyedOpen: number;
            ontimeComp: number;
        };
        packagedata: {
            justified: number;
            denied: number;
            packageLost: number;
        };
        courierdata: {
            activeCourier: number;
            inactiveCourier: number;
        };
        annonymous: {
            count: number;
        };
    } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DashboardCardState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchDashboardCardData = createAsyncThunk(
    'dashboardCard/fetchDashboardCardData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('/dashboard-card');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const dashboardCardSlice = createSlice({
    name: 'dashboardCard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardCardData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDashboardCardData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload.data;
            })
            .addCase(fetchDashboardCardData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: dashboardCardReducer } = dashboardCardSlice;
