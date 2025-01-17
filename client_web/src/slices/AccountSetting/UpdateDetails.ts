import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the account details state
interface UpdateDetailsState {
    loading: boolean;
    error: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Define the initial state for account details
const initialState: UpdateDetailsState = {
    status: 'idle',
    loading: false,
    error: null,
};

// Define the interface for the account details data
interface AccountDetailsData {
    userId: string; // Add userId to the interface
    emailServer: {
        user: string;
        password: string;
        host: string;
        port: number;
    };
    connected: boolean;
    emailSignature: string;
    emailTemplateHtml: string;
}

// Create an async thunk for updating account details
export const updateAccountDetails = createAsyncThunk<
    void,
    AccountDetailsData,
    { rejectValue: string; state: RootState }
>('updateDetails/update', async (accountData, { rejectWithValue }) => {
    try {
        const { userId, ...data } = accountData; // Extract userId from accountData
        const response = await axiosAPIInstanceProject.put(`update-account-details?userId=${userId}`, data);
        return response.data;
    } catch (error) {
        // If an error occurs, reject the thunk with the error message
        return rejectWithValue(error.response.data);
    }
});

// Define the account details slice with reducers
const updateDetailsSlice = createSlice({
    name: 'updateDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle pending state while updating account details
            .addCase(updateAccountDetails.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            // Handle fulfilled state after successfully updating account details
            .addCase(updateAccountDetails.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            // Handle rejected state if an error occurs while updating account details
            .addCase(updateAccountDetails.rejected, (state, action: PayloadAction<string>) => {
                state.status = 'failed';
                state.error = action.payload; // action.payload contains the error message
            });
    },
});

// Export the slice reducer
export const updateDetailsReducer = updateDetailsSlice.reducer;
