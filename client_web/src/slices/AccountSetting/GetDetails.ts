import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';
import { RootState } from '../../store';

// Define the interface for the account details state
interface GetAccountDetailsState {
    loading: boolean;
    error: string | null;
    data: any | null; // Define the type based on the response structure
}

// Define the initial state for account details
const initialState: GetAccountDetailsState = {
    loading: false,
    error: null,
    data: null,
};

// Create an async thunk for getting account details
export const getAccountDetails = createAsyncThunk<
    any, // Define the return type based on the response structure
    string, // Define the type for the userId parameter
    { rejectValue: string; state: RootState }
>('getAccountDetails/fetch', async (userId, { rejectWithValue }) => {
    try {
        const response = await axiosAPIInstanceProject.get(`get-account-details?userId=${userId}`);
        return response.data.data; // Return the account details from the response
    } catch (error) {
        // If an error occurs, reject the thunk with the error message
        return rejectWithValue(error.message);
    }
});

// Create an action to manually change the connection status
export const changeConnectionStatus = createAsyncThunk<
    boolean, // Define the return type based on the new connection status
    boolean, // Define the type for the new connection status (true or false)
    { state: RootState; getState: () => RootState } // Explicitly define the type of getState
>('getAccountDetails/changeConnectionStatus', async (connected, { getState }) => {
    // Assuming you have access to the current state
    const currentState = getState();
    // Perform any necessary logic to update the connection status
    // For simplicity, I'll just return the inverse of the current connection status
    return !currentState.getAccountDetails.data?.emailServer.connected;
});

// Define the account details slice with reducers
const accountDetailsSlice = createSlice({
    name: 'getAccountDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle pending state while getting account details
            .addCase(getAccountDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = null;
            })
            // Handle fulfilled state after successfully getting account details
            .addCase(getAccountDetails.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload;
            })
            // Handle rejected state if an error occurs while getting account details
            .addCase(getAccountDetails.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload; // action.payload contains the error message
                state.data = null;
            })
            // Handle changing the connection status
            .addCase(changeConnectionStatus.fulfilled, (state, action: PayloadAction<boolean>) => {
                if (state.data) {
                    console.log("Current state data:", state.data);
                    console.log("Action payload (new connection status):", action.payload);
                    state.data = {
                        ...state.data,
                        emailServer: {
                            ...state.data.emailServer,
                            connected: action.payload // Update the connection status
                        }
                    };
                    console.log("Updated state data:", state.data);
                }
            });
    },
});

// Export the slice reducer and action
export const { reducer: getAccountDetailsReducer } = accountDetailsSlice;
