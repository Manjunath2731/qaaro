import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the ticket details
interface TicketDetails {
    _id: string;
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
        amount: number;
        manufacturer: string;
        article: string;
        furtherInformation: string;
        serialNumber: string;
        ean: string;
        id: string;
    };
    sellerDetails: {
        email: string;
    };
    recipientDetails: {
        name: string;
        address: string;
    };
    parcelLabelAddress: {
        name: string;
        address: string;
    };
    deadlineDate: string;
    locoContacts: {
        name: string;
        email: string;
        address: string;
    };
    status: string;
    returnDescCouri: string;
    returnDescLami: string;
    attachment: {
        files: string[];
        _id: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
    signedoc?: {
        files: string[];
        _id: string;
    };
    SubStatus: string;
    courierdata: {
        _id: string;
        name: string;
        email: string;
        mobile: number;
        address: string;
        role: string;
        company: string;
        status: string;
        language: string;
        designation: string;
        zipcode: number;
        state: string;
        country: string;
        avatar: {
            publicId: string;
            url: string;
            _id: string;
        };
    };
    invoicedData: {
        attachment: {
            files: string[];
        };
    }
}


// Define the state interface
interface TicketDetailsState {
    ticketDetails: TicketDetails | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: TicketDetailsState = {
    ticketDetails: null,
    status: 'idle',
    error: null,
};

// Async thunk to fetch ticket details
export const fetchTicketDetails = createAsyncThunk(
    'ticketDetails/fetchTicketDetails',
    async (ticketId: string, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get(`tickets/get-ticket-details?ticketId=${ticketId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Create the ticket details slice
const ticketDetailsSlice = createSlice({
    name: 'ticketDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTicketDetails.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTicketDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.ticketDetails = action.payload;
            })
            .addCase(fetchTicketDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// Export reducer
export const { reducer: ticketDetailsReducer } = ticketDetailsSlice;
