// src/redux/slices/coinInformationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/api';

interface CoinInformationResponse {
  symbol: string;
  currentPrice: number;
}

interface CoinInformationState {
  data: CoinInformationResponse[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CoinInformationState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchCoinInformation = createAsyncThunk(
  'coinInformation/fetchCoinInformation',
  async (portfolio: string, { rejectWithValue }) => {
    try {
      const response = await api.post<CoinInformationResponse[]>(
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
        (state, action: PayloadAction<CoinInformationResponse[]>) => {
          state.status = 'succeeded';
          state.data = action.payload;
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
