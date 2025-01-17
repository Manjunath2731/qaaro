import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface CourierTicket {
    _id: string;
    complainNumber: string;
    packageNumber: string;
    claimType: string;
    problem: string;
    amountInDispute: number;
    deadlineDate: string;
    status: string;
    createdAt: string;
    SubStatus: string;
    returnDescCouri: string;
    returnDescLami: string;
}

interface CourierTicketState {
    tickets: CourierTicket[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CourierTicketState = {
    tickets: [],
    status: 'idle',
    error: null,
};

export const fetchCourierTickets = createAsyncThunk(
    'courierTickets/fetchCourierTickets',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get('get-courier-tickets');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const courierTicketSlice = createSlice({
    name: 'courierTickets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourierTickets.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCourierTickets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.tickets = action.payload;
            })
            .addCase(fetchCourierTickets.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { reducer: courierTicketReducer } = courierTicketSlice;
