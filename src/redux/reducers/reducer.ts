// src/redux/reducers/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import portfolioReducer from "./portfolioReducer";
import holdingDetailsSlice from "../slices/holdingDetailsSlice";
import transactionSlice from "../slices/transactionSlice";
import coinInformationReducer from "../slices/coinInformationSlice";
import authSlice from "../slices/authSlice";

const rootReducer = combineReducers({
  portfolio: portfolioReducer,
  holdingDetails: holdingDetailsSlice,
  transactions: transactionSlice,
  coinInformation: coinInformationReducer,
  auth: authSlice,
});

export default rootReducer;
