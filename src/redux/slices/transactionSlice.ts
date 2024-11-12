// src/redux/slices/transactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../utils/api";
import {
  Transaction,
  PaginatedResponse,
  TransactionState,
} from "../types/types";

export interface FetchTransactionsParams {
  symbol?: string;
  startDate?: string;
  endDate?: string;
  portfolioName?: string;
  side?: string;
  paidWith?: string;
  paidAmountOperator?: string;
  paidAmount?: string;
  page: number;
  size: number;
  sort?: string;
}

const initialState: TransactionState = {
  transactions: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (params: FetchTransactionsParams, { rejectWithValue }) => {
    try {
      const response = await api.get<PaginatedResponse<Transaction>>(
        `/transaction/filter`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction: Omit<Transaction, "id">, { rejectWithValue }) => {
    try {
      const response = await api.post<Transaction>("/transaction", transaction);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Transaction>>) => {
          state.status = "succeeded";
          state.transactions = action.payload.content;
          state.pagination = {
            currentPage: action.payload.number,
            totalPages: action.payload.totalPages,
            totalItems: action.payload.totalElements,
            itemsPerPage: action.payload.size,
          };
          state.error = null;
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })
      .addCase(addTransaction.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        addTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.status = "succeeded";
          state.transactions.push(action.payload);
          state.error = null;
        }
      )
      .addCase(addTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const transactionReducer = transactionSlice.reducer;
export default transactionReducer;
