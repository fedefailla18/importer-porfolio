// src/redux/types/types.ts
export interface HoldingDto {
  symbol: string;
  portfolioName: string;
  amount: number;
  amountInBtc?: number;
  priceInBtc?: number;
  amountInUsdt?: number;
  priceInUsdt?: number;
  percentage?: number;
  totalAmountBought?: number;
  totalAmountSold?: number;
  stableTotalCost?: number;
  currentPositionInUsdt?: number;
  totalRealizedProfitUsdt?: number;
}

export interface PortfolioDistribution {
  portfolioName: string;
  totalUsdt: number;
  totalHoldings: number;
  holdings: HoldingDto[];
}

export interface PortfolioState {
  loading?: boolean;
  data?: PortfolioDistribution | null;
  error: string | null;
  status: string;
}

export interface HoldingDetailsState {
  holdingDetails?: HoldingDto | null;
  loading?: boolean;
  error: string | null;
  status: string;
}

export interface Transaction {
  totalPages: number;
  number: number;
  id: string;
  dateUtc: string;
  side?: "BUY" | "SELL";
  pair: string;
  price?: number;
  executed?: number;
  symbol?: string;
  paidWith?: string;
  paidAmount?: number;
  feeAmount?: number;
  feeSymbol?: string;
}
