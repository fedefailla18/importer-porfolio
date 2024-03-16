import { combineReducers } from "redux";
import portfolioReducer from "./portfolioReducer";

const rootReducer = combineReducers({
  portfolio: portfolioReducer,
  // Add other reducers here if needed
});

export default rootReducer;
