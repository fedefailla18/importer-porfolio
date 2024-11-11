// src/components/holdings/HoldingComponent.tsx
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchHoldingDetails } from "../../redux/slices/holdingDetailsSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import TransactionList from "../transactions/TransactionList";

const HoldingComponent: React.FC = () => {
  const { portfolioName, symbol } = useParams<{
    portfolioName: string;
    symbol: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    holdingDetails,
    status: holdingStatus,
    error: holdingError,
  } = useAppSelector((state) => state.holdingDetails);

  useEffect(() => {
    if (portfolioName && symbol) {
      dispatch(fetchHoldingDetails({ portfolioName, symbol }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioName, symbol]);

  const handleHoldingChange = (event: any) => {
    const newSymbol = event.target.value as string;
    navigate(`/holdings/${portfolioName}/${newSymbol}`);
  };

  const renderHoldingDetails = () => {
    if (holdingStatus === "loading") return <CircularProgress />;
    if (holdingStatus === "failed")
      return <Alert severity="error">{holdingError}</Alert>;
    if (!holdingDetails)
      return <Typography>No holding details available</Typography>;

    return (
      <div>
        <Typography>Amount: {holdingDetails.amount}</Typography>
        <Typography>
          Total Amount Bought: {holdingDetails.totalAmountBought}
        </Typography>
        <Typography>
          Total Amount Sold: {holdingDetails.totalAmountSold}
        </Typography>
        <Typography>Price in BTC: {holdingDetails.priceInBtc}</Typography>
        <Typography>Price in USDT: {holdingDetails.priceInUsdt}</Typography>
        <Typography>Amount in BTC: {holdingDetails.amountInBtc}</Typography>
        <Typography>Amount in USDT: {holdingDetails.amountInUsdt}</Typography>
        <Typography>Percentage: {holdingDetails.percentage}</Typography>
        <Typography>
          Stable Total Cost: {holdingDetails.stableTotalCost}
        </Typography>
        <Typography>
          Total Realized Profit USDT: {holdingDetails.totalRealizedProfitUsdt}
        </Typography>
      </div>
    );
  };

  return (
    <div>
      <Select
        value={holdingDetails}
        onChange={handleHoldingChange}
        style={{ marginBottom: "1rem" }}
      ></Select>

      <div>
        <Paper style={{ marginBottom: "1rem", padding: "1rem" }}>
          <Typography variant="h6">Holding Stats for {symbol}</Typography>
          {renderHoldingDetails()}
        </Paper>

        <Typography variant="h6" style={{ marginBottom: "1rem" }}>
          Transactions for {symbol}
        </Typography>
        <TransactionList symbol={symbol} portfolioName={portfolioName} />
      </div>
    </div>
  );
};

export default HoldingComponent;
