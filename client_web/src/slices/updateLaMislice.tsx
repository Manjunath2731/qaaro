import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Admin {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  company: string;
  status: string;
  designation: string;
  avatar: {
    publicId: string;
    url: string;
    _id: string;
  };
}

interface UpdateAdminState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UpdateAdminState = {
  status: 'idle',
  error: null,
};

export const updateLamiAdmin = createAsyncThunk(
  'admin/updateLamiAdmin',
  async ({ lamiAdminId, depoAdminId, updatedData }: { lamiAdminId: string, depoAdminId: string, updatedData: Partial<Admin> }, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.put(`update-lami-admin?lamiAdminId=${lamiAdminId}&depoAdminId=${depoAdminId}`, updatedData);
      return response.data.data;
    } catch (error) {
      console.error("Error occurred while updating Admin:", error);
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const updateLamiAdminSlice = createSlice({
  name: 'management',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateLamiAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateLamiAdmin.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateLamiAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while updating Admin';
      });
  },
});

export const { reducer: updateLamiAdminReducer } = updateLamiAdminSlice;
