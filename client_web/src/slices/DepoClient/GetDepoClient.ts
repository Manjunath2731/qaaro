import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// Define the interface for the avatar
interface Avatar {
    publicId: string;
    url: string;
    _id: string;
}

// Define the interface for Depo Admin data
interface DepoAdmin {
    _id: string;
    name: string;
    email: string;
    mobile: number;
    address: string;
    role: string;
    company: {
        companyName: string;
    }
    status: string;
    language: string;
    designation: string;
    zipcode: number;
    state: string;
    country: string;
    avatar: Avatar;
    plugoAdminId: string;
    clientAdminId: {
        _id: string,
        name: string
    }
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// Define the response structure
export interface DepoAdminResponse {
    status: boolean;
    data: DepoAdmin[];
    message: string;
}

// Define the state interface
interface DepoAdminState {
    depoAdmins: DepoAdmin[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: DepoAdminState = {
    depoAdmins: [],
    loading: false,
    error: null,
};

// Async thunk for fetching depo admin data
export const fetchDepoAdmin = createAsyncThunk<DepoAdminResponse, { clientId?: string }, { rejectValue: string }>(
    'depoAdmin/fetchDepoAdmin',
    async ({ clientId }, { rejectWithValue }) => {
        try {
            const url = clientId ? `/get_depo_admin?clientId=${clientId}` : '/get_depo_admin';
            const response = await axiosAPIInstanceProject.get(url);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch depo admin data');
        }
    }
);


// Slice
const depoAdminSlice = createSlice({
    name: 'depoAdmin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepoAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepoAdmin.fulfilled, (state, action: PayloadAction<DepoAdminResponse>) => {
                state.depoAdmins = action.payload.data;
                state.loading = false;
            })
            .addCase(fetchDepoAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
            });
    },
});

// Export the reducer with a specific name
export const { reducer: depoAdminReducer } = depoAdminSlice;
