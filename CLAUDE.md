# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:3000
npm run build      # Production build → build/
npm test           # Jest watch mode
npm test -- --testPathPattern=<file>  # Run single test file
```

Linting is enforced via ESLint (`react-app` + Prettier). Formatting: single quotes, 2-space indent, 100-char line width, trailing commas (ES5).

## Architecture

**Stack**: React 18 + Redux Toolkit + Material-UI 5 + TypeScript (strict), bootstrapped with Create React App.

**Backend**: Spring Boot at `http://localhost:9080` (see `src/redux/utils/api.ts` for the Axios instance). All API calls go through this single Axios instance which auto-attaches the `Authorization: Bearer <token>` header from localStorage and redirects to `/login` on 401.

**Routing** (`App.tsx`): Public routes (`/login`, `/register`) and protected routes wrapped in `<ProtectedRoute>`, which validates the JWT via Redux before rendering.

**State** (`src/redux/`):
- `slices/` — one slice per domain: `auth`, `portfolio`, `holdingDetails`, `transactions`, `coinInformation`, `exchangeConfig`
- `store/index.ts` — `configureStore` with combined reducer
- `reducers/reducer.ts` — `combineReducers` root
- `hooks.ts` — typed `useAppDispatch` / `useAppSelector` (always use these instead of raw hooks)
- `utils/api.ts` — the canonical Axios instance (interceptors for auth and 401 handling)
- `utils/auth.ts` — localStorage token helpers
- `types/types.ts` — all shared TypeScript interfaces

**Component tree** (`src/components/`):
- `auth/` — Login, Register, ProtectedRoute
- `layout/` — Layout (AppBar nav), Header
- `portfolio/` — landing page, detail page, create/upload dialog, custom hook `usePortfolioComponent`
- `holdings/` — list, detail, add-multiple form
- `transactions/` — list, filter, add form/drawer, pagination
- `exchange/` — ExchangeConfigPage (Binance API key management)
- `common/` — Pagination

**Auth flow**: Login dispatches `login()` thunk → stores JWT in localStorage → `isAuthenticated` true. On page reload `ProtectedRoute` dispatches `validateToken()`. A 401 response from any API call clears localStorage and redirects to `/login`.

## UI Patterns and Conventions

When a page shows entity stats (header cards, KPIs) followed by a long list/table, the list must scroll independently so the stats remain visible.

- Use a scrollable TableContainer with maxHeight ~60vh and overflow: auto.
- Use Table with stickyHeader and sticky header cells (position: sticky; top: 0; background using theme.palette.background.paper; higher z-index).
- Keep hover rows subtle and accessible; use rgba(0,0,0,0.04) or theme.action.hover.
- Example references:
  - Holdings list: src/components/holdings/HoldingListPage.tsx
  - Transactions list: src/components/transactions/TransactionList.tsx
- When creating new list views, mirror this pattern for consistency.

Other UI guidelines:
- Always use typed hooks (useAppDispatch/useAppSelector) instead of raw Redux hooks.
- Prefer MUI components and theme tokens rather than hard-coded colors.
- Currency/number formatting via Intl; centralize helpers when reused.

## Backend API Contract

The backend is the source of truth. Key endpoints (all require `Authorization: Bearer <jwt>`):

| Domain | Method | Path | Notes |
|--------|--------|------|-------|
| Auth | POST | `/api/auth/login` | Body: `{username, password}` → `{jwt}` |
| Auth | POST | `/api/auth/register` | Body: `{username, email, password}` |
| Auth | GET | `/api/user/current` | Returns authenticated principal |
| Portfolio | GET | `/portfolio/names` | → `string[]` |
| Portfolio | GET | `/portfolio?name=` | → `PortfolioDistribution` |
| Portfolio | POST | `/portfolio/distribution?portfolioName=` | → `PortfolioDistribution` |
| Portfolio | GET | `/portfolio/{portfolioName}/{symbol}` | → `HoldingDto` |
| Portfolio | POST | `/portfolio?portfolioName=` | Create portfolio |
| Holdings | POST | `/holding/addMultiple` | Body: `{holdings: AddHoldingRequest[]}` |
| Transactions | GET | `/transaction/filter` | Paginated, filterable |
| Transactions | POST | `/transaction` | Add single transaction |
| Transactions | POST | `/transaction/upload/{portfolio}` | Multipart file upload |
| Coin Info | POST | `/transaction/information/all/{portfolio}` | → `PortfolioProcessingResult` |
| Exchange | GET | `/api/exchange/config` | → `ExchangeConfig[]` |
| Exchange | POST | `/api/exchange/config` | Body: `{exchangeName, apiKey, apiSecret}` → `"Configuration saved successfully"` |
| Exchange | POST | `/transaction/sync/binance?portfolio=` | Incremental Binance sync → `"Sync initiated successfully"` |
| Exchange | POST | `/transaction/sync/mexc?portfolio=` | Incremental MexC sync → `"Sync initiated successfully"` |
| Exchange | POST | `/transaction/sync/binance/full?portfolio=&startDate=&endDate=` | Full historical sync (epoch ms, optional) → `"Full historical sync initiated successfully"` |
| Exchange | POST | `/transaction/sync/mexc/full?portfolio=&startDate=&endDate=` | Full historical MexC sync (epoch ms, optional) → `"Full historical MexC sync initiated successfully"` |
| Transactions | DELETE | `/transaction/{id}` | Delete single transaction (user-ownership verified) → 204 No Content |

**`PortfolioDistribution` shape** (BE canonical):
```text
{
  portfolioName: string;
  totalUsdt: BigDecimal;               // live portfolio market value
  totalBuySpentUsdt: BigDecimal;       // gross USDT across all BUY transactions
  totalSellEarnedUsdt: BigDecimal;     // gross USDT across all SELL transactions
  netCapitalFromPocket: BigDecimal;    // computed: totalBuySpentUsdt - totalSellEarnedUsdt
  totalRealizedProfitUsdt: BigDecimal; // computed: sum of holding.totalRealizedProfitUsdt
  totalUnrealizedProfitUsdt: BigDecimal; // computed: sum of holding.unrealizedProfitUsdt
  holdings: HoldingDto[]
}
```

**`HoldingDto` shape**:
```text
{
  symbol, portfolioName, amount, amountInBtc, amountInUsdt,
  priceInBtc, priceInUsdt, percentage,
  totalAmountBought, totalAmountSold,
  stableTotalCost,             // remaining cost basis of units still held
  currentPositionInUsdt,       // amount × current market price
  totalRealizedProfitUsdt,     // cumulative realized P&L from sells (AVCO method)
  unrealizedProfitUsdt         // currentPositionInUsdt − stableTotalCost (paper P&L)
}
```

**`Transaction` / `TransactionDto` field names** (BE canonical):
```text
{ id, dateUtc, side, pair, price, executed, symbol,
  paidWith, paidAmount,
  fee, feeAmount, feeSymbol, portfolioName,
  processed, lastProcessedAt }
```

**Login response** (BE canonical):
```text
JwtResponse { jwt: string }
// id, username, email, roles are null — do not rely on them
```

## Notes

**`ExchangeConfig` response shape** (from `GET /api/exchange/config`):
```text
{ exchangeName: 'BINANCE'; apiKey: string; lastSyncTimestamp: number | null }
```
`apiSecret` is never returned — only stored encrypted on the BE. On the FE, always POST a fresh secret when updating keys; pre-populate only the `apiKey` field.

**Binance sync flow (incremental)**: `POST /transaction/sync/binance?portfolio=<name>` — BE fetches account assets, maps relevant trading pairs, pulls all trades since `lastSyncTimestamp`, processes via `TransactionProcessor`. Returns a plain string. If the user has no Binance config saved, the BE throws `IllegalArgumentException` (maps to 500); FE checks `"not configured"` in the error message — toast accordingly and direct user to `/settings`.

**MexC sync flow (incremental)**: `POST /transaction/sync/mexc?portfolio=<name>` — same FE/BE contract pattern as Binance incremental sync, but against MexC keys and spot trades. Missing config is surfaced with `"not configured"` messaging.

**Full sync flow (async: Binance + MexC)**:
- Binance: `POST /transaction/sync/binance/full?portfolio=<name>&startDate=<epochMs>&endDate=<epochMs>`
- MexC: `POST /transaction/sync/mexc/full?portfolio=<name>&startDate=<epochMs>&endDate=<epochMs>`

Both return **202 Accepted** immediately; sync runs in a BE background thread. `startDate`/`endDate` are optional epoch milliseconds (default 2017-01-01 → now). Triggered from `BinanceSyncDialog` (exchange-aware); Redux thunks `syncBinanceFull` / `syncMexcFull` in `exchangeConfigSlice`. The dialog closes on 202 with an info toast, then `useSyncNotifications` handles completion/failure toasts via `/user/queue/sync-status`.

**WebSocket notifications**: `src/hooks/useSyncNotifications.ts` — connects via SockJS + STOMP to `http://localhost:9080/ws`, authenticates with JWT in the STOMP CONNECT header, subscribes to `/user/queue/sync-status`. Mounted once inside `Layout` while the user is authenticated. Message shape: `{ portfolioName, status: 'COMPLETED'|'FAILED', message }`.

**Transaction delete**: `DELETE /transaction/{id}` — dispatched via `deleteTransaction(id)` thunk. On success the transaction is removed from the local Redux state without a full refetch.

**Clear portfolio transactions**: `DELETE /transaction/portfolio/{portfolioName}` — dispatched via `clearPortfolioTransactions(portfolioName)` thunk. Clears the transaction list in Redux state on success. Exposed as "Clear All Transactions" button in `PortfolioPage` with a destructive-action confirmation dialog.

**`PortfolioProcessingResult` shape** (returned by `POST /transaction/information/all/{portfolio}`):
```text
{ coinInformation: CoinInformationResponse[]; processedCount: number; totalTransactions: number }
```
`processedCount` is the number of previously-unprocessed transactions that were processed in that call. Show a success toast if `> 0`, info toast if `=== 0`.

**Login response** (BE canonical):
```text
JwtResponse { jwt: string }
// id, username, email, roles are null — do not rely on them
```
