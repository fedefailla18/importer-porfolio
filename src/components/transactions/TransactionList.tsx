// src/components/transactions/TransactionList.tsx
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchTransactions } from "../../redux/slices/transactionSlice";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { RootState } from "../../redux/store";

const TransactionList: React.FC = () => {
  const { portfolioName } = useParams<{ portfolioName: string }>();
  const dispatch = useAppDispatch();
  const { transactions, status, error } = useAppSelector(
    (state: RootState) => state.transactions
  );

  useEffect(() => {
    if (portfolioName) {
      dispatch(fetchTransactions(portfolioName));
    }
  }, [dispatch, portfolioName]);

  if (status === "loading") {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (status === "failed") {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Transactions for {portfolioName}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Side</TableCell>
              <TableCell>Pair</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Executed</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Paid With</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Fee Amount</TableCell>
              <TableCell>Fee Symbol</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.dateUtc).toLocaleString()}
                </TableCell>
                <TableCell>{transaction.side}</TableCell>
                <TableCell>{transaction.pair}</TableCell>
                <TableCell>{transaction.price}</TableCell>
                <TableCell>{transaction.executed}</TableCell>
                <TableCell>{transaction.symbol}</TableCell>
                <TableCell>{transaction.paidWith}</TableCell>
                <TableCell>{transaction.paidAmount}</TableCell>
                <TableCell>{transaction.feeAmount}</TableCell>
                <TableCell>{transaction.feeSymbol}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TransactionList;
