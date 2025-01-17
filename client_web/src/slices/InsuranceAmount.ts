import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface InsuranceAmount {
    insuTransferAmount: number;
    insuCompensationAmount: number;
    insuDeductible: number;
    finalLostAmmount: number;
}

interface InsuranceAmountState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    insuranceAmount: InsuranceAmount | null;
}

const initialState: InsuranceAmountState = {
    status: 'idle',
    error: null,
    insuranceAmount: null,
};

export const fetchinsuranceAmount = createAsyncThunk(
    'insurance/fetchinsuranceAmount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('tickets/get-insurance-amount'); // Replace with your API endpoint
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const insuranceAmountSlice = createSlice({
    name: 'insuranceAmount',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchinsuranceAmount.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchinsuranceAmount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.insuranceAmount = action.payload;
                state.error = null;
            })
            .addCase(fetchinsuranceAmount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: insuranceAmountReducer } = insuranceAmountSlice;
export const insuranceActions = insuranceAmountSlice.actions;

export default insuranceAmountReducer;
