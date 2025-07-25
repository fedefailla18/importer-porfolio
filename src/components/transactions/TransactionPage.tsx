// src/components/transactions/TransactionsPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { fetchTransactions } from '../../redux/slices/transactionSlice';
import { Container, Typography } from '@mui/material';
import TransactionList from './TransactionList';

const TransactionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page,
        size: 0,
      })
    );
  }, [dispatch, page]);

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        All Transactions
      </Typography>
      <TransactionList />
    </Container>
  );
};

export default TransactionsPage;
