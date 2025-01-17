import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';
import { RootState } from '../../store/rootReducer'; // Adjust the path to your root state file

export interface DashboardTicketCourierState {
  data: {
    avatar: {
      publicId: string;
      url: string;
      _id: string;
    };
    name: string;
    open: number;
    closed: number;
    designation: string;
    lost: string;
  }[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DashboardTicketCourierState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchDashboardTicketCourierData = createAsyncThunk(
  'dashboardTicketCourier/fetchDashboardTicketCourierData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.get('/dashboard-ticket-courier');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const dashboardTicketCourierSlice = createSlice({
  name: 'dashboardTicketCourier',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardTicketCourierData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardTicketCourierData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.data = action.payload.data;
      })
      .addCase(fetchDashboardTicketCourierData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { reducer: dashboardTicketCourierReducer } = dashboardTicketCourierSlice;

// Define selectDrivers here
export const selectDrivers = (state: RootState) => state.dashboardTicketCourier.data;
