import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define a type for the status details object
interface StatusDetail {
  present: boolean;
  description?: string;
  date?: string;
  avatar?: {
    publicId: string;
    url: string;
    _id: string;
  };
}

// Define a type for the entire API response
interface TrackerDetailsResponse {
  status: boolean;
  data: {
    complainNumber: string;
    statusDetails: {
      [key: string]: StatusDetail;
    };
  } | null;
  message: string;
}

// Define initial state
const initialState: {
  trackerDetails: TrackerDetailsResponse | null;
  loading: boolean;
  error: string | null;
} = {
  trackerDetails: null,
  loading: false,
  error: null,
};

// Async thunk to fetch tracker details
export const fetchTrackerDetails = createAsyncThunk(
  'trackerDetails/fetchTrackerDetails',
  async (ticketId: string, thunkAPI) => {
    try {
      const response = await axiosAPIInstanceProject.get(`/tickets/ticket-tracket-details?ticketId=${ticketId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Create tracker details slice
const trackerDetailsSlice = createSlice({
  name: 'trackerDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrackerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrackerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.trackerDetails = action.payload;
      })
      .addCase(fetchTrackerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export reducer
export const trackerDetailsReducer = trackerDetailsSlice.reducer;
