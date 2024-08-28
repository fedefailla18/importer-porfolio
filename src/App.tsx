import React from "react";
import { Provider } from "react-redux";
import PortfolioComponent from "./components/PortfolioComponent";
import store from "./configureStore";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HoldingDetailsPage from "./components/HoldingDetailPage";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<PortfolioComponent />} />
          <Route
            path="/portfolio/:portfolioName/:symbol"
            element={<HoldingDetailsPage />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
