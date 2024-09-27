// src/redux/reducers/portfolioReducer.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PortfolioState, PortfolioDistribution } from "../types/types";
import {
  fetchPortfolio,
  fetchPortfolioHoldingDistribution,
} from "../actions/portfolioActions";

const initialState: any = {
  loading: false,
  data: null,
  error: null,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPortfolio.fulfilled,
        (state, action: PayloadAction<PortfolioDistribution>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      .addCase(fetchPortfolioHoldingDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPortfolioHoldingDistribution.fulfilled,
        (state, action: PayloadAction<PortfolioDistribution>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchPortfolioHoldingDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default portfolioSlice.reducer;
