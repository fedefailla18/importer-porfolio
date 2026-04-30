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
  unrealizedProfitUsdt?: number;
}

export interface PortfolioDistribution {
  portfolioName: string;
  exchangeName?: ExchangeName | null;
  totalUsdt: number;
  totalBuySpentUsdt?: number;
  totalSellEarnedUsdt?: number;
  netCapitalFromPocket?: number;
  totalRealizedProfitUsdt?: number;
  totalUnrealizedProfitUsdt?: number;
  totalHoldings: number; // computed by FE slice from holdings.length
  holdings: HoldingDto[];
}

export interface PortfolioSummary {
  name: string;
  totalInUsdt: number;
  topHoldings: HoldingDto[];
}

export interface PortfolioState {
  loading?: boolean;
  data?: PortfolioDistribution | null;
  error: string | null;
  status: string;
  portfolios: PortfolioSummary[];
}

export interface HoldingDetailsState {
  holdingDetails?: HoldingDto | null;
  loading?: boolean;
  error: string | null;
  status: string;
}

export interface Transaction {
  id?: number;
  dateUtc: string;
  side?: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW' | string;
  pair: string;
  price?: number;
  executed?: number;
  symbol?: string;
  paidWith?: string;
  paidAmount?: number;
  processed?: boolean;
  lastProcessedAt?: string;
  fee?: string;
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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface Portfolio {
  id: string;
  name: string;
  exchangeName?: ExchangeName | null;
  creationDate: string | null;
  created: string | null;
  createdBy: string | null;
}

export type ExchangeName = 'BINANCE' | 'MEXC';

export interface ExchangeConfigRequest {
  exchangeName: ExchangeName;
  apiKey: string;
  apiSecret: string;
}

export interface ExchangeConfig {
  exchangeName: ExchangeName;
  apiKey: string;
  lastSyncTimestamp: number | null;
}

export interface ExchangeConfigState {
  configs: ExchangeConfig[];
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  saveStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  syncStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fullSyncStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface BinanceAssetBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export interface BinanceSpotActivitySummary {
  activeAssetCount: number;
  candidatePairCount: number;
  symbolCountWithTrades: number;
  totalTradeCount: number;
  buyTradeCount: number;
  sellTradeCount: number;
  grossBuyQuoteQty: number;
  grossSellQuoteQty: number;
  fetchedAt: number;
  lastSyncTimestamp: number | null;
}

export interface BinanceSpotTradeRow {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  side: 'BUY' | 'SELL';
  tradeId: number;
  orderId: number;
  orderListId: number;
  price: number;
  qty: number;
  quoteQty: number;
  commission: number;
  commissionAsset: string;
  time: number;
  buyer: boolean;
  maker: boolean;
  bestMatch: boolean;
}

export interface BinanceSpotActivityResponse {
  summary: BinanceSpotActivitySummary;
  balances: BinanceAssetBalance[];
  trades: BinanceSpotTradeRow[];
}

export interface BinanceSpotActivityState {
  data: BinanceSpotActivityResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface MexcAssetBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export interface MexcSpotActivitySummary {
  activeAssetCount: number;
  candidatePairCount: number;
  symbolCountWithTrades: number;
  totalTradeCount: number;
  buyTradeCount: number;
  sellTradeCount: number;
  grossBuyQuoteQty: number;
  grossSellQuoteQty: number;
  fetchedAt: number;
  lastSyncTimestamp: number | null;
}

export interface MexcSpotTradeRow {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  side: 'BUY' | 'SELL';
  tradeId: number;
  orderId: number;
  price: number;
  qty: number;
  quoteQty: number;
  commission: number;
  commissionAsset: string;
  time: number;
  buyer: boolean;
  maker: boolean;
}

export interface MexcSpotActivityResponse {
  summary: MexcSpotActivitySummary;
  balances: MexcAssetBalance[];
  trades: MexcSpotTradeRow[];
}

export interface MexcSpotActivityState {
  data: MexcSpotActivityResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
