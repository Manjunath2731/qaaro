// src/slices/resendInvitationSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define a type for the slice state
interface ResendInvitationState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: ResendInvitationState = {
  status: 'idle',
  error: null,
};

// Create an async thunk for resending the invitation
export const resendInvitation = createAsyncThunk<
  void,
  string, // emailId
  { rejectValue: string }
>('resendInvitation/resend', async (emailId: string, { rejectWithValue }) => {
  try {
    await axiosAPIInstanceProject.post(`resend-invitation?emailId=${emailId}`);
  } catch (error) {
    return rejectWithValue('Failed to resend the invitation');
  }
});

// Create the slice
const resendInvitationSlice = createSlice({
  name: 'resendInvitation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resendInvitation.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resendInvitation.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resendInvitation.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { reducer: resendInvitationReducer } = resendInvitationSlice;
