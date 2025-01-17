import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the courier details
interface CourierDetails {
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
    description: string;
    returnDescCouri: string;
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
}

// Define the state interface
interface CourierDetailsState {
    courierDetails: CourierDetails | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: CourierDetailsState = {
    courierDetails: null,
    status: 'idle',
    error: null,
};

// Async thunk to fetch courier details
export const fetchCourierDetails = createAsyncThunk(
    'courierDetails/fetchCourierDetails',
    async (ticketId: string, { rejectWithValue }) => {
        try {
            const response = await axiosAPIInstanceProject.get(`get-courier-details?ticketId=${ticketId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Create the courier details slice
const courierDetailsSlice = createSlice({
    name: 'courierDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourierDetails.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCourierDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.courierDetails = action.payload;
            })
            .addCase(fetchCourierDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// Export reducer
export const { reducer: courierDetailsReducer } = courierDetailsSlice;
