import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface RejectInsuranceState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface RejectInsurancePayload {
    ticketId: string;
    insuClaimNumber: string;
    insuOurSign: string;
    insuDate: Date;
    notes: string;
}

const initialState: RejectInsuranceState = {
    status: 'idle',
    error: null,
};

export const rejectInsurance = createAsyncThunk(
    'insurance/reject',
    async (payload: RejectInsurancePayload, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.post(
                `/tickets/reject-insurance?ticketId=${payload.ticketId}`, 
                {
                    notes: payload.notes,
                    insuClaimNumber: payload.insuClaimNumber,
                    insuOurSign: payload.insuOurSign,
                    insuDate: payload.insuDate,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const rejectInsuranceSlice = createSlice({
    name: 'insuranceReject',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(rejectInsurance.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(rejectInsurance.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(rejectInsurance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: rejectInsuranceReducer } = rejectInsuranceSlice;
export const rejectInsuranceActions = rejectInsuranceSlice.actions;
