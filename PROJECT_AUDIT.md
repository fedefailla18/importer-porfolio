# Project Audit and Improvement Plan

This document provides an exhaustive review of the frontend codebase, current UX/UI patterns, data flow, and developer experience setup. It concludes with a prioritized improvement plan and concrete next steps for the cross‑functional team.

## 1. Architecture Overview

- Stack: React 18 + Redux Toolkit + TypeScript + Material UI 5.
- Routing: src/App.tsx with Protected routes using ProtectedRoute; auth state validated on load via Redux and Axios interceptor redirects to /login on 401.
- State Mgmt: Redux Toolkit slices in src/redux/slices with a single Axios instance in src/redux/utils/api.ts.
- Types: src/redux/types/types.ts centralizes shared interfaces.
- UI: Feature-first folders under src/components with reusable table patterns.

Key feature areas
- auth/: Login, Register, ProtectedRoute
- portfolio/: Landing, details (PortfolioPage), Holding details
- holdings/: HoldingListPage (scrollable table w/ sticky header, numeric formatting)
- transactions/: Filtered paginated TransactionList (now scrollable + sticky header)
- common/: Pagination

## 2. Data Flow and API

- Axios instance (src/redux/utils/api.ts) attaches JWT from localStorage and handles 401 globally.
- Thunks call BE endpoints per CLAUDE.md Backend API Contract.
- Important naming alignments captured in CLAUDE.md (e.g., payedWith/payedAmount, totalUsdt, /api/user/current for validation).

Observations
- Good consolidation on a single Axios instance.
- Some historical drift likely existed (fixed in docs): ensure all slices use the single api.ts instance.

## 3. UI/UX Review

Strengths
- Scrollable tables with sticky headers implemented for Holdings and Transactions.
- Basic number/currency formatting is in place in holdings.

Gaps and opportunities
- Entity stats section (PortfolioPage) uses ad-hoc layout; lacks consistent "cards" visuals, typography hierarchy, and responsive wrapping.
- Long names/labels may overflow. We should add ellipsis with Tooltip across headers and value cells.
- Table readability:
  - Numeric columns should be right-aligned and use tabular numerals for better scanability.
  - Dates should not wrap.
  - Long text (pair/symbol) should truncate with Tooltip.
- CTA positioning: Ensure primary CTAs (Upload CSV, Add Transaction) are discoverable and do not shift layout.

## 4. Developer Experience (DX)

- README and CLAUDE.md now document conventions and API contracts clearly.
- REDUX_ARCHITECTURE.md explains the migration benefits and common pitfalls.

Gaps
- No preconfigured CI. Consider adding a minimal GitHub Actions workflow for lint/build/test.
- ESLint/Prettier rules mentioned; ensure config files are present and applied in scripts.
- No Storybook or visual regression testing; optional but useful for shared components (tables, cards).

## 5. Accessibility

- Tables benefit from sticky headers; add table aria-labels.
- Ensure color usage respects contrast; prefer theme tokens.
- Add focus styles and keyboard nav support for CTAs.

## 6. Performance

- Transactions filter uses debounce; good. Ensure memoization for heavy rows if they grow (React.memo or virtualization if needed).
- Consider React.lazy for large feature routes if bundle grows.

## 7. Risks / Tech Debt

- Historical API contract mismatches could resurface; keep CLAUDE.md as source of truth.
- PortfolioPage contains UI and some control logic; consider moving UI‑only or stateful bits into smaller components to simplify.

## 8. Prioritized Next Steps (Impact/Effort)

1) Professionalize entity stats header (cards + layout) and improve table readability (right-align numbers, tooltips, nowrap dates). Impact: High, Effort: Low/Medium. [Implemented in branch docs-ui-audit-and-stats-polish — 2026-04-23]
2) Standardize truncation/tooltip helpers (Typography noWrap + Tooltip wrapper) as a tiny utility component. Impact: Medium, Effort: Low. [Implemented: src/components/common/TruncateWithTooltip.tsx — 2026-04-23]
3) Add basic CI: GitHub Actions to install, build, and run tests. Impact: Medium, Effort: Low.
4) Add lints to CI and pre-commit hook (lint-staged + husky). Impact: Medium, Effort: Low.
5) Consider extracting shared UI primitives: StatCard, DataTable, NumericCell. Impact: Medium, Effort: Medium.
6) Optional: Introduce React Query for server cache if moving beyond Redux for certain read paths. Impact: Medium, Effort: Medium.

## 9. Concrete Tasks for the Current Branch — Status: Completed (2026-04-23)

What we implemented in this branch (docs-ui-audit-and-stats-polish):

- PortfolioPage
  - Converted header to a responsive layout with StatCard visuals and clearer typography. ✓
  - Added ellipsis with Tooltip for long portfolio names. ✓
  - Consolidated actions (Upload CSV, Calculate Distribution, Fetch Missing Transactions) into a consistent right column in the header. Removed duplicates from tab content. ✓
- Transactions table
  - Right-aligned numeric cells and enabled tabular numerals for improved scanability. ✓
  - Ensured dates do not wrap; truncated long text (pair/symbol) with ellipsis and Tooltip. ✓
  - Added aria-label on the table for accessibility. ✓
- Documentation
  - Added this audit and linked it from README. Updated UI conventions to mention consistent CTA placement in page headers. ✓

## 10. Definition of Done

- Build passes, pages render without layout shifts.
- Visible improvement to readability of stats and tables.
- Docs published with actionable next steps and ownership handoff.
