import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { BinanceSpotActivityResponse, BinanceSpotActivityState } from '../types/types';
import api from '../utils/api';

export const fetchBinanceSpotActivity = createAsyncThunk(
  'binanceSpotActivity/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BinanceSpotActivityResponse>(
        '/api/exchange/binance/spot-activity'
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Failed to fetch fresh Binance spot activity'
      );
    }
  }
);

const initialState: BinanceSpotActivityState = {
  data: null,
  status: 'idle',
  error: null,
};

const binanceSpotActivitySlice = createSlice({
  name: 'binanceSpotActivity',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBinanceSpotActivity.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBinanceSpotActivity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchBinanceSpotActivity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const binanceSpotActivityReducer = binanceSpotActivitySlice.reducer;
export default binanceSpotActivityReducer;
