import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the Client Admin and the slice state
interface ClientAdmin {
  _id: string;
  name: string;
  email: string;
  mobile: number;
  address: string;
  role: string;
  company: {
    _id: string;
    companyName: string;
  };
  status: string;
  language: string;
  designation: string;
  zipcode: number;
  state: string;
  country: string;
  avatar: {
    publicId: string;
    url: string;
    _id: string;
  };
  plugoAdminId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ClientAdminFetchState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  data: {
    clientAdmin: ClientAdmin;
    depoAdminCount: number;
    lamiAdminCount: number;
    courierCount: number;
    ticketCount: number;
  }[] | null;
  error: string | null;
}

// Initial state
const initialState: ClientAdminFetchState = {
  status: 'idle',
  data: null,
  error: null,
};

// Thunk to fetch client admins
export const fetchClientAdmins = createAsyncThunk(
  'clientAdmin/fetchClientAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.get('/get_client_Admin');
      return response.data.data;
    } catch (error) {
      console.error("Error occurred while fetching client admins:", error);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

// Create slice
const clientAdminSlice = createSlice({
  name: 'clientAdminFetch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientAdmins.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.data = null;
      })
      .addCase(fetchClientAdmins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Make sure data is being set correctly
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchClientAdmins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while fetching client admins';
      });
  },
});

export const { reducer: clientAdminReducer } = clientAdminSlice;
