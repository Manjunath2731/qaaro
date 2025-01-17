// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';

// interface UpdateCourierPayload {
//   name: string;
//   mobile: number;
//   address: string;
//   status: string;
//   designation: string;
// }

// interface UpdateCourierState {
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: UpdateCourierState = {
//   status: 'idle',
//   error: null,
// };

// // Thunk to update a courier
// export const updateLamiCourier = createAsyncThunk(
//   'courier/updateLamiCourier',
//   async ({ lamiCourierId, payload }: { lamiCourierId: string; payload: UpdateCourierPayload }, { rejectWithValue }) => {
//     try {
//       const response = await axiosAPIInstanceProject.put(`update-lami-courier?lamiCourierid=${lamiCourierId}`, payload);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error occurred while creating Admin:", error);

//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Create slice
// const updateCourierSlice = createSlice({
//   name: 'courierUpdate',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(updateLamiCourier.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(updateLamiCourier.fulfilled, (state) => {
//         state.status = 'succeeded';
//         state.error = null;
//       })
//       .addCase(updateLamiCourier.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = (action.payload as { message: string } | undefined)?.message || 'An error occurred while creating Admin';
//       });
//   },
// });

// export const { reducer: updateCourierReducer } = updateCourierSlice;
