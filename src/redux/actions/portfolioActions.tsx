import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PortfolioDistribution, HoldingDto } from "../types/types";

const API_BASE_URL = "http://localhost:8080";

export const fetchPortfolio = createAsyncThunk<PortfolioDistribution, string>(
  "portfolio/fetchPortfolio",
  async (portfolioName, { rejectWithValue }) => {
    try {
      const response = await axios.get<PortfolioDistribution>(
        `${API_BASE_URL}/portfolio`,
        {
          params: { name: portfolioName },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchPortfolioHoldingDistribution = createAsyncThunk<
  PortfolioDistribution,
  string
>(
  "portfolio/fetchPortfolioHoldingDistribution",
  async (portfolioName, { rejectWithValue }) => {
    try {
      const response = await axios.post<PortfolioDistribution>(
        `${API_BASE_URL}/portfolio/distribution`,
        null,
        { params: { portfolioName } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

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
