import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface InsuranceState {
    insuranceData: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: InsuranceState = {
    insuranceData: [],
    status: 'idle',
    error: null,
};

export const fetchInsuranceData = createAsyncThunk(
    'insurance/fetchInsuranceData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('tickets/get-insurance-list'); // Replace with your API endpoint
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const insuranceSlice = createSlice({
    name: 'insurance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInsuranceData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchInsuranceData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.insuranceData = action.payload;
                state.error = null;
            })
            .addCase(fetchInsuranceData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: insuranceReducer } = insuranceSlice;
export const insuranceActions = insuranceSlice.actions;

export default insuranceReducer;
