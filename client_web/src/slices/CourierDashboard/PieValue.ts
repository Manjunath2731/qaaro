import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface GraphSecondData {
  returned: number;
  total: number;
  open: number;
  success: number;
  lost: number;

  amount: {
    netLost: number;
  }
}

export const fetchGraphSecondData = createAsyncThunk<GraphSecondData, void, { rejectValue: string }>(
  'graphSecond/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.get<{ data: GraphSecondData }>('graph-second');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

interface GraphSecondState {
  data: GraphSecondData | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const initialState: GraphSecondState = {
  data: null,
  loading: 'idle',
  error: null,
};

const graphSecondSlice = createSlice({
  name: 'graphSecond',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraphSecondData.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchGraphSecondData.fulfilled, (state, action) => {
        state.loading = 'fulfilled';
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchGraphSecondData.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.payload ? action.payload : 'Failed to fetch graph second data';
      });
  },
});

export const { reducer: graphSecondReducer } = graphSecondSlice;
