import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface UpdateTicketEmailState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UpdateTicketEmailState = {
    status: 'idle',
    error: null,
};

export const updateTicketEmail = createAsyncThunk(
    'tickets/updateTicketEmail',
    async (emailId: string) => {
        try {
            const response = await axiosAPIInstanceProject.post(`tickets/update-ticket-email?emailId=${emailId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data);
        }
    }
);

const updateTicketEmailSlice = createSlice({
    name: 'updateTicketEmail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateTicketEmail.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateTicketEmail.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateTicketEmail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            });
    },
});

export const { reducer: updateTicketEmailReducer } = updateTicketEmailSlice;
