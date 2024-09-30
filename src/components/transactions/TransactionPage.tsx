// src/components/transactions/TransactionsPage.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchTransactions } from "../../redux/slices/transactionSlice";
import { Container, Typography, Pagination } from "@mui/material";
import TransactionList from "./TransactionList";

const TransactionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { totalPages } = useAppSelector((state) => state.transactions);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page,
        limit: 10,
        size: 0,
      })
    );
  }, [dispatch, page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        All Transactions
      </Typography>
      <TransactionList />
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default TransactionsPage;
