import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the initial state
const initialState = {
    status: 'idle',
    error: null,
    isConnected: false,
    successMessage: '' // Add successMessage to the initial state
};

// Define the async thunk to fetch the connection status
export const fetchConnectionStatus = createAsyncThunk(
    'mail/fetchConnectionStatus',
    async (credentials: { user: string, password: string, host: string, port: number }, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.post('mail/check', credentials);
            return response.data; // Return the entire response data
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const changeConnectionStatusDeliberately = createAsyncThunk(
    'mail/changeConnectionStatusDeliberately',
    async (connected: boolean) => {
        return connected; // For simplicity, just return the passed value
    }
);

// Create a slice for the connection status
const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchConnectionStatus.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchConnectionStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isConnected = action.payload.connection; // Access the 'connection' property from the payload
                state.successMessage = action.payload.success; // Store the success message
                state.error = null;
            })
            .addCase(fetchConnectionStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(changeConnectionStatusDeliberately.fulfilled, (state, action) => {
                state.isConnected = action.payload; // Update isConnected with the value returned from the thunk
            })
            .addCase(changeConnectionStatusDeliberately.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer
export const { reducer: connectionReducer } = connectionSlice;
