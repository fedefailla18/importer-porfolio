// src/components/portfolio/PortfolioPage.tsx
import React, { useState } from "react";

import {
  Container,
  Typography,
  styled,
  Paper,
  Box,
  Tabs,
  Tab,
  Button,
  Drawer,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { PortfolioDistribution } from "../../redux/types/types";
import TransactionList from "../transactions/TransactionList";
import HoldingListPage from "../holdings/HoldingListPage";
import AddHoldingsForm from "../holdings/AddHoldingsForm";
import { fetchCoinInformation } from "../../redux/slices/coinInformationSlice";
import { fetchPortfolioHoldingDistribution } from "../../redux/slices/portfolioSlice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

const StyledContainer = styled(Container)({
  marginTop: "2rem",
});

interface Props {
  portfolioDistribution: PortfolioDistribution;
}

const PortfolioPage = ({ portfolioDistribution }: Props) => {
  const dispatch = useAppDispatch();
  const [priceMultiplier, setPriceMultiplier] = useState<{
    [key: number]: number;
  }>({});
  const [predictionUsdt, setPredictionUsdt] = useState<{
    [key: number]: number;
  }>({});
  const [predictionBtc, setPredictionBtc] = useState<{
    [key: number]: number;
  }>({});
  const [showCalculationAlert, setShowCalculationAlert] = useState(true);
  const coinInformationState = useAppSelector(
    (state: RootState) => state.coinInformation
  );
  const sortedHoldings = portfolioDistribution?.holdings?.slice().sort((a, b) => {
    return 0;
  });

  // this should be in PortfolioComponent.tsx
  const [activeTab, setActiveTab] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsDrawerOpen(open);
    };

  const handleFetchCoinInformation = () => {
    dispatch(fetchCoinInformation(portfolioDistribution.portfolioName));
  };

  const handleCalculateDistribution = (name: string) => {
    dispatch(fetchPortfolioHoldingDistribution(name)).then(() => {
      toast.success("Portfolio updated");
    });
  };

  const renderStats = () => (
    <Paper style={{ marginBottom: "1rem", padding: "1rem" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Typography variant="h6">{portfolioDistribution.portfolioName} Portfolio Stats</Typography>
        
        {/* Calculation Status Indicator */}
        {portfolioDistribution?.totalHoldings === 0 ? (
          <Alert severity="warning" sx={{ maxWidth: 400 }}>
            <AlertTitle>Portfolio Not Calculated</AlertTitle>
            This portfolio hasn't been calculated yet. Click "Calculate Distribution" to process your holdings and get accurate statistics.
          </Alert>
        ) : (
          showCalculationAlert && (
            <Alert 
              severity="success" 
              sx={{ maxWidth: 400 }}
              onClose={() => setShowCalculationAlert(false)}
            >
              <AlertTitle>Portfolio Calculated</AlertTitle>
              Your portfolio data is up to date. Total holdings: {portfolioDistribution.totalHoldings}
            </Alert>
          )
        )}
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Total USDT: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolioDistribution.totalInUsdt)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Holdings: {portfolioDistribution.totalHoldings}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Realized Profit:{" "}
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
          sortedHoldings
            .map((e) => e.totalRealizedProfitUsdt ?? 0)
            .reduce((acc, curr) => acc + curr, 0)
        )}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Cost Basis:{" "}
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
          sortedHoldings
            .map((e) => e.stableTotalCost ?? 0)
            .reduce((acc, curr) => acc + curr, 0)
        )}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Current Position in USDT:{" "}
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
          sortedHoldings
            .map((e) => e.currentPositionInUsdt ?? 0)
            .reduce((acc, curr) => acc + curr, 0)
        )}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Current Position in BTC:{" "}
        {new Intl.NumberFormat('en-US', { minimumFractionDigits: 8, maximumFractionDigits: 8 }).format(
          sortedHoldings
            .map((e) => e.amountInBtc)
            .reduce((acc, curr) => acc + curr, 0)
        )}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Prediction USDT:{" "}
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
          Object.values(predictionUsdt).reduce((acc, curr) => acc + curr, 0)
        )}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Prediction BTC:{" "}
        {new Intl.NumberFormat('en-US', { minimumFractionDigits: 8, maximumFractionDigits: 8 }).format(
          Object.values(predictionBtc).reduce((acc, curr) => acc + curr, 0)
        )}
      </Typography>
    </Paper>
  );

  return (
    <StyledContainer maxWidth="xl">
      {renderStats()}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Holdings" />
          <Tab label="Transactions" />
        </Tabs>
      </Box>

      {activeTab === 0 && sortedHoldings && (
        <>
          <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleDrawer(true)}
            >
              Add Holdings
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                handleCalculateDistribution(portfolioDistribution.portfolioName)
              }
            >
              Calculate Distribution
            </Button>
          </Box>
          <HoldingListPage
            holdings={sortedHoldings}
            portfolioName={portfolioDistribution.portfolioName}
            setPriceMultiplier={setPriceMultiplier}
            setPredictionBtc={setPredictionBtc}
            setPredictionUsdt={setPredictionUsdt}
            priceMultiplier={priceMultiplier}
          />
        </>
      )}
      {activeTab === 1 && (
        <>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFetchCoinInformation}
              disabled={coinInformationState.status === "loading"}
              sx={{ mr: 2 }}
            >
              {coinInformationState.status === "loading" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Calculate Portfolio From Missing Processed Transactions"
              )}
            </Button>
          </Box>
          <TransactionList
            portfolioName={portfolioDistribution.portfolioName}
          />
        </>
      )}
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 400, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add Holdings
          </Typography>
          <AddHoldingsForm
            onClose={toggleDrawer(false)}
            portfolio={portfolioDistribution.portfolioName}
          />
        </Box>
      </Drawer>
    </StyledContainer>
  );
};

export default PortfolioPage;
