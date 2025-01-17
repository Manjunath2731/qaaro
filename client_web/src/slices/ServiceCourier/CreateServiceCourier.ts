import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface CourierServiceData {
    name: string;
    mobile: number;
    address: string;
    designation: string;
    email: string;
    language: string;
    state: string;
    country: string;
    zipcode: number;
}

interface CourierServiceState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CourierServiceState = {
    status: 'idle',
    error: null,
};

export type CreateCourierServiceParams = {
    lamiId: string;
    name: string;
    mobile: number;
    email: string;
    address: string;
    designation: string;
    language: 'de' | 'en' | 'fr'; // Add other language codes if needed
    state: string;
    country: string;
    zipcode: number;
};


export const createCourierService = createAsyncThunk(
    'courierService/createCourierService',
    async (params: CreateCourierServiceParams, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.post(
                `create-courier?lamiId=${params.lamiId}`,
                params
            );
            return response.data; // Return the created courier service data
        } catch (error) {
            console.error('Error occurred while creating Courier Service:', error);
            return rejectWithValue(error.response?.data); // Return error response data
        }
    }
);

const courierServiceSlice = createSlice({
    name: 'courierService',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCourierService.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createCourierService.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
                console.log('Courier Service created successfully!');
            })
            .addCase(createCourierService.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    (action.payload as { message: string } | undefined)?.message ||
                    'An error occurred while creating Courier Service';
                console.error('Error occurred while creating Courier Service:', state.error);
            });
    },
});

export const { reducer: courierServiceReducer, actions: courierServiceActions } = courierServiceSlice;
