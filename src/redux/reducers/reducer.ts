// src/redux/reducers/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import portfolioReducer from "./portfolioReducer";
import holdingDetailsSlice from "../slices/holdingDetailsSlice";
import transactionSlice from "../slices/transactionSlice";

const rootReducer = combineReducers({
  portfolio: portfolioReducer,
  holdingDetails: holdingDetailsSlice,
  transactions: transactionSlice,
});

export default rootReducer;
