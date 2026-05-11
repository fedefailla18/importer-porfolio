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

**Routing** (`App.tsx`): Public routes (`/login`, `/register`) and protected routes wrapped in `<ProtectedRoute>`. Key routes: `/portfolio-hub` → `PortfolioHubPage`, `/portfolio` → `PortfolioLandingPage`, `/exchanges` → `ExchangesLandingPage`.

**State** (`src/redux/`):
- `slices/` — one slice per domain: `auth`, `portfolio`, `holdingDetails`, `transactions`, `coinInformation`, `exchangeConfig`, `binanceSpotActivity`, `mexcSpotActivity`, `iol`
- `store/index.ts` — `configureStore` with combined reducer
- `reducers/reducer.ts` — `combineReducers` root
- `hooks.ts` — typed `useAppDispatch` / `useAppSelector` (always use these instead of raw hooks)
- `utils/api.ts` — the canonical Axios instance (interceptors for auth and 401 handling)
- `utils/auth.ts` — localStorage token helpers
- `types/types.ts` — all shared TypeScript interfaces

**Component tree** (`src/components/`):
- `auth/` — Login, Register, ProtectedRoute
- `layout/` — Layout (AppBar nav with grouped dropdowns)
- `portfolio/` — `PortfolioHubPage` (landing), `PortfolioLandingPage` (list), detail page, create/upload dialog, custom hook `usePortfolioComponent`
- `holdings/` — list, detail, add-multiple form
- `transactions/` — list, filter, add form/drawer, pagination
- `exchange/` — `ExchangesLandingPage` (integration overview), `ExchangeConfigPage` (credentials)
- `binance/` — BinanceSpotActivityPage (spot trades, sync controls)
- `mexc/` — MexcSpotActivityPage (spot trades, sync controls)
- `iol/` — IolPage (4-tab view: Overview, AR Portfolio, US Portfolio, Operations)
- `common/` — Pagination

**Navigation structure** (authenticated):
- **Dashboard** → `/`
- **Portfolio** (dropdown): Overview → `/portfolio-hub` · My Portfolios → `/portfolio` · Transactions → `/transactions`
- **Exchanges** (dropdown): Overview → `/exchanges` · Binance → `/binance-activity` · MEXC → `/mexc-activity` · IOL → `/iol`
- **Help** (dropdown): Manual → `/manual` · Data Dictionary → `/data-dictionary`
- **Avatar menu**: Settings → `/settings` · Logout

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
| IOL | GET | `/api/integration/iol/profile` | → `IolProfileResponse` |
| IOL | GET | `/api/integration/iol/account-statement` | → `IolAccountStatementResponse` |
| IOL | GET | `/api/integration/iol/portfolio/{country}` | `country`: `argentina` or `estados_unidos` → `IolPortfolioResponse` |
| IOL | GET | `/api/integration/iol/operations` | → `IolOperationResponse[]` |
| IOL | GET | `/api/integration/iol/operations/{number}` | → `IolOperationResponse` (single operation detail) |

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

## IOL (InvertirOnline) Integration

IOL is an Argentine stock broker. Credentials are stored in `UserExchangeConfig` with `exchangeName = 'IOL'`; the username goes into `apiKey` and the password into the encrypted `apiSecret`. Configure at `/settings` before using `/iol`.

**Redux slice**: `src/redux/slices/iolSlice.ts` — exports 5 thunks:
- `fetchIolProfile()` — user identity, investor profile, comitente account number
- `fetchIolAccountStatement()` — ARS/USD account balances across cuentas (comitente, inversora, etc.)
- `fetchIolPortfolio(country: 'argentina' | 'estados_unidos')` — holdings per market; uses a single shared thunk with per-country status fields (`portfolioArStatus` / `portfolioUsStatus`) differentiated via `action.meta.arg`
- `fetchIolOperations()` — full operations history
- `fetchIolOperationDetails(number: number)` — single operation detail, stored in `selectedOperation`

Also exports the `clearSelectedOperation` action.

**IolPage tabs** (`src/components/iol/IolPage.tsx`):
- **Overview** — profile card (investor profile chip, contact info) + account summary cards + cuentas table
- **AR Portfolio** — Argentine market holdings; P&L color-coded via `success.main` / `error.main`
- **US Portfolio** — US market holdings; same layout as AR tab
- **Operations** — filterable/paginated operations table with a side Drawer for operation details (fetches on row click)

Data is lazy-loaded: profile + account statement load on mount; each portfolio/operations tab loads on first activation.

**Response shapes** (all types in `src/redux/types/types.ts`):
```text
IolProfile       { nombreUsuario, nombre, apellido, email, cuit, perfilInversor, cuentaComitente, estado }
IolAccountStatement { cuentas: IolCuenta[], totalPesos, totalDolares, totalConvertedUsd, exchangeRate }
IolCuenta        { numero, tipo, moneda, disponible, comprometido, saldo, titulosValorizados, total }
IolPortfolio     { activos: IolActivo[] }
IolActivo        { simbolo, descripcion, cantidad, valorizado, ultimoPrecio, variacion, ppc,
                   gananciaPorcentaje, gananciaDinero, tipo, valorizadoUsd, exchangeRate }
IolOperation     { numero, fechaOrden, tipo, estado, simbolo, cantidad, precio, monto,
                   modalidad, montoUsd, exchangeRate }
```

**Credential error handling**: If the user has no IOL config saved, the BE throws `IllegalArgumentException`. The FE slice catches it; pages should check for `error` in state and prompt the user to configure credentials at `/settings`.

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

## IOL (InvertirOnline) Integration

IOL is an Argentine stock broker. Credentials are stored in `UserExchangeConfig` with `exchangeName = 'IOL'`; the username goes into `apiKey` and the password into the encrypted `apiSecret`. Configure at `/settings` before using `/iol`.

**Redux slice**: `src/redux/slices/iolSlice.ts` — exports 5 thunks:
- `fetchIolProfile()` — user identity, investor profile, comitente account number
- `fetchIolAccountStatement()` — ARS/USD account balances across cuentas (comitente, inversora, etc.)
- `fetchIolPortfolio(country: 'argentina' | 'estados_unidos')` — holdings per market; uses a single shared thunk with per-country status fields (`portfolioArStatus` / `portfolioUsStatus`) differentiated via `action.meta.arg`
- `fetchIolOperations()` — full operations history
- `fetchIolOperationDetails(number: number)` — single operation detail, stored in `selectedOperation`

Also exports the `clearSelectedOperation` action.

**IolPage tabs** (`src/components/iol/IolPage.tsx`):
- **Overview** — profile card (investor profile chip, contact info) + account summary cards + cuentas table
- **AR Portfolio** — Argentine market holdings; P&L color-coded via `success.main` / `error.main`
- **US Portfolio** — US market holdings; same layout as AR tab
- **Operations** — filterable/paginated operations table with a side Drawer for operation details (fetches on row click)

Data is lazy-loaded: profile + account statement load on mount; each portfolio/operations tab loads on first activation.

**Response shapes** (all types in `src/redux/types/types.ts`):
```text
IolProfile       { nombreUsuario, nombre, apellido, email, cuit, perfilInversor, cuentaComitente, estado }
IolAccountStatement { cuentas: IolCuenta[], totalPesos, totalDolares, totalConvertedUsd, exchangeRate }
IolCuenta        { numero, tipo, moneda, disponible, comprometido, saldo, titulosValorizados, total }
IolPortfolio     { activos: IolActivo[] }
IolActivo        { simbolo, descripcion, cantidad, valorizado, ultimoPrecio, variacion, ppc,
                   gananciaPorcentaje, gananciaDinero, tipo, valorizadoUsd, exchangeRate }
IolOperation     { numero, fechaOrden, tipo, estado, simbolo, cantidad, precio, monto,
                   modalidad, montoUsd, exchangeRate }
```

**Credential error handling**: If the user has no IOL config saved, the BE throws `IllegalArgumentException`. The FE slice catches it; pages should check for `error` in state and prompt the user to configure credentials at `/settings`.
