// src/components/transactions/TransactionsPage.tsx
import { Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import TransactionList from './TransactionList';
import { useAppDispatch } from '../../redux/hooks';
import { fetchTransactions } from '../../redux/slices/transactionSlice';

const TRANSACTION_LIST_HEIGHT = '72vh';

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
      <TransactionList maxTableHeight={TRANSACTION_LIST_HEIGHT} />
    </Container>
  );
};

export default TransactionsPage;
