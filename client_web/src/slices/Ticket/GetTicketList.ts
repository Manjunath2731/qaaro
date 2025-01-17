import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Ticket {
    _id: string;
    complainNumber: string;
    packageNumber: string;
    claimType: string;
    problem: string;
    amountInDispute: number;
    deadlineDate: string;
    status: string;
    createdAt: string;
    SubStatus: string;
    courierData: {
        name: string;
    };
    hasPendingInEmail: boolean;
}


interface TicketState {
    tickets: Ticket[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TicketState = {
    tickets: [],
    status: 'idle',
    error: null,
};

export const fetchTicketList = createAsyncThunk(
    'tickets/fetchTicketList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('tickets/get-ticket-list');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTicketList.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTicketList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.tickets = action.payload;
            })
            .addCase(fetchTicketList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: ticketReducer } = ticketSlice;
