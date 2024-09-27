// src/components/holdings/HoldingComponent.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchHoldingDetails } from "../../redux/slices/holdingDetailsSlice";
import {
  fetchTransactionsByPortfolioName,
  fetchTransactionsBySymbol,
  Transaction,
} from "../../redux/slices/transactionSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";

const HoldingComponent = () => {
  const { portfolioName, symbol } = useParams<{
    portfolioName: string;
    symbol: string;
  }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedHolding, setSelectedHolding] = useState<string>(symbol || "");
  const {
    holdingDetails,
    status: holdingStatus,
    error: holdingError,
  } = useAppSelector((state) => state.holdingDetails);
  const {
    transactions,
    status: transactionStatus,
    error: transactionError,
  } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    if (portfolioName && selectedHolding) {
      dispatch(fetchHoldingDetails({ portfolioName, symbol: selectedHolding }));
    }
  }, [dispatch, portfolioName, selectedHolding]);

  useEffect(() => {
    if (selectedHolding) {
      dispatch(fetchTransactionsBySymbol(selectedHolding));
    }
  }, [dispatch, portfolioName, selectedHolding]);

  const handleHoldingChange = (event: any) => {
    const newSymbol = event.target.value as string;
    setSelectedHolding(newSymbol);
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
        <Typography>
          Current Position in USDT: {holdingDetails.currentPositionInUsdt}
        </Typography>
      </div>
    );
  };

  const renderTransactions = () => {
    if (transactionStatus === "loading") return <CircularProgress />;
    if (transactionStatus === "failed")
      return <Alert severity="error">{transactionError}</Alert>;
    if (!transactions.length)
      return <Typography>No transactions available</Typography>;

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#4a5a23" }}>
              <TableCell>Amount in USDT</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .filter(
                (transaction: Transaction) =>
                  transaction.symbol === selectedHolding
              )
              .map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.paidAmount}</TableCell>
                  <TableCell>{transaction.executed}</TableCell>
                  <TableCell>{transaction.price}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      <Select
        value={selectedHolding}
        onChange={handleHoldingChange}
        style={{ marginBottom: "1rem" }}
      >
        {transactions.map((transaction: Transaction) => (
          <MenuItem key={transaction.symbol} value={transaction.symbol}>
            {transaction.symbol}
          </MenuItem>
        ))}
      </Select>

      <Paper style={{ marginBottom: "1rem", padding: "1rem" }}>
        <Typography variant="h6">Holding Stats</Typography>
        {renderHoldingDetails()}
      </Paper>

      <Typography variant="h6" style={{ marginBottom: "1rem" }}>
        Transactions per holding
      </Typography>
      {renderTransactions()}
    </div>
  );
};

export default HoldingComponent;
