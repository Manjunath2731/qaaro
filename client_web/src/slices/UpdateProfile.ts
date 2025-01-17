import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the update user payload
export interface UpdateUserPayload {
  name: string;
  email: string;
  mobile: number;
  address: string;
  status: string;
  language: string;
  designation: string;
  state: string;
  country: string;
  zipcode: number;
  avatar: File | string; // Allow avatar to be a File or string
}

// Define the initial state interface
interface UpdateUserState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state
const initialState: UpdateUserState = {
  status: 'idle',
  error: null,
};

// Define the update user thunk
export const updateUser = createAsyncThunk(
  'user/update',
  async (payload: UpdateUserPayload, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('name', payload.name);
      formData.append('email', payload.email);
      formData.append('mobile', payload.mobile.toString());
      formData.append('address', payload.address);
      formData.append('status', payload.status);
      formData.append('language', payload.language);
      formData.append('designation', payload.designation);
      formData.append('state', payload.state);
      formData.append('country', payload.country);
      formData.append('zipcode', payload.zipcode.toString());

      // Check if avatar is a file before appending
      if (payload.avatar instanceof File) {
        formData.append('avatar', payload.avatar);
      } else {
        formData.append('avatar', payload.avatar);
      }

      const response = await axiosAPIInstanceProject.post('update-user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      return response.data;
    } catch (error) {
      console.error("Error occurred while updating:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the update user slice
const updateUserSlice = createSlice({
  name: 'userUpdate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while updating user';
      });
  },
});

// Export the reducer
export const { reducer: updateUserReducer } = updateUserSlice;
