import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the state interface
interface AssignCourierState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: AssignCourierState = {
    status: 'idle',
    error: null,
};

// Async thunk to assign courier to ticket
export const assignCourierToTicket = createAsyncThunk(
    'assignCourier/assignCourierToTicket',
    async ({ ticketId, courierId, description }: { ticketId: string; courierId: string; description: string }, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.post(`tickets/assign-courier?ticketId=${ticketId}&courierId=${courierId}`, {
                description // Include description in the request body
            });
            return response.data; // Assuming API returns success response
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


// Create the assign courier slice
const assignCourierSlice = createSlice({
    name: 'assignCourier',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(assignCourierToTicket.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(assignCourierToTicket.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(assignCourierToTicket.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// Export reducer
export const { reducer: assignCourierReducer } = assignCourierSlice;
