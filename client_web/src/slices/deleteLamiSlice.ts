import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface DeleteAdminState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DeleteAdminState = {
  status: 'idle',
  error: null,
};

export const deleteLamiAdmin = createAsyncThunk(
  'admin/deleteLamiAdmin',
  async (lamiAdminId: string, { rejectWithValue }) => {
    try {
      await axiosAPIInstanceProject.delete(`delete-lami-admin?lamiAdminId=${lamiAdminId}`);
      return lamiAdminId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const deleteLamiAdminSlice = createSlice({
  name: 'deleteLamiAdmin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteLamiAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteLamiAdmin.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteLamiAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { reducer: deleteLamiAdminReducer } = deleteLamiAdminSlice;
