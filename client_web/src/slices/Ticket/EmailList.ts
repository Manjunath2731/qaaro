import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

export interface TicketEmail {
    emailBody: string;
    _id: string;
    status: string;
    ticketId: string;
    lamiAdminId: string;
    emailDate: string;
    type: string;
    attachment: {
        files: string[];
        _id: string;
    };
}

export interface TicketState {
    data: TicketEmail[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TicketState = {
    data: [],
    status: 'idle',
    error: null,
};

export const fetchTicketEmailList = createAsyncThunk(
    'uniqueTickets/fetchTicketEmailList',
    async (ticketId: string, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get(`tickets/get-ticket-email-list?ticketId=${ticketId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const uniqueTicketSlice = createSlice({
    name: 'uniqueTickets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTicketEmailList.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTicketEmailList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload.data;
            })
            .addCase(fetchTicketEmailList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: uniqueTicketReducer } = uniqueTicketSlice;
