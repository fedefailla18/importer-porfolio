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
>("portfolio/fetchPortfolioHoldingDistribution", async (portfolioName) => {
  const response = await axios.get<PortfolioDistribution>(
    `${API_BASE_URL}/portfolio/${portfolioName}/distribution`
  );
  return response.data;
});

export const createPortfolio = createAsyncThunk<
  PortfolioDistribution,
  { portfolioName: string; file?: File }
>("portfolio/createPortfolio", async ({ portfolioName, file }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("portfolioName", portfolioName);
    
    if (file) {
      formData.append("file", file);
    }

    const response = await axios.post<PortfolioDistribution>(
      `${API_BASE_URL}/portfolio`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to create portfolio");
  }
});

export const fetchAllPortfolios = createAsyncThunk<string[]>(
  "portfolio/fetchAllPortfolios",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<string[]>(`${API_BASE_URL}/portfolio/names`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch portfolios");
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
