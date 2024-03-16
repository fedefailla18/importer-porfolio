// src/redux/reducers/portfolioReducer.ts
import { PortfolioActionTypes, PortfolioDistribution } from "../types/types";
import {
  FETCH_PORTFOLIO_REQUEST,
  FETCH_PORTFOLIO_SUCCESS,
  FETCH_PORTFOLIO_FAILURE,
  fetchPortfolio,
} from "../actions/portfolioActions";
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

const portfolioSlice1 = createSlice({
  name: "portfolioFetch",
  initialState,
  reducers: {
    request: (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    success: (state) => {
      return {
        ...state,
        loading: false,
        error: null,
      };
    },
  },
});

// export const { request, success } = portfolioSlice.actions;
// export const selectAllPortfolio = (state: PortfolioState) => state.data;
// export const selectPortfolioById = (state: PortfolioState) =>//   state.data?.portfolioName;
// export const selectHoldings = (state: PortfolioState) => state.data?.holdings;

const portfolioReducer = (
  state = initialState,
  action: PortfolioActionTypes
): PortfolioState => {
  switch (action.type) {
    case FETCH_PORTFOLIO_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PORTFOLIO_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_PORTFOLIO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

// export default portfolioReducer;

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
