import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface RegisterState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

interface RegisterData {
  emails: string;
  language: string; // Added language field
}

const initialState: RegisterState = {
  status: 'idle',
  loading: false,
  error: null,
  successMessage: null,
};

export const register = createAsyncThunk(
  'register',
  async ({ emails, language }: RegisterData, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.post('invite-email', { emails, language });
      return response.data;
    } catch (error) {
      console.error("Error occurred while registering:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
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
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.status = 'succeeded';
        state.error = null;
        state.successMessage = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while registering';
        state.successMessage = null;
      });
  },
});

export const { reducer: registerReducer, actions: { clearState } } = registerSlice;
