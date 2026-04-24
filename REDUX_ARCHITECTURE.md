# Redux Architecture Explanation & Fixes

## 1. Redux Toolkit vs Traditional Redux

### **Why Redux Toolkit is Better:**

#### **Traditional Redux (Legacy)**

```javascript
// Actions (separate file)
const FETCH_PORTFOLIO = 'FETCH_PORTFOLIO'
const fetchPortfolio = (name) => ({ type: FETCH_PORTFOLIO, payload: name })

// Reducers (separate file)
const portfolioReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PORTFOLIO:
      return { ...state, loading: true }
    // ... more cases
  }
}
```

#### **Redux Toolkit (Modern)**

```javascript
// Slice (everything in one file)
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    /* sync actions */
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPortfolio.pending, (state) => {
      state.status = 'loading' // Immer handles immutability
    })
  },
})
```

### **Benefits of Redux Toolkit:**

- ✅ **Less boilerplate**: No action types, action creators, switch statements
- ✅ **Built-in Immer**: Automatic immutability (no spread operators needed)
- ✅ **TypeScript support**: Automatic type inference
- ✅ **DevTools integration**: Better debugging experience
- ✅ **createAsyncThunk**: Built-in async action handling

### **SRP (Single Responsibility Principle)**

The slice file has **one responsibility**: managing portfolio state. Actions, reducers, and selectors are all part of that single responsibility - managing portfolio data.

## 2. Authentication Persistence Fix

### **Problem:**

User gets logged out on refresh because auth state wasn't persisted.

### **Solution:**

```javascript
// Check localStorage on app startup
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState: AuthState = {
  user: user ? JSON.parse(user) : null,
  isAuthenticated: !!token,
  // ...
};
```

### **How it works:**

1. **Login**: Token and user data stored in localStorage
2. **Refresh**: App checks localStorage on startup
3. **Logout**: Clears localStorage

## 3. Redux Store Mismatch Fix

### **Problem:**

```javascript
// OLD: rootReducer was using old portfolioReducer
const rootReducer = combineReducers({
  portfolio: portfolioReducer, // ❌ Old reducer
  // ...
})

// NEW: rootReducer now uses new portfolioSlice
const rootReducer = combineReducers({
  portfolio: portfolioSlice, // ✅ New slice
  // ...
})
```

### **What was happening:**

1. `PortfolioComponent` calls `fetchAllPortfolios()` from `portfolioSlice`
2. But `RootState` was reading from `portfolioReducer` (old)
3. Data was being stored in the slice but read from the reducer
4. **Result**: No data visible

### **Fix:**

Updated `rootReducer` to use `portfolioSlice` instead of `portfolioReducer`.

## 4. File Structure Cleanup

### **Before (Mixed Architecture):**

```
src/redux/
├── actions/portfolioActions.tsx     ❌ Old approach
├── reducers/portfolioReducer.tsx   ❌ Old approach
├── slices/portfolioSlice.tsx       ✅ New approach
└── types/types.ts
```

### **After (Clean Architecture):**

```
src/redux/
├── slices/
│   ├── portfolioSlice.tsx          ✅ All portfolio logic
│   ├── transactionSlice.ts
│   ├── authSlice.ts
│   └── coinInformationSlice.ts
├── types/types.ts
└── utils/
```

## 5. Current State Flow

### **Portfolio Data Flow:**

1. **App Startup**: `PortfolioComponent` calls `fetchAllPortfolios()`
2. **API Call**: `GET /portfolio/names` (with fallback to hardcoded list)
3. **State Update**: `portfolioSlice` updates `portfolios` array
4. **UI Update**: `PortfolioLandingPage` displays portfolio cards
5. **Details Loading**: Each portfolio card fetches its details via `fetchPortfolioDetails()`

### **Authentication Flow:**

1. **Login**: User credentials → API → JWT stored in localStorage
2. **Refresh**: App checks localStorage → Restores auth state
3. **Protected Routes**: Check `isAuthenticated` from Redux state

## 6. Backend Endpoints Needed

### **✅ Working Endpoints:**

```java
GET /portfolio?name={name}           - Get portfolio by name
POST /portfolio/distribution         - Calculate portfolio distribution
GET /portfolio/{name}/{symbol}       - Get specific holding
GET /portfolio/download              - Download Excel
POST /transaction/upload/{portfolio} - Upload transactions
```

## 7. Testing the Fixes

### **To verify everything works:**

1. **Check Redux DevTools**: You should see portfolio state updates
2. **Refresh page**: Should stay logged in
3. **Portfolio names**: Should appear in landing page
4. **API calls**: Check Network tab for `/portfolio/names` calls

### **Debugging:**

```javascript
// In browser console
console.log(store.getState().portfolio) // Should show portfolios array
console.log(store.getState().auth) // Should show isAuthenticated: true
```

## 8. Migration Benefits

### **Before (Traditional Redux):**

- ❌ 3 files per feature (actions, reducers, types)
- ❌ Manual immutability (spread operators everywhere)
- ❌ No TypeScript inference
- ❌ More boilerplate code

### **After (Redux Toolkit):**

- ✅ 1 file per feature (slice)
- ✅ Automatic immutability
- ✅ Full TypeScript support
- ✅ Less code, better DX

## 9. Next Steps

1. **Implement missing backend endpoints**
2. **Test portfolio creation flow**
3. **Test file upload functionality**
4. **Add error boundaries for better UX**

The architecture is now clean, modern, and follows Redux Toolkit best practices!
