import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface DeleteCourierState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DeleteCourierState = {
  status: 'idle',
  error: null,
};

// Thunk to delete a courier
export const deleteLamiCourier = createAsyncThunk(
  'courier/deleteLamiCourier',
  async (lamiCourierId: string, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.delete(`delete-lami-courier?lamiCourierid=${lamiCourierId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Create slice
const deleteCourierSlice = createSlice({
  name: 'courierDelete',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteLamiCourier.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteLamiCourier.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteLamiCourier.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { reducer: deleteCourierReducer } = deleteCourierSlice;
