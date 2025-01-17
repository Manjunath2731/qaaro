import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface AcceptInsuranceState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface AcceptInsurancePayload {
    ticketId: string;
    data: {
        insuClaimNumber: string;
        insuOurSign: string;
        insuDate: Date;
        insuTransferAmount: number;
        insuCompensationAmount: number;
        insuDeductible: number;
        notes: string;
    };
}

const initialState: AcceptInsuranceState = {
    status: 'idle',
    error: null,
};

export const acceptInsurance = createAsyncThunk(
    'insurance/accept',
    async (payload: AcceptInsurancePayload, { rejectWithValue }) => {
        try {
            const { ticketId, data } = payload;

            const response = await axiosAPIInstanceProject.post(`tickets/accept-insurance?ticketId=${ticketId}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const acceptInsuranceSlice = createSlice({
    name: 'acceptInsurance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(acceptInsurance.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(acceptInsurance.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(acceptInsurance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: acceptInsuranceReducer } = acceptInsuranceSlice;
export const acceptInsuranceActions = acceptInsuranceSlice.actions;
