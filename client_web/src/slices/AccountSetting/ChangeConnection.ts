import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store'; // Adjust the path to your RootState if necessary
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the state
interface ChangeStatusState {
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: ChangeStatusState = {
  loading: false,
  error: null,
};

// Create an async thunk for changing status
export const changeItemStatus = createAsyncThunk<
  void,
  { lamiId: string },
  { rejectValue: string; state: RootState }
>(
  'changeStatus/changeItemStatus',
  async ({ lamiId }, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.post(`tickets/disconnect?lamiId=${lamiId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Define the slice with reducers
const changeStatusSlice = createSlice({
  name: 'changeStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changeItemStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeItemStatus.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changeItemStatus.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'An unexpected error occurred';
      });
  },
});

// Export the reducer in the desired format
export const { reducer: changeStatusReducer } = changeStatusSlice;
