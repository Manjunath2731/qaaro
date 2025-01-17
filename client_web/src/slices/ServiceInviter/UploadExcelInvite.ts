import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface RegisterUploadState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

interface RegisterUploadData {
  file: File;
  language: string; // Added language field
}

const initialState: RegisterUploadState = {
  status: 'idle',
  loading: false,
  error: null,
  successMessage: null,
};

export const registerUpload = createAsyncThunk(
  'registerUpload',
  async ({ file, language }: RegisterUploadData, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language); // Append language to form data

    try {
      const response = await axiosAPIInstanceProject.post('invite-email-byexcel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while uploading file:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const registerUploadSlice = createSlice({
  name: 'registerUpload',
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
      .addCase(registerUpload.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUpload.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.status = 'succeeded';
        state.error = null;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUpload.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while uploading file';
        state.successMessage = null;
      });
  },
});

export const { reducer: registerUploadReducer, actions: { clearState } } = registerUploadSlice;
