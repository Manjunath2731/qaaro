import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface AttachToTicketResponse {
    success: boolean;
    message: string;
}

export const attachToTicket = createAsyncThunk(
    'tickets/attachToTicket',
    async ({ anonymousId, ticketId }: { anonymousId: string; ticketId: string }, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.post(`tickets/attach-to-ticket?annonymousId=${anonymousId}&ticketId=${ticketId}`);
            return response.data as AttachToTicketResponse;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const attachToTicketSlice = createSlice({
    name: 'attachToTicket',
    initialState: {
        status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(attachToTicket.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(attachToTicket.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(attachToTicket.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: attachToTicketReducer } = attachToTicketSlice;
