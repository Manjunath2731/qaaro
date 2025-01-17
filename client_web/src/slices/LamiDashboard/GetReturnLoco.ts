import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface ReturnTicket {
    to: string;
    subject: string;
    message: string;
    signature: string;
    attachment: {
        files: string[];
        _id: string;
    };
}

interface ReturnTicketResponse {
    status: boolean;
    data: ReturnTicket;
    message: string;
}

interface ReturnTicketState {
    ticket: ReturnTicket | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ReturnTicketState = {
    ticket: null,
    status: 'idle',
    error: null,
};

export const fetchReturnTicket = createAsyncThunk(
    'returnTicket/fetchReturnTicket',
    async (ticketId: string, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get(`tickets/get-return-ticket?ticketId=${ticketId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const returnTicketSlice = createSlice({
    name: 'returnTicket',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReturnTicket.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchReturnTicket.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.ticket = action.payload.data;
            })
            .addCase(fetchReturnTicket.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: returnTicketReducer } = returnTicketSlice;












