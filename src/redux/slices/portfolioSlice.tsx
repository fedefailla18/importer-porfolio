// src/redux/slices/portfolioSlice.ts
import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HoldingDto, PortfolioDistribution } from "../types/types";
import api from "../utils/api";

interface PortfolioState {
  data: PortfolioDistribution | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PortfolioState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetchPortfolio",
  async (portfolioName: string, { rejectWithValue }) => {
    try {
      const response = await api.get<PortfolioDistribution>(
        `/portfolio/${portfolioName}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchPortfolioHoldingDistribution = createAsyncThunk(
  "portfolio/fetchPortfolioHoldingDistribution",
  async (portfolioName: string, { rejectWithValue }) => {
    try {
      const response = await api.get<PortfolioDistribution>(
        `/portfolio/${portfolioName}/distribution`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Async thunk to add multiple holdings
export const addMultipleHoldings = createAsyncThunk(
  "holdingDetails/addMultipleHoldings",
  async (holdings: HoldingDto[]) => {
    const response = await api.post<HoldingDto[]>(`/holding/addMultiple`, {
      holdings,
    });
    return response.data;
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchPortfolio.fulfilled,
        (state, action: PayloadAction<PortfolioDistribution>) => {
          state.status = "succeeded";
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })
      .addCase(fetchPortfolioHoldingDistribution.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchPortfolioHoldingDistribution.fulfilled,
        (state, action: PayloadAction<PortfolioDistribution>) => {
          state.status = "succeeded";
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchPortfolioHoldingDistribution.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })

      .addCase(addMultipleHoldings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        addMultipleHoldings.fulfilled,
        (state, action: PayloadAction<HoldingDto[]>) => {
          if (state?.data) {
            state.data.holdings = [...state.data.holdings, ...action.payload];
          }
        }
      )
      .addCase(addMultipleHoldings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default portfolioSlice.reducer;
