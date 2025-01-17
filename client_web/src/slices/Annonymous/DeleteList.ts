import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

interface DeleteAnonymousTicketsState {
  deleting: boolean;
  error: string | null;
}

const initialState: DeleteAnonymousTicketsState = {
  deleting: false,
  error: null,
};

export const deleteAnonymousTicket = createAsyncThunk(
  'anonymousTickets/delete',
  async (anonymousId: string) => {
    await axiosAPIInstanceProject.delete(`/tickets/delete-annonymous-ticket?annonymousId=${anonymousId}`);
    return anonymousId;
  }
);

const deleteAnonymousTicketsSlice = createSlice({
  name: 'deleteAnonymousTickets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteAnonymousTicket.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAnonymousTicket.fulfilled, (state) => {
        state.deleting = false;
        state.error = null;
      })
      .addCase(deleteAnonymousTicket.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.error.message || 'Failed to delete the ticket';
      });
  },
});

export const { reducer: deleteAnonymousTicketsReducer } = deleteAnonymousTicketsSlice;
