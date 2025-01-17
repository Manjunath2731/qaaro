import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface AdminData {
  name: string;
  email: string;
  mobile: number;
  address: string;
  company: string;
  status: string;
  language: string;
  designation: string;
  state: string;
  country: string;
  zipcode: number;
}

interface AdminState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminState = {
  status: 'idle',

  error: null,
};


// Example type definition for CreateAdminParams
export type CreateAdminParams = {
  clientId: string;
  depoAdminId: string;
  name: string;
  email: string;
  mobile: number;
  address: string;
  company: string;
  language: 'English' | 'German' | 'French';
  designation: string;
  state: string;
  country: string;
  zipcode: number;
  adminData: AdminData;

};


export const createAdmin = createAsyncThunk(
  'admin/createAdmin',
  async (params: CreateAdminParams, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.post(`create-lami-admin?clientId=${params.clientId}&depoAdminId=${params.depoAdminId}`, params);
      return response.data; // Return the created admin data
    } catch (error) {
      console.error("Error occurred while creating Admin:", error);
      return rejectWithValue(error.response?.data); // Return error response data
    }
  }
);



const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAdmin.pending, (state) => {
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.error = null;
        console.log('Admin created successfully!');
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while creating Admin';
        console.error("Error occurred while creating Admin:", state.error);
      });
  },
});

export const { reducer: adminReducer, actions: adminActions } = adminSlice;
