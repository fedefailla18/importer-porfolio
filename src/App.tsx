// src/App.tsx
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import theme from "./theme";
import { store } from "./redux/store";
import PortfolioComponent from "./components/portfolio/PortfolioComponent";
import TransactionForm from "./components/transactions/TransactionForm";
import TransactionList from "./components/transactions/TransactionList";
import HoldingComponent from "./components/holdings/HoldingComponent";
import AllTransactionsPage from "./components/transactions/AllTransactionsPage";
import Layout from "./components/layout/Layout";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout />
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
            <Route path="/transactions" element={<AllTransactionsPage />} />
            <Route path="/holdings" element={<HoldingComponent />} />
            <Route path="/add-transaction" element={<TransactionForm />} />
          </Routes>
        </Router>
        <ToastContainer />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
