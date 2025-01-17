import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Avatar {
    publicId: string;
    url: string;
    _id: string;
}

interface Company {
    _id: string;
    companyName: string;
}

interface LamiAdmin {
    _id: string;
    name: string;
}

interface ClientAdmin {
    _id: string;
    name: string;
}

interface DepoAdmin {
    _id: string;
    name: string;
}

interface Courier {
    _id: string;
    name: string;
    email: string;
    mobile: number;
    address: string;
    role: string;
    company: Company;
    status: string;
    language: string;
    designation: string;
    zipcode: number;
    state: string;
    country: string;
    avatar: Avatar;
    lamiAdminId: LamiAdmin;
    createdAt: string;
    updatedAt: string;
    __v: number;
    clientAdminId: ClientAdmin;
    depoAdminId: DepoAdmin;
    plugoAdminId: {
        _id: string;
        name: string;
    };
}

interface GetCourierState {
    data: Courier[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: GetCourierState = {
    data: [],
    status: 'idle',
    error: null,
};

// Async thunk for fetching courier data
export const fetchGetCouriers = createAsyncThunk(
    'getCouriers/fetchGetCouriers',
    async (params: { clientId?: string; depoAdminId?: string; lamiId?: string }) => {
        const { clientId, depoAdminId, lamiId } = params;

        // Construct query string with dynamic parameters
        const queryParams = new URLSearchParams();
        if (clientId) queryParams.append('clientId', clientId);
        if (depoAdminId) queryParams.append('depoAdminId', depoAdminId);
        if (lamiId) queryParams.append('lamiId', lamiId);

        const response = await axiosAPIInstanceProject.get(
            `/get-courier?${queryParams.toString()}`
        );

        return response.data.data as Courier[];
    }
);

// Slice
const getCourierSlice = createSlice({
    name: 'getCouriers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetCouriers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchGetCouriers.fulfilled, (state, action: PayloadAction<Courier[]>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchGetCouriers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch couriers';
            });
    },
});

export const getCourierReducer = getCourierSlice.reducer;
