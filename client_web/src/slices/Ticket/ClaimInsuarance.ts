import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface SendClaimInsuranceState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface ClaimInsurancePayload {
    ticketId: string;
    data: FormData | {
        to: string;
        cc: string[];
        bcc: string[];
        subject: string;
        message: string;
        files: File[];
        attachment: string; // Change attachment type to string
        notes: string; // Added notes field as a string
    };
}

const initialState: SendClaimInsuranceState = {
    status: 'idle',
    error: null,
};

export const sendClaimInsurance = createAsyncThunk(
    'claimInsurance/send',
    async (payload: ClaimInsurancePayload, { rejectWithValue }) => {
        try {
            let formData: FormData;

            // Check if payload.data is FormData
            if (payload.data instanceof FormData) {
                formData = payload.data;
            } else {
                // Create FormData and append email data
                formData = new FormData();
                formData.append('to', payload.data.to);
                formData.append('cc', payload.data.cc.join(','));
                formData.append('bcc', payload.data.bcc.join(','));
                formData.append('subject', payload.data.subject);
                formData.append('message', payload.data.message);
                formData.append('attachment', payload.data.attachment); // Append attachment as string
                formData.append('notes', payload.data.notes); // Append notes field

                // Append files to FormData
                payload.data.files.forEach((file) => {
                    formData.append('files', file);
                });
            }

            const response = await axiosAPIInstanceProject.post(
                `/tickets/apply-insurance?ticketId=${payload.ticketId}`, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const claimInsuranceSlice = createSlice({
    name: 'claimInsurance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendClaimInsurance.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(sendClaimInsurance.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(sendClaimInsurance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: claimInsuranceReducer } = claimInsuranceSlice;
export const claimInsuranceActions = claimInsuranceSlice.actions;
