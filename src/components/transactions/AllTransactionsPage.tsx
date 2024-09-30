// src/components/transactions/AllTransactionsPage.tsx
import React from "react";
import { Typography } from "@mui/material";
import TransactionList from "./TransactionList";

const AllTransactionsPage: React.FC = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        All Transactions
      </Typography>
      <TransactionList />
    </>
  );
};

export default AllTransactionsPage;
