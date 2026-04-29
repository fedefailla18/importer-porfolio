// src/redux/reducers/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';

import authSlice from '../slices/authSlice';
import binanceSpotActivityReducer from '../slices/binanceSpotActivitySlice';
import mexcSpotActivityReducer from '../slices/mexcSpotActivitySlice';
import coinInformationReducer from '../slices/coinInformationSlice';
import exchangeConfigReducer from '../slices/exchangeConfigSlice';
import holdingDetailsSlice from '../slices/holdingDetailsSlice';
import portfolioSlice from '../slices/portfolioSlice';
import transactionSlice from '../slices/transactionSlice';

const rootReducer = combineReducers({
  portfolio: portfolioSlice,
  holdingDetails: holdingDetailsSlice,
  transactions: transactionSlice,
  coinInformation: coinInformationReducer,
  auth: authSlice,
  exchangeConfig: exchangeConfigReducer,
  binanceSpotActivity: binanceSpotActivityReducer,
  mexcSpotActivity: mexcSpotActivityReducer,
});

export default rootReducer;
