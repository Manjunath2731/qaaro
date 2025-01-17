import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Ticket {
    _id: string;
    lamiAdminId: string;
    emailBody: string;
    attachment: {
        files: string[];
        _id: string;
    };
    status: string;
    emailDate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface AnonymousTicketsSliceState {
    tickets: Ticket[];
    loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    error: string | null;
}

const initialState: AnonymousTicketsSliceState = {
    tickets: [],
    loading: 'idle',
    error: null,
};

export const fetchAnonymousTickets = createAsyncThunk(
    'anonymousTickets/fetch',
    async () => {
        const response = await axiosAPIInstanceProject.get('tickets/get-annonymous-ticket');
        return response.data;
    }
);

const anonymousTicketsSlice = createSlice({
    name: 'anonymousTickets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnonymousTickets.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchAnonymousTickets.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.tickets = action.payload.data;
                state.error = null;
            })
            .addCase(fetchAnonymousTickets.rejected, (state, action) => {
                state.loading = 'rejected';
                state.error = action.error.message || 'Failed to fetch tickets';
            });
    },
});

export const { reducer: anonymousTicketsReducer } = anonymousTicketsSlice;
