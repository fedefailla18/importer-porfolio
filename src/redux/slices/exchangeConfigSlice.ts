// src/redux/slices/exchangeConfigSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { ExchangeConfig, ExchangeConfigRequest, ExchangeConfigState } from '../types/types';
import api from '../utils/api';

export const fetchExchangeConfigs = createAsyncThunk(
  'exchangeConfig/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ExchangeConfig[]>('/api/exchange/config');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch exchange configurations');
    }
  }
);

export const saveExchangeConfig = createAsyncThunk(
  'exchangeConfig/save',
  async (request: ExchangeConfigRequest, { rejectWithValue }) => {
    try {
      await api.post('/api/exchange/config', request);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to save exchange configuration');
    }
  }
);

export const syncBinance = createAsyncThunk(
  'exchangeConfig/syncBinance',
  async (portfolio: string, { rejectWithValue }) => {
    try {
      const response = await api.post<string>('/transaction/sync/binance', null, {
        params: { portfolio },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'Binance sync failed'
      );
    }
  }
);

export const syncMexc = createAsyncThunk(
  'exchangeConfig/syncMexc',
  async (portfolio: string, { rejectWithValue }) => {
    try {
      const response = await api.post<string>('/transaction/sync/mexc', null, {
        params: { portfolio },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'MexC sync failed'
      );
    }
  }
);

export interface SyncBinanceFullParams {
  portfolio: string;
  startDate?: number;
  endDate?: number;
}

export const syncBinanceFull = createAsyncThunk(
  'exchangeConfig/syncBinanceFull',
  async ({ portfolio, startDate, endDate }: SyncBinanceFullParams, { rejectWithValue }) => {
    try {
      const response = await api.post<string>('/transaction/sync/binance/full', null, {
        params: { portfolio, startDate, endDate },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'Binance full sync failed'
      );
    }
  }
);

export interface SyncMexcFullParams {
  portfolio: string;
  startDate?: number;
  endDate?: number;
}

export const syncMexcFull = createAsyncThunk(
  'exchangeConfig/syncMexcFull',
  async ({ portfolio, startDate, endDate }: SyncMexcFullParams, { rejectWithValue }) => {
    try {
      const response = await api.post<string>('/transaction/sync/mexc/full', null, {
        params: { portfolio, startDate, endDate },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'MexC full sync failed'
      );
    }
  }
);

const initialState: ExchangeConfigState = {
  configs: [],
  fetchStatus: 'idle',
  saveStatus: 'idle',
  syncStatus: 'idle',
  fullSyncStatus: 'idle',
  error: null,
};

const exchangeConfigSlice = createSlice({
  name: 'exchangeConfig',
  initialState,
  reducers: {
    resetSaveStatus(state) {
      state.saveStatus = 'idle';
      state.error = null;
    },
    resetSyncStatus(state) {
      state.syncStatus = 'idle';
      state.error = null;
    },
    resetFullSyncStatus(state) {
      state.fullSyncStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchExchangeConfigs.pending, state => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchExchangeConfigs.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.configs = action.payload;
      })
      .addCase(fetchExchangeConfigs.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(saveExchangeConfig.pending, state => {
        state.saveStatus = 'loading';
        state.error = null;
      })
      .addCase(saveExchangeConfig.fulfilled, state => {
        state.saveStatus = 'succeeded';
      })
      .addCase(saveExchangeConfig.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(syncBinance.pending, state => {
        state.syncStatus = 'loading';
        state.error = null;
      })
      .addCase(syncBinance.fulfilled, state => {
        state.syncStatus = 'succeeded';
      })
      .addCase(syncBinance.rejected, (state, action) => {
        state.syncStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(syncMexc.pending, state => {
        state.syncStatus = 'loading';
        state.error = null;
      })
      .addCase(syncMexc.fulfilled, state => {
        state.syncStatus = 'succeeded';
      })
      .addCase(syncMexc.rejected, (state, action) => {
        state.syncStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(syncBinanceFull.pending, state => {
        state.fullSyncStatus = 'loading';
        state.error = null;
      })
      .addCase(syncBinanceFull.fulfilled, state => {
        state.fullSyncStatus = 'succeeded';
      })
      .addCase(syncBinanceFull.rejected, (state, action) => {
        state.fullSyncStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(syncMexcFull.pending, state => {
        state.fullSyncStatus = 'loading';
        state.error = null;
      })
      .addCase(syncMexcFull.fulfilled, state => {
        state.fullSyncStatus = 'succeeded';
      })
      .addCase(syncMexcFull.rejected, (state, action) => {
        state.fullSyncStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetSaveStatus, resetSyncStatus, resetFullSyncStatus } =
  exchangeConfigSlice.actions;
export const exchangeConfigReducer = exchangeConfigSlice.reducer;
export default exchangeConfigReducer;
