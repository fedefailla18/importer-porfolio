// src/redux/slices/transactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { stat } from "fs";

export interface Transaction {
  id: string;
  dateUtc: string;
  side?: "BUY" | "SELL";
  pair: string;
  price?: number;
  executed?: number;
  symbol?: string;
  paidWith?: string;
  paidAmount?: number;
  feeAmount?: number;
  feeSymbol?: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

interface TransactionState {
  transactions: Transaction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: TransactionState = {
  transactions: [],
  status: "idle",
  error: null,
  totalPages: 0,
  currentPage: 0,
};

interface FetchTransactionsParams {
  portfolioName?: string;
  symbol?: string;
  page: number;
  size: number;
  startDate?: string;
  endDate?: string;
  limit: number;
}
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (params: FetchTransactionsParams, { rejectWithValue }) => {
    try {
      let url = `http://localhost:8080/transaction/filter?page=${params.page}&size=${params.size}`;
      if (params.portfolioName) url += `&portfolioName=${params.portfolioName}`;
      if (params.symbol) url += `&symbol=${params.symbol}`;
      if (params.startDate) url += `&startDate=${params.startDate}`;
      if (params.endDate) url += `&endDate=${params.endDate}`;
      params.limit ? (url += `&limit=${params.limit}`) : (url += `&limit=1`);

      const response = await axios.get<PaginatedResponse<Transaction>>(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchTransactionsByPortfolioName = createAsyncThunk(
  "transactions/fetchTransactions",
  async (portfolioName: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Transaction[]>(
        `http://localhost:8080/transaction/${portfolioName}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchTransactionsBySymbol = createAsyncThunk(
  "transactions/fetchTransactions",
  async (symbolName: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Transaction[]>(
        `http://localhost:8080/transaction/filter?symbol=${symbolName}`
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
      const response = await axios.post<Transaction>(
        "http://localhost:8080/transaction",
        transaction
      );
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
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.number;
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

export default transactionSlice.reducer;
