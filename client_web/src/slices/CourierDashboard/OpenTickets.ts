import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

export interface TicketOpenedItem {
    id: string;
    complainNumber: string;
    packageNumber: string;
    claimType: string;
    problem: string;
    amountInDispute: number;
    deadlineDate: string;
    status: string;
}

export interface TicketOpenedState {
    data: TicketOpenedItem[] | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TicketOpenedState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchTicketOpened = createAsyncThunk(
    'ticketOpened/fetchTicketOpened',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('ticket-opened');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const ticketOpenedSlice = createSlice({
    name: 'ticketOpened',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTicketOpened.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTicketOpened.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload.data;
            })
            .addCase(fetchTicketOpened.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: ticketOpenedReducer } = ticketOpenedSlice;
