import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Ticket {
  ticketId: string;
  complaintNumber: string;
  statusPresence: {
    [key: string]: boolean;
  };
}

interface TicketTrackerState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

const initialState: TicketTrackerState = {
  tickets: [],
  loading: false,
  error: null,
};

// Thunk to fetch ticket tracker
export const fetchTicketTracker = createAsyncThunk(
  'ticketTracker/fetchTicketTracker',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.get('tickets/ticket-tracker');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Create slice
const ticketTrackerSlice = createSlice({
  name: 'ticketTracker',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketTracker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketTracker.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTicketTracker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { reducer: ticketTrackerReducer } = ticketTrackerSlice;
