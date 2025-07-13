import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PortfolioDistribution, HoldingDto } from "../types/types";

const API_BASE_URL = "http://localhost:8080";


export const fetchHoldingDetails = createAsyncThunk<
  HoldingDto,
  { portfolioName: string; symbol: string }
>(
  "portfolio/fetchHoldingDetails",
  async ({ portfolioName, symbol }, { rejectWithValue }) => {
    try {
      const response = await axios.get<HoldingDto>(
        `${API_BASE_URL}/portfolio/${portfolioName}/${symbol}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
