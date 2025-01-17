import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

export interface Graph2Data {
  date: string;
  assignedCount: number;
  completedCount: number;
}

export interface Graph2State {
  data: Graph2Data[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: Graph2State = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchGraph2Data = createAsyncThunk(
  'graph2/fetchGraph2Data',
  async (period: string, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.get(`/dashboard-graph2?period=${period}`);
      return response.data.data.results.map((result: [string, { assigned: number; completed: number }]) => ({
        date: result[0],
        assignedCount: result[1].assigned,
        completedCount: result[1].completed,
      }));
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const graph2Slice = createSlice({
  name: 'graph2',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraph2Data.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGraph2Data.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchGraph2Data.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { reducer: graph2Reducer } = graph2Slice;
