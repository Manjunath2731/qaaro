import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface NoClaimState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NoClaimState = {
    status: 'idle',
    error: null,
};

export const finalizeNoClaim = createAsyncThunk(
    'noClaim/finalizeNoClaim',
    async ({ ticketId, description }: { ticketId: string, description: string }) => {
        try {
            const response = await axiosAPIInstanceProject.post(
                `tickets/insurance-final?ticketId=${ticketId}`,
                { description } // Remove status from the request body
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response.data);
        }
    }
);

const noClaimSlice = createSlice({
    name: 'noClaim',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(finalizeNoClaim.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(finalizeNoClaim.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(finalizeNoClaim.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            });
    },
});

export const { reducer: noClaimReducer } = noClaimSlice;
