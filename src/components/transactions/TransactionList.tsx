import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchTransactions } from "../../redux/slices/transactionSlice";
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
  Pagination,
} from "@mui/material";
import { RootState } from "../../redux/store";
import FilterComponent from "../common/FilterComponent";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import { Transaction } from "../../redux/types/types";

interface TransactionListProps {
  symbol?: string;
  portfolioName?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  symbol,
  portfolioName,
}) => {
  const dispatch = useAppDispatch();
  const {
    items: transactions,
    status,
    error,
    pagination,
  } = useAppSelector((state: RootState) => state.transactions);

  const [filters, setFilters] = useState({
    symbol: symbol || "",
    startDate: "",
    endDate: "",
    portfolioName: portfolioName || "",
    side: "",
    paidWith: "",
    paidAmountOperator: "eq",
    paidAmount: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: pagination.currentPage,
        size: pagination.itemsPerPage,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handlePageChange = (page: number) => {
    dispatch(fetchTransactions({ page, size: pagination.itemsPerPage }));
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };

  const handleApplyFilters = () => {
    setPage(1);
    dispatch(
      fetchTransactions({
        ...filters,
        page: 0,
        size: pageSize,
      })
    );
  };

  const formatDate = (dateUtc: string | undefined) => {
    if (!dateUtc) return "N/A";
    try {
      return format(parseISO(dateUtc), "yyyy-MM-dd HH:mm:ss");
    } catch (error) {
      console.error("Error parsing date:", dateUtc, error);
      return "Invalid Date";
    }
  };

  if (status === "loading") {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (status === "failed") {
    toast.error(`The request faile.  ${error}`);
    return (
      <Container>
        <TableContainer component={Paper}>
          <Typography>No records were found</Typography>
        </TableContainer>
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
            {transactions.map((transaction: Transaction, index: number) => (
              <TableRow key={index}>
                <TableCell>{formatDate(transaction.dateUtc)}</TableCell>
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
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default TransactionList;
