import axios from "axios";
import { PortfolioDistribution } from "../types/types"; // Import interface definitions
import { createAsyncThunk } from "@reduxjs/toolkit";

export const FETCH_PORTFOLIO_REQUEST = "FETCH_PORTFOLIO_REQUEST";
export const FETCH_PORTFOLIO_SUCCESS = "FETCH_PORTFOLIO_SUCCESS";
export const FETCH_PORTFOLIO_FAILURE = "FETCH_PORTFOLIO_FAILURE";
export const FETCH_PORTFOLIO_HOLDING_DISTRIBUTION_SUCCESS =
  "FETCH_PORTFOLIO_HOLDING_DISTRIBUTION_SUCCESS";

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetchPortfolio",
  async (portfolioName: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<PortfolioDistribution>(
        `http://localhost:8080/portfolio`,
        {
          params: {
            name: portfolioName,
          },
        }
      );
      fetchPortfolioSuccess(response.data);
      return response.data; // Return the fetched data as the action payload
    } catch (error) {
      // If an error occurs, dispatch a failure action with the error message
      return rejectWithValue(error);
    }
  }
);

export const fetchPortfolioHoldingDistribution = createAsyncThunk(
  "portfolio/fetchPortfolioHoldingDistribution",
  async (portfolioName: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<PortfolioDistribution>(
        `http://localhost:8080/portfolio/holding/distribution?name=${portfolioName}`
      );
      fetchPortfolioHoldingDistributionSuccess(response.data);
      return response.data; // Return the fetched data as the action payload
    } catch (error) {
      // If an error occurs, dispatch a failure action with the error message
      return rejectWithValue(error);
    }
  }
);

export const fetchPortfolioRequest = () => ({
  type: FETCH_PORTFOLIO_REQUEST,
});

export const fetchPortfolioSuccess = (data: PortfolioDistribution) => ({
  type: FETCH_PORTFOLIO_SUCCESS,
  payload: data,
});

export const fetchPortfolioHoldingDistributionSuccess = (
  data: PortfolioDistribution
) => ({
  type: FETCH_PORTFOLIO_SUCCESS,
  payload: data,
});

export const fetchPortfolioFailure = (error: string) => ({
  type: FETCH_PORTFOLIO_FAILURE,
  payload: error,
});
