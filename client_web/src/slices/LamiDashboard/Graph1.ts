import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

export interface Graph1Data {
  date: string;
  open: number;
  loco: number;
  success: number;
  lost: number;
}

export interface Graph1State {
  data: Graph1Data[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: Graph1State = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchGraph1Data = createAsyncThunk(
  'graph1/fetchGraph1Data',
  async (period: string, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.get(`/dashboard-graph1?period=${period}`);
      return response.data.data.results.map((result: [string, { open: number; loco: number; success: number; lost: number }]) => ({
        date: result[0],
        open: result[1].open,
        loco: result[1].loco,
        success: result[1].success,
        lost: result[1].lost,
      }));
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const graph1Slice = createSlice({
  name: 'graph1',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraph1Data.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGraph1Data.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchGraph1Data.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { reducer: graph1Reducer } = graph1Slice;
