import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Admin {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  company: {
    companyName: string;
  }
  clientAdminId: {
    name: string;
  }
  depoAdminId: {
    name: string;
  }
  status: string;
  designation: string;
  avatar: {
    publicId: string;
    url: string;
    _id: string;
  };
  totalTicketCount: string;
  totalCourierCount: string;
}

interface LamiState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  admins: Admin[];
  plugoAdminId: string;
}

const initialState: LamiState = {
  status: 'idle',
  error: null,
  admins: [],
  plugoAdminId: '',
};

// Thunk to fetch admins
export const fetchLamiAdmins = createAsyncThunk(
  'lami/fetchLamiAdmins',
  async (
    {
      clientId,
      depoAdminId,
    }: { clientId?: string; depoAdminId?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (clientId) params.append('clientId', clientId);
      if (depoAdminId) params.append('depoAdminId', depoAdminId);
      const response = await axiosAPIInstanceProject.get(`get_lami?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Create slice
const lamiSlice = createSlice({
  name: 'lami',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLamiAdmins.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLamiAdmins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.admins = action.payload;
      })
      .addCase(fetchLamiAdmins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { reducer: lamiReducer } = lamiSlice;
