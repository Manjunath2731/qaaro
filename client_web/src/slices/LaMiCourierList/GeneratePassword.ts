import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface GeneratePasswordState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: GeneratePasswordState = {
    status: 'idle',
    error: null,
};

// Thunk to generate password for a courier
export const generateCourierPassword = createAsyncThunk(
    'courier/generateCourierPassword',
    async (courierid: string, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.post(`generate-password?courierid=${courierid}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Create slice
const generatePasswordSlice = createSlice({
    name: 'generatePassword',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generateCourierPassword.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(generateCourierPassword.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(generateCourierPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: generatePasswordReducer } = generatePasswordSlice;
