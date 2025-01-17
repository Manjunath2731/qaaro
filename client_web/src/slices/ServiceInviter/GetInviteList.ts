// src/slices/invitationSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface Invitation {
    _id: string;
    email: string;
    invitationDate: string;
    registrationDate: string;
    status: string;
    role: string;
}

interface InvitationsState {
    invitations: Invitation[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: InvitationsState = {
    invitations: [],
    status: 'idle',
    error: null,
};

export const fetchInvitations = createAsyncThunk<Invitation[]>(
    'invitations/fetchInvitations',
    async () => {
        const response = await axiosAPIInstanceProject.get('get-invitation');
        return response.data.data.invitelist.map((invite: any) => ({
            _id: invite._id,
            email: invite.email,
            invitationDate: invite.invitationDate,
            registrationDate: invite.registrationDate,
            status: invite.status,
            role: invite.role,
        }));
    }
);

const invitationsSlice = createSlice({
    name: 'invitations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvitations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchInvitations.fulfilled, (state, action: PayloadAction<Invitation[]>) => {
                state.status = 'succeeded';
                state.invitations = action.payload;
            })
            .addCase(fetchInvitations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch invitations';
            });
    },
});

export const invitationsReducer = invitationsSlice.reducer;
export const invitationsActions = invitationsSlice.actions;
export default invitationsSlice;
