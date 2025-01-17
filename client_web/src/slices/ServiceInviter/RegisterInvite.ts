// src/slices/registrationSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define a type for the slice state
interface RegistrationState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    successMessage: string | null;
}

// Define the initial state
const initialState: RegistrationState = {
    status: 'idle',
    error: null,
    successMessage: null,
};

// Define the type for the registration payload
interface RegistrationPayload {
    name: string;
    email: string;
    mobile: number;
    address: string;
    company: string;
    status: string;
    language: string;
    designation: string;
    state: string;
    country: string;
    zipcode: number;
    password: string;
    otp: number;
}

// Create an async thunk for registration
export const registerUser = createAsyncThunk<
    string, // Response type (success message)
    RegistrationPayload, // Payload type
    { rejectValue: string } // Rejected value type
>('registration/registerUser', async (payload: RegistrationPayload, { rejectWithValue }) => {
    try {
        const response = await axiosAPIInstanceProject.post('regestration', payload);
        return response.data.message; // Assuming the API returns a message in the response
    } catch (error) {
        return rejectWithValue('Registration failed');
    }
});

// Create the slice
const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded';
                state.successMessage = action.payload;
            })
            .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || 'An error occurred';
            });
    },
});

export const { reducer: registrationReducer } = registrationSlice;
