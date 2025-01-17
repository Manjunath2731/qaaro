import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the initial state
const initialState = {
  languages: [],
  loading: false,
  error: null,
};

// Define the async thunk for fetching languages
export const fetchLanguages = createAsyncThunk(
  'languages/fetchLanguages',
  async () => {
    const response = await axiosAPIInstanceProject.get('get-lang');
    return response.data.data;
  }
);

// Create a slice for languages
const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.languages = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

// Export the reducer and actions
export const { reducer: languagesReducer } = languagesSlice;
export default languagesSlice.reducer;
