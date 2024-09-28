// src/App.tsx
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Header from "./components/layout/Header";
import { store } from "./redux/store";
import PortfolioComponent from "./components/portfolio/PortfolioComponent";
import TransactionForm from "./components/transactions/TransactionForm";
import TransactionList from "./components/transactions/TransactionList";
import HoldingComponent from "./components/holdings/HoldingComponent";
import HoldingDetailPage from "./components/portfolio/HoldingDetailPage";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<PortfolioComponent />} />
            <Route
              path="/portfolio/:portfolioName/:symbol"
              element={<HoldingComponent />}
            />
            <Route
              path="/transactions/:portfolioName"
              element={<TransactionList />}
            />
            <Route path="/add-transaction" element={<TransactionForm />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
