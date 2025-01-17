import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';
import { RootState } from 'src/store';

// Define the interface for the update request body
interface CourierUpdateRequest {
    name: string;
    address: string;
    designation: string;
    status: string;
    lamiId: string;
}

// Define the initial state type
interface UpdateCourierState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UpdateCourierState = {
    status: 'idle',
    error: null,
};

// Define the async thunk for updating a courier
export const updateCourier = createAsyncThunk(
    'updateCourier',
    async ({ courierId, updateData }: { courierId: string; updateData: CourierUpdateRequest }) => {
        const response = await axiosAPIInstanceProject.put(`/update-courier?courierId=${courierId}`, updateData);
        return response.data;
    }
);

// Create the slice
const updateCourierSlice = createSlice({
    name: 'updateCourier',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateCourier.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCourier.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateCourier.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'An error occurred';
            });
    },
});


// Export the reducer to be included in the store
export const updateCourierReducer = updateCourierSlice.reducer;
