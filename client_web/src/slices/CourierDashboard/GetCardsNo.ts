// GetCardsNo slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

export interface TicketSummaryState {
    data: {
        fitstcard: {
            opened: number;
            closed: number;
            total: number;
        };
        secondcard: {
            onTime: number;
            delayedOpen: number;
            delayed: number;
        };
        thirdcard: {
            justified: number;
            denied: number;
            packageLost: number;
        };
        fourthcard: {
            'hours24': number;
            'hours48': number;
            'days3': number;
        };
    } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TicketSummaryState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchTicketSummary = createAsyncThunk(
    'ticketSummary/fetchTicketSummary',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('/ticket-summery');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const ticketSummarySlice = createSlice({
    name: 'ticketSummary',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTicketSummary.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTicketSummary.fulfilled, (state, action) => {
                console.log(action.payload); // Log the data received from the API
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload.data;
            })

            .addCase(fetchTicketSummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: ticketSummaryReducer } = ticketSummarySlice;
