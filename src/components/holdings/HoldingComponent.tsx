// src/components/holdings/HoldingComponent.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchHoldingDetails } from "../../redux/slices/holdingDetailsSlice";
import {
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { HoldingDto } from "../../redux/types/types";
import TransactionList from "../transactions/TransactionList";

const HoldingComponent = () => {
  const { portfolioName, symbol } = useParams<{
    portfolioName: string;
    symbol: string;
  }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedHolding, setSelectedHolding] = useState<string>(symbol || "");
  const [holding, setHolding] = useState<HoldingDto>();
  const { status: holdingStatus, error: holdingError } = useAppSelector(
    (state) => state.holdingDetails
  );
  const [transactions, setTransactions] = useState<Transaction[]>();
  const { status: transactionStatus, error: transactionError } = useAppSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    const fetchHolding = async () => {
      if (portfolioName && selectedHolding) {
        const response = await dispatch(
          fetchHoldingDetails({ portfolioName, symbol: selectedHolding })
        );
        setHolding(response.payload as HoldingDto);
      }
    };
    fetchHolding();
  }, [dispatch, portfolioName, selectedHolding]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (selectedHolding) {
        const response = await dispatch(
          fetchTransactionsBySymbol(selectedHolding)
        );
        setTransactions(response.payload as Transaction[]);
      }
    };
    fetchTransactions();
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

    return (
      <>
        {!!holding && (
          <div>
            <Typography>Amount: {holding.amount}</Typography>
            <Typography>
              Total Amount Bought: {holding.totalAmountBought}
            </Typography>
            <Typography>
              Total Amount Sold: {holding.totalAmountSold}
            </Typography>
            <Typography>Price in BTC: {holding.priceInBtc}</Typography>
            <Typography>Price in USDT: {holding.priceInUsdt}</Typography>
            <Typography>Amount in BTC: {holding.amountInBtc}</Typography>
            <Typography>Amount in USDT: {holding.amountInUsdt}</Typography>
            <Typography>Percentage: {holding.percentage}</Typography>
            <Typography>
              Stable Total Cost: {holding.stableTotalCost}
            </Typography>
            <Typography>
              Total Realized Profit USDT: {holding.totalRealizedProfitUsdt}
            </Typography>
            <Typography>
              Current Position in USDT: {holding.currentPositionInUsdt}
            </Typography>
          </div>
        )}
      </>
    );
  };

  const renderTransactions = () => {
    if (transactionStatus === "loading") return <CircularProgress />;
    if (transactionStatus === "failed")
      return <Alert severity="error">{transactionError}</Alert>;

    return <TransactionList />;
  };

  return (
    <div>
      <Select
        value={selectedHolding}
        onChange={handleHoldingChange}
        style={{ marginBottom: "1rem" }}
      >
        {/* {transactions?.map((transaction: Transaction) => (
          <MenuItem key={transaction.symbol} value={transaction.symbol}>
            {transaction.symbol}
          </MenuItem>
        ))} */}
      </Select>

      <Paper style={{ marginBottom: "1rem", padding: "1rem" }}>
        <Typography variant="h6">Holding Stats</Typography>
        {renderHoldingDetails()}
      </Paper>

      <Typography variant="h6" style={{ marginBottom: "1rem" }}>
        Transactions per holding
      </Typography>
      {transactions && renderTransactions()}
    </div>
  );
};

export default HoldingComponent;
