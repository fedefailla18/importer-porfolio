// src/redux/reducers/holdingDetailsReducer.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HoldingDetailsState, HoldingDto } from "../types/types";
import { fetchHoldingDetails } from "../actions/portfolioActions";

const initialState: HoldingDetailsState = {
  holdingDetails: null,
  loading: false,
  error: null,
  status: "",
};

const holdingDetailsSlice = createSlice({
  name: "holdingDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoldingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHoldingDetails.fulfilled,
        (state, action: PayloadAction<HoldingDto>) => {
          state.loading = false;
          state.holdingDetails = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchHoldingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default holdingDetailsSlice.reducer;
