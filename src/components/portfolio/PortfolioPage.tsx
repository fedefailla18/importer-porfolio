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
} from "@mui/material";
import { PortfolioDistribution } from "../../redux/types/types";
import TransactionList from "../transactions/TransactionList";
import HoldingListPage from "../holdings/HoldingListPage";
import AddHoldingsForm from "../holdings/AddHoldingsForm";

// Define styles using makeStyles
const StyledContainer = styled(Container)({
  marginTop: "2rem",
});

interface Props {
  portfolioDistribution: PortfolioDistribution;
}

const PortfolioPage = ({ portfolioDistribution }: Props) => {
  const [priceMultiplier, setPriceMultiplier] = useState<{
    [key: number]: number;
  }>({});
  const [predictionUsdt, setPredictionUsdt] = useState<{
    [key: number]: number;
  }>({});
  const [predictionBtc, setPredictionBtc] = useState<{
    [key: number]: number;
  }>({});

  const sortedHoldings = portfolioDistribution.holdings.slice().sort((a, b) => {
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

  const renderStats = () => (
    <Paper style={{ marginBottom: "1rem", padding: "1rem" }}>
      <Typography variant="h6">Portfolio Stats</Typography>

      <Typography variant="subtitle1" gutterBottom>
        Portfolio Name: {portfolioDistribution.portfolioName}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total USDT: {portfolioDistribution.totalUsdt}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Holdings: {portfolioDistribution.totalHoldings}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Reazlized Profit:{" "}
        {sortedHoldings
          .map((e) => e.totalRealizedProfitUsdt)
          .reduce((acc, curr) => (acc || 0) + (curr || 0), 0)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Stable Total Cost:{" "}
        {sortedHoldings
          .map((e) => e.stableTotalCost)
          .reduce((acc, curr) => (acc || 0) + (curr || 0), 0)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Current Position in USDT:{" "}
        {sortedHoldings
          .map((e) => e.amountInUsdt)
          .reduce((acc, curr) => (acc || 0) + (curr || 0), 0)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Current Position in BTC:{" "}
        {sortedHoldings
          .map((e) => e.amountInBtc)
          .reduce((acc, curr) => (acc || 0) + (curr || 0), 0)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Prediction USDT:{" "}
        {Object.values(predictionUsdt).reduce((acc, curr) => acc + curr, 0)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Prediction BTC:{" "}
        {Object.values(predictionBtc).reduce((acc, curr) => acc + curr, 0)}
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
          <Button
            variant="contained"
            color="primary"
            onClick={toggleDrawer(true)}
          >
            Add Holdings
          </Button>
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
        <TransactionList portfolioName={portfolioDistribution.portfolioName} />
      )}
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 400, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add Holdings
          </Typography>
          <AddHoldingsForm onClose={toggleDrawer(false)} />
        </Box>
      </Drawer>
    </StyledContainer>
  );
};

export default PortfolioPage;
