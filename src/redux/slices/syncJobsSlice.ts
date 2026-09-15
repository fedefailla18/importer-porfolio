// src/redux/slices/syncJobsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { SyncJob, SyncJobsState } from '../types/types';
import api from '../utils/api';

export const fetchBinanceSyncJobs = createAsyncThunk(
  'syncJobs/fetchBinance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<SyncJob[]>('/transaction/sync/binance/jobs');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch sync jobs');
    }
  }
);

export const retryBinanceSyncJob = createAsyncThunk(
  'syncJobs/retryBinance',
  async (jobId: string, { rejectWithValue }) => {
    try {
      await api.post(`/transaction/sync/binance/jobs/${jobId}/retry`);
      return jobId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to retry sync job');
    }
  }
);

const initialState: SyncJobsState = {
  jobs: [],
  fetchStatus: 'idle',
  retryingJobIds: [],
  error: null,
};

const syncJobsSlice = createSlice({
  name: 'syncJobs',
  initialState,
  reducers: {
    resetSyncJobs(state) {
      state.jobs = [];
      state.fetchStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBinanceSyncJobs.pending, state => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchBinanceSyncJobs.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.jobs = action.payload;
      })
      .addCase(fetchBinanceSyncJobs.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(retryBinanceSyncJob.pending, (state, action) => {
        state.retryingJobIds.push(action.meta.arg);
      })
      .addCase(retryBinanceSyncJob.fulfilled, (state, action) => {
        state.retryingJobIds = state.retryingJobIds.filter(id => id !== action.payload);
        const job = state.jobs.find(j => j.id === action.payload);
        if (job) {
          job.status = 'PENDING';
          job.errorMessage = null;
        }
      })
      .addCase(retryBinanceSyncJob.rejected, (state, action) => {
        state.retryingJobIds = state.retryingJobIds.filter(id => id !== action.meta.arg);
        state.error = action.payload as string;
      });
  },
});

export const { resetSyncJobs } = syncJobsSlice.actions;
export const syncJobsReducer = syncJobsSlice.reducer;
export default syncJobsReducer;
