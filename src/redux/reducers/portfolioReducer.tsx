// src/redux/reducers/portfolioReducer.ts
import { PortfolioDistribution } from "../types/types";
import { fetchPortfolio } from "../actions/portfolioActions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface PortfolioState {
  loading: boolean;
  data: PortfolioDistribution | null;
  error: string | null;
}

const initialState: PortfolioState = {
  loading: false,
  data: null,
  error: null,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    // Define additional reducers if needed
    fetchPortfolioSuccess(state, action: PayloadAction<any>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchPortfolioError(state, action: PayloadAction<string>) {
      state.data = null;
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { fetchPortfolioSuccess, fetchPortfolioError } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;
