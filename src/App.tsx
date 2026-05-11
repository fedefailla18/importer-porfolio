import { ThemeProvider, CssBaseline } from '@mui/material';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './components/auth/Register';
import BinanceSpotActivityPage from './components/binance/BinanceSpotActivityPage';
import ExchangeConfigPage from './components/exchange/ExchangeConfigPage';
import ExchangesLandingPage from './components/exchange/ExchangesLandingPage';
import HoldingComponent from './components/holdings/HoldingComponent';
import IolPage from './components/iol/IolPage';
import Layout from './components/layout/Layout';
import MexcSpotActivityPage from './components/mexc/MexcSpotActivityPage';
import DataDictionaryPage from './components/onboarding/DataDictionaryPage';
import GettingStartedPage from './components/onboarding/GettingStartedPage';
import InvestorHubPage from './components/onboarding/InvestorHubPage';
import ManualUserPage from './components/onboarding/ManualUserPage';
import PortfolioComponent from './components/portfolio/PortfolioComponent';
import PortfolioHubPage from './components/portfolio/PortfolioHubPage';
import PortfolioLandingPage from './components/portfolio/PortfolioLandingPage';
import AllTransactionsPage from './components/transactions/AllTransactionsPage';
import TransactionForm from './components/transactions/TransactionForm';
import TransactionList from './components/transactions/TransactionList';
import { store } from './redux/store';
import theme from './theme';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='getting-started' element={<GettingStartedPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<InvestorHubPage />} />
                <Route path='home' element={<InvestorHubPage />} />
                <Route path='portfolio' element={<PortfolioLandingPage />} />
                <Route path='manual' element={<ManualUserPage />} />
                <Route path='data-dictionary' element={<DataDictionaryPage />} />
                <Route path='portfolio/:portfolioName' element={<PortfolioComponent />} />
                <Route path='portfolio/:portfolioName/:symbol' element={<HoldingComponent />} />
                <Route path='transactions/:portfolioName' element={<TransactionList />} />
                <Route path='transactions' element={<AllTransactionsPage />} />
                <Route path='holdings' element={<HoldingComponent />} />
                <Route path='add-transaction' element={<TransactionForm />} />
                <Route path='portfolio-hub' element={<PortfolioHubPage />} />
                <Route path='exchanges' element={<ExchangesLandingPage />} />
                <Route path='binance-activity' element={<BinanceSpotActivityPage />} />
                <Route path='mexc-activity' element={<MexcSpotActivityPage />} />
                <Route path='iol' element={<IolPage />} />
                <Route path='settings' element={<ExchangeConfigPage />} />
              </Route>
            </Route>
          </Routes>
          <ToastContainer />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
