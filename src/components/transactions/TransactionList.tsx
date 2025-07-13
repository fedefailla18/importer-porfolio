import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  fetchTransactions,
  FetchTransactionsParams,
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
  TableSortLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { RootState } from "../../redux/store";
import FilterComponent from "./FilterComponent";
import Pagination from "../common/Pagination";
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
  const { transactions, status, error, pagination } = useAppSelector(
    (state: RootState) => state.transactions
  );

  const [filters, setFilters] = useState<FetchTransactionsParams>({
    symbol: symbol || undefined,
    startDate: undefined,
    endDate: undefined,
    portfolioName: portfolioName || undefined,
    side: undefined,
    paidWith: undefined,
    paidAmountOperator: "eq",
    paidAmount: undefined,
    page: 0,
    size: 10,
    sort: "dateUtc,desc",
  });

  const [isInitialLoad, setIsInitialLoad] = useState(false);

  const loadTransactions = () => {
    dispatch(fetchTransactions(filters));
  };

  const handleRowsPerPageChange = (event: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      size: event.target.value as number,
      page: 0,
    }));
  };

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const handlePageChange = (page: number) => {
    setFilters((prevFilters) => ({ ...prevFilters, page: page - 1 }));
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
      page: 0,
    }));
  };

  const handleSort = (property: string) => {
    const isAsc =
      filters.sort?.split(",")[0] === property &&
      filters.sort?.split(",")[1] === "asc";
    const newSort = `${property},${isAsc ? "desc" : "asc"}`;
    setFilters((prevFilters) => ({ ...prevFilters, sort: newSort, page: 0 }));
  };

  const handleApplyFilters = () => {
    loadTransactions();
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
      <TableContainer component={Paper} sx={{ 
        maxHeight: "60vh", 
        overflow: "auto",
        "& .MuiTableBody-root": {
          "& .MuiTableRow-root:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableSortLabel
                active={filters.sort?.split(",")[0] === "dateUtc"}
                direction={filters.sort?.split(",")[1] as "asc" | "desc"}
                onClick={() => handleSort("dateUtc")}
              >
                Date
              </TableSortLabel>
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
            {transactions.length > 0 ? (
              transactions.map((transaction: Transaction, index: number) => (
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
              ))
            ) : (
              <Typography>No records were found</Typography>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={filters.size}
            onChange={(e) => handleRowsPerPageChange(e)}
            label="Rows per page"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
        <Pagination
          currentPage={pagination.currentPage + 1}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Container>
  );
};

export default TransactionList;
