import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface TicketFinalState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TicketFinalState = {
    status: 'idle',
    error: null,
};

export const finalizeTicket = createAsyncThunk(
    'tickets/finalizeTicket',
    async ({ ticketId, description, status }: { ticketId: string, description: string; status: string }) => {
        try {
            const response = await axiosAPIInstanceProject.post(
                `tickets/ticket-final?ticketId=${ticketId}`,
                { description, status } // Include description in the request body
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response.data);
        }
    }
);


const ticketFinalSlice = createSlice({
    name: 'ticketFinal',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(finalizeTicket.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(finalizeTicket.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(finalizeTicket.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            });
    },
});

export const { reducer: ticketFinalReducer } = ticketFinalSlice;
