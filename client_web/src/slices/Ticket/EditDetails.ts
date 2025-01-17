import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the payload
interface UpdateTicketPayload {
    ticketId: string;
    dpdTicketNumber: string;
    complainNumber: string;
    packageNumber: string;
    claimType: string;
    problem: string;
    amountInDispute: number;
    dpdReferenceNumber: string;
    packageDetails: {
        item: string;
        category: string;
        amount: string;
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
    deadlineDate: Date;
}

// Define the initial state for the slice
interface TicketUpdateState {
    loading: boolean;
    error: string | null;
    success: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';

}

const initialState: TicketUpdateState = {
    loading: false,
    error: null,
    success: false,
    status: 'idle',

};

// Define the async action creator for updating the ticket
export const updateTicket = createAsyncThunk(
    'tickets/updateTicket',
    async (payload: UpdateTicketPayload) => {
        try {
            // Destructure the ticketId from the payload
            const { ticketId, ...data } = payload;
            // Make a PATCH request to the API with ticketId in the query parameter
            console.log("response value", payload)

            const response = await axiosAPIInstanceProject.patch(`/tickets/ticket-update?ticketId=${ticketId}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data);
        }
    }
);

// Create the slice
const ticketUpdateSlice = createSlice({
    name: 'ticketUpdate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateTicket.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.success = false;
            })
            .addCase(updateTicket.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
                state.success = true;
            })
            .addCase(updateTicket.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
                state.success = false;
            });
    },
});

// Export the reducer
export const { reducer: ticketUpdateReducer } = ticketUpdateSlice;
