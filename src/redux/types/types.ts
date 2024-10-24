// src/redux/types/types.ts
export interface HoldingDto {
  symbol: string;
  portfolioName: string;
  amount: number;
  amountInBtc: number;
  priceInBtc?: number;
  amountInUsdt: number;
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
  id?: string;
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
  portfolioName: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface TransactionState {
  transactions: Transaction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
