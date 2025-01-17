import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store'; // Assuming you have RootState defined in your store setup
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the account details state
interface AccountDetailsState {
    loading: boolean;
    error: string | null;
}

// Define the initial state for account details
const initialState: AccountDetailsState = {
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

// Create an async thunk for adding account details
export const addAccountDetails = createAsyncThunk<
    void,
    AccountDetailsData,
    { rejectValue: string; state: RootState }
>('accountDetails/add', async (accountData, { rejectWithValue }) => {
    try {
        const { userId, ...data } = accountData; // Extract userId from accountData
        const response = await axiosAPIInstanceProject.post(`add-account-details?userId=${userId}`, data);
        return response.data;
    } catch (error) {
        // If an error occurs, reject the thunk with the error message
        return rejectWithValue(error.message);
    }
});

// Define the account details slice with reducers
const accountDetailsSlice = createSlice({
    name: 'accountDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle pending state while adding account details
            .addCase(addAccountDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Handle fulfilled state after successfully adding account details
            .addCase(addAccountDetails.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            // Handle rejected state if an error occurs while adding account details
            .addCase(addAccountDetails.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload; // action.payload contains the error message
            });
    },
});

// Export the slice reducer
export const accountDetailsReducer = accountDetailsSlice.reducer;
