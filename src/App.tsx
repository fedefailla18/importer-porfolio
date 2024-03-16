import React from "react";
import { Provider } from "react-redux";
import PortfolioComponent from "./components/PortfolioComponent";
import store from "./configureStore";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PortfolioComponent />
    </Provider>
  );
};

export default App;
