import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  IolAccountStatement,
  IolOperation,
  IolPortfolio,
  IolProfile,
  IolState,
} from '../types/types';
import api from '../utils/api';

export const fetchIolProfile = createAsyncThunk(
  'iol/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<IolProfile>('/api/integration/iol/profile');
      return res.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || e.response?.data || 'Failed to load IOL profile'
      );
    }
  }
);

export const fetchIolAccountStatement = createAsyncThunk(
  'iol/fetchAccountStatement',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<IolAccountStatement>('/api/integration/iol/account-statement');
      return res.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || e.response?.data || 'Failed to load account statement'
      );
    }
  }
);

export const fetchIolPortfolio = createAsyncThunk(
  'iol/fetchPortfolio',
  async (country: 'argentina' | 'estados_unidos', { rejectWithValue }) => {
    try {
      const res = await api.get<IolPortfolio>(`/api/integration/iol/portfolio/${country}`);
      return { country, data: res.data };
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || e.response?.data || `Failed to load ${country} portfolio`
      );
    }
  }
);

export const fetchIolOperations = createAsyncThunk(
  'iol/fetchOperations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<IolOperation[]>('/api/integration/iol/operations');
      return res.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || e.response?.data || 'Failed to load operations'
      );
    }
  }
);

export const fetchIolOperationDetails = createAsyncThunk(
  'iol/fetchOperationDetails',
  async (number: number, { rejectWithValue }) => {
    try {
      const res = await api.get<IolOperation>(`/api/integration/iol/operations/${number}`);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || e.response?.data || 'Failed to load operation details'
      );
    }
  }
);

const initialState: IolState = {
  profile: null,
  profileStatus: 'idle',
  accountStatement: null,
  accountStatementStatus: 'idle',
  portfolioAr: null,
  portfolioArStatus: 'idle',
  portfolioUs: null,
  portfolioUsStatus: 'idle',
  operations: [],
  operationsStatus: 'idle',
  selectedOperation: null,
  selectedOperationStatus: 'idle',
  error: null,
};

const iolSlice = createSlice({
  name: 'iol',
  initialState,
  reducers: {
    clearSelectedOperation(state) {
      state.selectedOperation = null;
      state.selectedOperationStatus = 'idle';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchIolProfile.pending, state => {
        state.profileStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchIolProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchIolProfile.rejected, (state, action) => {
        state.profileStatus = 'failed';
        state.error = action.payload as string;
      })

      .addCase(fetchIolAccountStatement.pending, state => {
        state.accountStatementStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchIolAccountStatement.fulfilled, (state, action) => {
        state.accountStatementStatus = 'succeeded';
        state.accountStatement = action.payload;
      })
      .addCase(fetchIolAccountStatement.rejected, (state, action) => {
        state.accountStatementStatus = 'failed';
        state.error = action.payload as string;
      })

      .addCase(fetchIolPortfolio.pending, (state, action) => {
        if (action.meta.arg === 'argentina') {
          state.portfolioArStatus = 'loading';
        } else {
          state.portfolioUsStatus = 'loading';
        }
        state.error = null;
      })
      .addCase(fetchIolPortfolio.fulfilled, (state, action) => {
        if (action.payload.country === 'argentina') {
          state.portfolioArStatus = 'succeeded';
          state.portfolioAr = action.payload.data;
        } else {
          state.portfolioUsStatus = 'succeeded';
          state.portfolioUs = action.payload.data;
        }
      })
      .addCase(fetchIolPortfolio.rejected, (state, action) => {
        if (action.meta.arg === 'argentina') {
          state.portfolioArStatus = 'failed';
        } else {
          state.portfolioUsStatus = 'failed';
        }
        state.error = action.payload as string;
      })

      .addCase(fetchIolOperations.pending, state => {
        state.operationsStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchIolOperations.fulfilled, (state, action) => {
        state.operationsStatus = 'succeeded';
        state.operations = action.payload;
      })
      .addCase(fetchIolOperations.rejected, (state, action) => {
        state.operationsStatus = 'failed';
        state.error = action.payload as string;
      })

      .addCase(fetchIolOperationDetails.pending, state => {
        state.selectedOperationStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchIolOperationDetails.fulfilled, (state, action) => {
        state.selectedOperationStatus = 'succeeded';
        state.selectedOperation = action.payload;
      })
      .addCase(fetchIolOperationDetails.rejected, (state, action) => {
        state.selectedOperationStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedOperation } = iolSlice.actions;
export const iolReducer = iolSlice.reducer;
export default iolReducer;
