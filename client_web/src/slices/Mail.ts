import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface MailState {
    data: any;
    error: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: MailState = {
    data: null,
    error: null,
    status: 'idle',
};

export const fetchMailData = createAsyncThunk(
    'mail/get',
    async () => {
        try {
            const response = await axiosAPIInstanceProject.post('mail/get');
            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            throw new Error(error.response ? error.response.data : error.message);
        }
    }
);


const mailSlice = createSlice({
    name: 'mail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMailData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMailData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchMailData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            });
    },
});

export const mailReducer = mailSlice.reducer;
