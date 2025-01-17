import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the state interface
interface ReassignCourierState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: ReassignCourierState = {
    status: 'idle',
    error: null,
};

// Async thunk to reassign courier to ticket
export const reassignCourierToTicket = createAsyncThunk(
    'reassignCourier/reassignCourierToTicket',
    async ({ ticketId, courierId, description }: { ticketId: string; courierId: string; description: string }, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.post(`tickets/return-courier?ticketId=${ticketId}&courierId=${courierId}`, {
                description // Include description in the request body
            });
            return response.data; // Assuming API returns success response
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


// Create the reassign courier slice
const reassignCourierSlice = createSlice({
    name: 'reassignCourier',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(reassignCourierToTicket.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(reassignCourierToTicket.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(reassignCourierToTicket.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// Export reducer
export const { reducer: reassignCourierReducer } = reassignCourierSlice;
