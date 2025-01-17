import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface UserData {
  _id: string;
  name: string;
  email: string;
  mobile: number;
  address: string;
  role: string;
  availableUser: number;
  company: {

    id: string;
    companyName: string;
  };
  status: string;
  language: string;
  designation: string;
  avatar: {
    publicId: string;
    url: string;
    _id: string;
  };
  connected: boolean;
}

interface UserDataState {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserDataState = {
  userData: null,
  loading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk<UserData, void>(
  'userData/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPIInstanceProject.get<{ data: UserData }>('getuserdata');
      return response.data.data; // Access the actual UserData object
    } catch (error) {
      // Handle server errors or downtime
      if (error.code === 'ECONNREFUSED') {
        return rejectWithValue('The server is currently unavailable. Please try again later.');
      } else {
        return rejectWithValue('An error occurred while fetching user data.');
      }
    }
  }
);

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserData>) => {
      state.loading = false;
      state.userData = action.payload;
    });
    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string; // Set error message from rejectWithValue
    });
  },
});

export const { reducer: userDataReducer } = userDataSlice; // Exporting reducer in the desired format

export default userDataSlice.reducer;
