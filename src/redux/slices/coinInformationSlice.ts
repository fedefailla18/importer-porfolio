// src/redux/slices/coinInformationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import api from '../utils/api';

interface CoinInformationResponse {
  coinName: string;
  currentPrice: number;
}

interface PortfolioProcessingResult {
  coinInformation: CoinInformationResponse[];
  processedCount: number;
  totalTransactions: number;
}

interface CoinInformationState {
  data: CoinInformationResponse[];
  processedCount: number | null;
  totalTransactions: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CoinInformationState = {
  data: [],
  processedCount: null,
  totalTransactions: null,
  status: 'idle',
  error: null,
};

export const fetchCoinInformation = createAsyncThunk(
  'coinInformation/fetchCoinInformation',
  async (portfolio: string, { rejectWithValue }) => {
    try {
      const response = await api.post<PortfolioProcessingResult>(
        `/transaction/information/all/${portfolio}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const coinInformationSlice = createSlice({
  name: 'coinInformation',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCoinInformation.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchCoinInformation.fulfilled,
        (state, action: PayloadAction<PortfolioProcessingResult>) => {
          state.status = 'succeeded';
          state.data = action.payload.coinInformation;
          state.processedCount = action.payload.processedCount;
          state.totalTransactions = action.payload.totalTransactions;
          state.error = null;
        }
      )
      .addCase(fetchCoinInformation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const coinInformationReducer = coinInformationSlice.reducer;
export default coinInformationReducer;
