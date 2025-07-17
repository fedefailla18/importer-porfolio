// src/redux/slices/portfolioSlice.ts
import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HoldingDto, PortfolioDistribution } from "../types/types";
import api from "../utils/api";

interface PortfolioState {
  data: PortfolioDistribution | null;
  portfolios: PortfolioSummary[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface PortfolioSummary {
  name: string;
  totalInUsdt: number;
  topHoldings: HoldingDto[];
}

const initialState: PortfolioState = {
  data: null,
  portfolios: [],
  status: "idle",
  error: null,
};

// Async thunks
export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetchPortfolio",
  async (portfolioName: string, { rejectWithValue }) => {
    try {
      const response = await api.get<PortfolioDistribution>(
        `/portfolio?name=${portfolioName}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchAllPortfolios = createAsyncThunk(
  "portfolio/fetchAllPortfolios",
  async (_, { rejectWithValue }) => {
    try {
      // Try the names endpoint first, fallback to hardcoded list if not available
      try {
        const response = await api.get<string[]>(`/portfolio/names`);
        return response.data;
      } catch (namesError) {
        // If /portfolio/names doesn't exist, return a default list
        console.warn("Portfolio names endpoint not available, using default list");
        return ["Binance", "MexC", "Buenbit"];
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch portfolios");
    }
  }
);

export const fetchPortfolioHoldingDistribution = createAsyncThunk(
  "portfolio/fetchPortfolioHoldingDistribution",
  async (portfolioName: string, { rejectWithValue }) => {
    try {
      const response = await api.post<PortfolioDistribution>(
        `/portfolio/distribution?portfolioName=${portfolioName}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchPortfolioDetails = createAsyncThunk(
  "portfolio/fetchPortfolioDetails",
  async (portfolioName: string, { rejectWithValue }) => {
    try {
      const response = await api.get<PortfolioDistribution>(
        `/portfolio?name=${portfolioName}`
      );
      return {
        name: portfolioName,
        totalInUsdt: response.data.totalInUsdt,
        topHoldings: response.data.holdings.slice(0, 5)
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch portfolio details");
    }
  }
);

export const addMultipleHoldings = createAsyncThunk(
  "portfolio/addMultipleHoldings",
  async (holdings: HoldingDto[]) => {
    const response = await api.post<HoldingDto[]>(`/holding/addMultiple`, {
      holdings,
    });
    return response.data;
  }
);

export const createPortfolio = createAsyncThunk(
  "portfolio/createPortfolio",
  async (portfolioName: string) => {
    const response = await
      api.post<PortfolioDistribution>(`/portfolio?portfolioName=${portfolioName}`);
    return response.data;
  }
);

export const uploadTransactions = createAsyncThunk(
  "portfolio/uploadTransactions",
  async ({ file, portfolioName, symbols }: { file: File; portfolioName?: string; symbols?: string[] }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      if (symbols && symbols.length > 0) {
        symbols.forEach(symbol => formData.append("symbols", symbol));
      }

      const endpoint = `/transaction/upload/${portfolioName}`;

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to upload transactions");
    }
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    clearPortfolioData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchPortfolio.fulfilled,
        (state, action: PayloadAction<PortfolioDistribution>) => {
          state.status = "succeeded";
          // Calculate totalHoldings from holdings array length
          const portfolioData = {
            ...action.payload,
            totalHoldings: action.payload.holdings?.length || 0
          };
          state.data = portfolioData;
          state.error = null;
        }
      )
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })

      // Fetch All Portfolios
      .addCase(fetchAllPortfolios.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllPortfolios.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.status = "succeeded";
          // Convert portfolio names to summary objects
          state.portfolios = action.payload.map(name => ({
            name,
            totalInUsdt: 0, // Will be updated when we fetch individual portfolios
            topHoldings: []
          }));
          state.error = null;
        }
      )
      .addCase(fetchAllPortfolios.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch portfolios";
      })

      // Fetch Portfolio Distribution
      .addCase(fetchPortfolioHoldingDistribution.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchPortfolioHoldingDistribution.fulfilled,
        (state, action: PayloadAction<PortfolioDistribution>) => {
          state.status = "succeeded";
          // Calculate totalHoldings from holdings array length
          const portfolioData = {
            ...action.payload,
            totalHoldings: action.payload.holdings?.length || 0
          };
          state.data = portfolioData;
          state.error = null;
        }
      )
      .addCase(fetchPortfolioHoldingDistribution.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })

      // Add Multiple Holdings
      .addCase(addMultipleHoldings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        addMultipleHoldings.fulfilled,
        (state, action: PayloadAction<HoldingDto[]>) => {
          if (state?.data) {
            state.data.holdings = [...state.data.holdings, ...action.payload];
            // Recalculate totalHoldings
            state.data.totalHoldings = state.data.holdings.length;
          }
        }
      )
      .addCase(addMultipleHoldings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })

      // Upload Transactions
      .addCase(uploadTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadTransactions.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(uploadTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to upload transactions";
      })

      // Fetch Portfolio Details
      .addCase(fetchPortfolioDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchPortfolioDetails.fulfilled,
        (state, action: PayloadAction<PortfolioSummary>) => {
          state.status = "succeeded";
          // Update the specific portfolio in the list
          const index = state.portfolios.findIndex(p => p.name === action.payload.name);
          if (index !== -1) {
            state.portfolios[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(fetchPortfolioDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch portfolio details";
      });
  },
});

export const { clearPortfolioData } = portfolioSlice.actions;
export default portfolioSlice.reducer;
