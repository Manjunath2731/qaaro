import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the ticket details
export interface TicketDetails {
    dpdTicketNumber: string;
    deadlineDate: Date;
    complainNumber: string;
    packageNumber: string;
    claimType: string;
    problem: string;
    amountInDispute: number;
    dpdReferenceNumber: string;
    packageDetails: {
        item: string;
        category: string;
        amount: number;
        manufacturer: string;
        article: string;
        furtherInformation: string;
        serialNumber: string;
        ean: string;
        id: string;
    };
    recipientDetails: {
        name: string;
        address: string;
    };
    parcelLabelAddress: {
        name: string;
        address: string;
    };
}

// Define the initial state for the slice
interface TicketsState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: TicketsState = {
    status: 'idle',
    error: null,
};


export const addNewTicket = createAsyncThunk(
    'tickets/addNewTicket',
    async ({ ticketDetails, anonymousId }: { ticketDetails: TicketDetails, anonymousId: string }, { rejectWithValue }) => {
        try {
            // Append anonymousId as a query parameter to the URL
            const response = await axiosAPIInstanceProject.post(`tickets/add-tickets?anonymousId=${anonymousId}`, ticketDetails);
            return response.data; // Adjust this line if necessary
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);




// Create a slice
const addTicketsSlice = createSlice({
    name: 'addTickets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addNewTicket.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addNewTicket.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(addNewTicket.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// Export the reducer
export const { reducer: addTicketsReducer } = addTicketsSlice;
