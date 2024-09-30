// src/components/transactions/TransactionList.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  fetchTransactions,
  Transaction,
} from "../../redux/slices/transactionSlice";
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
  Pagination,
} from "@mui/material";
import { RootState } from "../../redux/store";
import FilterComponent from "../common/FilterComponent";
import { format } from "date-fns/format";
import { parseISO } from "date-fns";

interface TransactionListProps {
  symbol?: string;
  portfolioName?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  symbol,
  portfolioName,
}) => {
  const dispatch = useAppDispatch();
  const { transactions, status, error, totalPages, currentPage } =
    useAppSelector((state: RootState) => state.transactions);
  const [filters, setFilters] = useState({
    symbol: symbol || "",
    startDate: "",
    endDate: "",
    portfolioName: portfolioName || "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        ...filters,
        page: page - 1,
        size: pageSize,
        limit: 0,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };

  const handleApplyFilters = () => {
    setPage(currentPage);
    dispatch(
      fetchTransactions({
        ...filters,
        page: 0,
        size: pageSize,
        limit: 0,
      })
    );
  };

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
        Transactions
      </Typography>
      <FilterComponent
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
      />
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
            {transactions.map((transaction: Transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(parseISO(transaction.dateUtc), "yyyy-MM-dd HH:mm:ss")}{" "}
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
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default TransactionList;
