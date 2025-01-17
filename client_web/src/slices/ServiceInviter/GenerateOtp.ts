// src/slices/otpSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface OtpState {
    otp: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: OtpState = {
    otp: null,
    status: 'idle',
    error: null,
};

interface GenerateOtpPayload {
    email: string; // Include email in the payload
}

export const generateOtp = createAsyncThunk<number, GenerateOtpPayload>(
    'otp/generateOtp',
    async (payload: GenerateOtpPayload) => {
        const response = await axiosAPIInstanceProject.post('generate-otp', payload, {
            headers: {
                'Content-Type': 'application/json' // Use application/json
            },
        });
        return response.data.otp; // Adjust based on actual API response
    }
);

const otpSlice = createSlice({
    name: 'otp',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generateOtp.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(generateOtp.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                state.otp = action.payload;
            })
            .addCase(generateOtp.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to generate OTP';
            });
    },
});

export const otpReducer = otpSlice.reducer;
export const otpActions = otpSlice.actions;
export default otpSlice;
