import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define interfaces for payload and state
interface CheckLinkStatusPayload {
    linkId: string;
}

interface LinkStatusData {
    linkId: string;
    active: boolean;
}

interface LinkStatusState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: LinkStatusData | null; // Store link status data
}

// Define initial state
const initialState: LinkStatusState = {
    status: 'idle',
    error: null,
    data: null,
};

// Create async thunk for checking link status
export const checkLinkStatus = createAsyncThunk(
    'tickets/checkLinkStatus',
    async (payload: CheckLinkStatusPayload, { rejectWithValue }) => {
        try {
            const { linkId } = payload;
            const response = await axiosAPIInstanceProject.get(`tickets/link-status?linkId=${linkId}`);
            console.log("DATA CHECKER @", response.data)
            return response.data; // Return any data returned by the API if needed
        } catch (error) {
            console.error('Error occurred while checking link status:', error);
            return rejectWithValue(error.response?.data); // Return error response data
        }
    }
);

// Create link status slice
const linkStatusSlice = createSlice({
    name: 'linkStatus',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkLinkStatus.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(checkLinkStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload.data; // Store link status data
                console.log('Link status checked successfully!');
            })
            .addCase(checkLinkStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    (action.payload as { message: string } | undefined)?.message ||
                    'An error occurred while checking link status';
                console.error('Error occurred while checking link status:', state.error);
            });
    },
});

// Export reducer and actions
export const { reducer: linkStatusReducer, actions: linkStatusActions } = linkStatusSlice;
