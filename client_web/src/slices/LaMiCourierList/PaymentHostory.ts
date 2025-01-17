import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface TicketAmountState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  offset: {
    _id: string;
    date: string;
    paidAmount: number;
  }[];
  lostdata: {
    complainNumber: string;
    status: string;
    lostAmount: number;
  }[];
}

const initialState: TicketAmountState = {
  status: 'idle',
  error: null,
  offset: [],
  lostdata: [],
};

export const fetchTicketAmount = createAsyncThunk(
  'tickets/fetchTicketAmount',
  async (courierId: string, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.get(`tickets/get-paid-amount?courierId=${courierId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const ticketAmountSlice = createSlice({
  name: 'ticketAmount',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketAmount.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTicketAmount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.offset = action.payload.offset;
        state.lostdata = action.payload.lostdata;
      })
      .addCase(fetchTicketAmount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { reducer: ticketAmountReducer } = ticketAmountSlice;
