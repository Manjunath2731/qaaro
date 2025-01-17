import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface FetchGraphDataResponse {
    status: boolean;
    data: {
        results: [string, { assigned: number; completed: number }][];
    };
    message: string;
}

export const fetchGraphData = createAsyncThunk(
    'graph/fetchGraphData',
    async (period: string) => {
        const response = await axiosAPIInstanceProject.get<FetchGraphDataResponse>(`graph-first?period=${period}`);
        return response.data;
    }
);

interface GraphState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    data: [string, { assigned: number; completed: number }][];
    error: string | null;
}

const initialState: GraphState = {
    status: 'idle',
    data: [],
    error: null
};

const graphSlice = createSlice({
    name: 'graph',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGraphData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchGraphData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data.results;
            })
            .addCase(fetchGraphData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'An error occurred';
            });
    }
});

export const { reducer: graphReducer } = graphSlice;
