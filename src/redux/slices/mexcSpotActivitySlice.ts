import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { MexcSpotActivityResponse, MexcSpotActivityState } from '../types/types';
import api from '../utils/api';

export const fetchMexcSpotActivity = createAsyncThunk(
  'mexcSpotActivity/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<MexcSpotActivityResponse>('/api/exchange/mexc/spot-activity');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Failed to fetch fresh MexC spot activity'
      );
    }
  }
);

const initialState: MexcSpotActivityState = {
  data: null,
  status: 'idle',
  error: null,
};

const mexcSpotActivitySlice = createSlice({
  name: 'mexcSpotActivity',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMexcSpotActivity.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMexcSpotActivity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchMexcSpotActivity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const mexcSpotActivityReducer = mexcSpotActivitySlice.reducer;
export default mexcSpotActivityReducer;
