import { createStore, applyMiddleware, Middleware, Dispatch } from "redux";
import thunk from "redux-thunk";
//import { routerMiddleware } from "connect-react-router";
//import { apiMiddleware } from "redux-api-middleware"
import { createBrowserHistory } from "history";

import rootReducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";

export const history = createBrowserHistory();

const middleware: Middleware<{}, any, Dispatch<any>>[] = [
  //routerMiddleware(history),
  thunk,
];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
