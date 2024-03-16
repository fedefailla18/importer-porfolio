import {
  FETCH_PORTFOLIO_REQUEST,
  FETCH_PORTFOLIO_SUCCESS,
  FETCH_PORTFOLIO_FAILURE,
} from "../actions/portfolioActions";

export interface HoldingDto {
  symbol: string;
  portfolioName: string;
  amount: number;
  amountInBtc: number;
  priceInBtc: number;
  amountInUsdt: number;
  priceInUsdt: number;
  percentage: number;
}

export interface PortfolioDistribution {
  portfolioName: string;
  totalUsdt: number;
  totalHoldings: number;
  holdings: HoldingDto[];
}

export type PortfolioActionTypes =
  | { type: typeof FETCH_PORTFOLIO_REQUEST }
  | { type: typeof FETCH_PORTFOLIO_SUCCESS; payload: PortfolioDistribution }
  | { type: typeof FETCH_PORTFOLIO_FAILURE; payload: string };
