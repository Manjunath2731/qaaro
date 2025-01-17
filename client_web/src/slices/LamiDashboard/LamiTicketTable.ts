import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

export interface DashboardTicketTableState {
    data: {
        _id: string;
        complainNumber: string;
        packageNumber: string;
        amountInDispute: number;
        deadlineDate: string;
        status: string;
        hasPendingInEmail: boolean;
        createdAt: string;
        claimType: string;



    }[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;

}

const initialState: DashboardTicketTableState = {
    data: [],
    status: 'idle',
    error: null,
};

export const fetchDashboardTicketTableData = createAsyncThunk(
    'dashboardTicketTable/fetchDashboardTicketTableData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('/dashboard-ticket-table');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const dashboardTicketTableSlice = createSlice({
    name: 'dashboardTicketTable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardTicketTableData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDashboardTicketTableData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload.data;
            })
            .addCase(fetchDashboardTicketTableData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: dashboardTicketTableReducer } = dashboardTicketTableSlice;
