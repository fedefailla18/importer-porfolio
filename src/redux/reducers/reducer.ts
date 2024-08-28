import { combineReducers } from "redux";
import portfolioReducer from "./portfolioReducer";
import { holdingDetailsReducer } from "./holdingDetailsReducer";

const rootReducer = combineReducers({
  portfolio: portfolioReducer,
  holdingDetails: holdingDetailsReducer,
  // Add other reducers here if needed
});

export default rootReducer;
