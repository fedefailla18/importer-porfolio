// src/redux/slices/holdingDetailsSlice.ts
import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HoldingDto } from "../types/types";
import axios from "axios";

interface HoldingDetailsState {
  holdingDetails: HoldingDto | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: HoldingDetailsState = {
  holdingDetails: null,
  status: "idle",
  error: null,
};

export const fetchHoldingDetails = createAsyncThunk(
  "holdingDetails/fetchHoldingDetails",
  async (
    { portfolioName, symbol }: { portfolioName: string; symbol: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get<HoldingDto>(
        `http://localhost:8080/portfolio/${portfolioName}/holding/${symbol}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

const holdingDetailsSlice = createSlice({
  name: "holdingDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoldingDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchHoldingDetails.fulfilled,
        (state, action: PayloadAction<HoldingDto>) => {
          state.status = "succeeded";
          state.holdingDetails = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchHoldingDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default holdingDetailsSlice.reducer;
