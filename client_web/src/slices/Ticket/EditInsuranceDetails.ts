import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the payload
interface EditInsuranceDetailsPayload {
    ticketId: string;
    insuCompensationAmount: number;
    insuClaimNumber: string;
    insuDate: Date;
    insuDeductible: number;
    insuOurSign: string;
    insuTransferAmount: number;
    notes: string;
}

// Define the initial state for the slice
interface InsuranceUpdateState {
    loading: boolean;
    error: string | null;
    success: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: InsuranceUpdateState = {
    loading: false,
    error: null,
    success: false,
    status: 'idle',
};

// Define the async action creator for updating the insurance details
export const editInsuranceDetails = createAsyncThunk(
    'insurance/editInsuranceDetails',
    async (payload: EditInsuranceDetailsPayload) => {
        try {
            // Destructure the ticketId from the payload
            const { ticketId, ...data } = payload;
            // Make a PATCH request to the API with ticketId in the query parameter
            const response = await axiosAPIInstanceProject.post(`tickets/update-insurance?ticketId=${ticketId}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data);
        }
    }
);

// Create the slice
const insuranceUpdateSlice = createSlice({
    name: 'insuranceUpdate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(editInsuranceDetails.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.success = false;
            })
            .addCase(editInsuranceDetails.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
                state.success = true;
            })
            .addCase(editInsuranceDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
                state.success = false;
            });
    },
});

// Export the reducer
export const { reducer: insuranceUpdateReducer } = insuranceUpdateSlice;
