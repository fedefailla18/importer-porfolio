# Importer Portfolio — Frontend

React 18 + Redux Toolkit + Material UI 5 + TypeScript. See CLAUDE.md for in-repo conventions and development guidance.

For a comprehensive architecture and UX audit with prioritized next steps, see PROJECT_AUDIT.md.

## Quick Start

- Node 18+ recommended
- Backend: Spring Boot running at http://localhost:9080

Commands:

- npm install
- npm start — dev server at http://localhost:3000
- npm test — Jest watch mode
- npm run build — production build in build/

Environment:

- The app reads the JWT from localStorage (key: token).
- API base URL and Axios instance live in src/redux/utils/api.ts (preconfigured to 9080 and auto-attaches Authorization header).

## Project Highlights

- Routing in src/App.tsx with protected routes via ProtectedRoute.
- Redux slices in src/redux/slices; typed hooks in src/redux/hooks.ts.
- Global API instance in src/redux/utils/api.ts with interceptors for auth + 401 redirect to /login.
- UI built with Material UI. Reusable table patterns and pagination in components/common and feature folders.
- Binance Activity page for comparing fresh raw Binance spot trades against InvestTracker portfolio/accounting views.

Full project audit and improvement plan: PROJECT_AUDIT.md

## UI Conventions (tables with stats + lists)

Pages that show an entity’s stats followed by a long list use a scrollable table area so the page header/stats remain visible and the list scrolls independently:

- Use a Table inside a TableContainer with maxHeight: 60vh and overflow: auto.
- Enable stickyHeader on the Table and make header TableCell sticky with position: sticky; top: 0 and a background color from theme.palette.background.paper to avoid transparency artifacts.
- Example implementations:
  - Holdings list: src/components/holdings/HoldingListPage.tsx
  - Transactions list: src/components/transactions/TransactionList.tsx

When adding new list pages, mirror this pattern to keep UX consistent for large datasets.

CTA placement:
- Primary page actions related to the entity (e.g., Upload CSV, Calculate Distribution, Fetch Missing Transactions) should live in the page header’s right column so they’re always visible above the scrollable list.
- Contextual actions specific to a tab (e.g., Add Holdings) can appear within that tab’s content area.
- Account-wide read-only diagnostics or reconciliation views should be exposed as dedicated routes from the navbar. Example: the Binance Activity page.

Truncation + Tooltip helper:
- Use the shared utility to handle long labels/text consistently across headers and cells.
- Component: src/components/common/TruncateWithTooltip.tsx
- Usage example:
  
  ```tsx
  import TruncateWithTooltip from './components/common/TruncateWithTooltip';

  // Inside a TableCell or any layout
  <TruncateWithTooltip text={pair} maxWidth={160} />

  // As Typography with variant and wider max width
  <TruncateWithTooltip
    typography
    typographyVariant="h6"
    text={`${portfolioName} Portfolio Stats`}
    maxWidth="60vw"
  />
  ```

## Authentication Notes

- Login stores the JWT in localStorage.
- ProtectedRoute validates token on load; on 401 the Axios interceptor clears storage and redirects to /login.

## Contributing

- Follow code style and guidelines in CLAUDE.md.
- Prefer Redux Toolkit slices and typed hooks.
- For tables, follow the UI Conventions above (scrollable containers + sticky headers) to ensure consistent behavior across the app.
