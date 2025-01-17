import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface PasswordResetState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';

}

interface ResetPasswordData {
  currentPassword: string;
  newPassword: string;
}

const initialState: PasswordResetState = {
  status: 'idle',

  loading: false,
  error: null,
  successMessage: null,
};

export const resetPassword = createAsyncThunk(
  'password/reset',
  async ({ currentPassword, newPassword }: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.post('reset-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      console.error("Error occurred while changing  password:", error);

      return rejectWithValue(error.response.data);
    }
  }
);

const passwordResetSlice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.status = 'succeeded';
        state.error = null;
        state.successMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while changing password';
        state.successMessage = null;
      });
  },
});

export const { reducer: resetPasswordReducer, actions: { clearState } } = passwordResetSlice;

