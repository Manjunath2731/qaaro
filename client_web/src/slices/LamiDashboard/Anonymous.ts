import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

export interface DashboardAnonymousTableState {
    data: {
        locoEmail: {
            _id: string;
            emailBody: string;
            status: string;
            ticketId: string;
            lamiAdminId: string;
            createdAt: string;
            updatedAt: string;
            date: string;

            __v: number;
        };
        ticket: {

            complainNumber: string;
            packageNumber: string;
            amountInDispute: number;
            date: string;
        };
    }[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DashboardAnonymousTableState = {
    data: [],
    status: 'idle',
    error: null,
};

export const fetchDashboardAnonymousTableData = createAsyncThunk(
    'dashboardAnonymousTable/fetchDashboardAnonymousTableData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('dashboard-annonymous');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const dashboardAnonymousTableSlice = createSlice({
    name: 'dashboardAnonymousTable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardAnonymousTableData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDashboardAnonymousTableData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload.data;
            })
            .addCase(fetchDashboardAnonymousTableData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: dashboardAnonymousTableReducer } = dashboardAnonymousTableSlice;
