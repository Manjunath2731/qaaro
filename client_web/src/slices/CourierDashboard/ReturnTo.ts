import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the state interface
interface ReturnToLamiState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: ReturnToLamiState = {
    status: 'idle',
    error: null,
};

// Async thunk to return ticket to LAMI
export const returnToLami = createAsyncThunk(
    'returnToLami/returnToLami',
    async ({ ticketId, description, files }: { ticketId: string; description: string; files: File[] }, { rejectWithValue }) => {
        try {
            // Create a new FormData object
            const formData = new FormData();
            // Append the description to the FormData
            console.log("description", description)
            formData.append('description', description);
            // Append each selected file to the FormData
            console.log("files", files)

            files.forEach((files, index) => {
                formData.append('files', files);
            });

            const response = await axiosAPIInstanceProject.post(`tickets/return-to-lami?ticketId=${ticketId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
                },
            });
            return response.data; // Assuming API returns success response
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);





// Create the return to LAMI slice
const returnToLamiSlice = createSlice({
    name: 'returnToLami',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(returnToLami.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(returnToLami.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(returnToLami.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// Export reducer
export const { reducer: returnToLamiReducer } = returnToLamiSlice;
