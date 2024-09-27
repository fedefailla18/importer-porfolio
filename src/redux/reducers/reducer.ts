// src/redux/reducers/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import portfolioReducer from "./portfolioReducer";
import holdingDetailsReducer from "./holdingDetailsReducer";
import transactionSlice from "../slices/transactionSlice";

const rootReducer = combineReducers({
  portfolio: portfolioReducer,
  holdingDetails: holdingDetailsReducer,
  transactions: transactionSlice,
});

export default rootReducer;
