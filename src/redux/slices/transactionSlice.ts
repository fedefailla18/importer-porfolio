// src/redux/slices/transactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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

interface TransactionState {
  transactions: Transaction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  status: "idle",
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (portfolioName: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Transaction[]>(
        `http://localhost:8080/transactions/${portfolioName}`
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
        (state, action: PayloadAction<Transaction[]>) => {
          state.status = "succeeded";
          state.transactions = action.payload;
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
