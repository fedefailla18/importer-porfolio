// src/components/transactions/AllTransactionsPage.tsx
import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import TransactionList from './TransactionList';

const AllTransactionsPage = () => {
  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        All Transactions
      </Typography>
      <Button
        component={RouterLink}
        to='/add-transaction'
        variant='contained'
        color='primary'
        sx={{ marginBottom: '1rem' }}
      >
        Add Transaction
      </Button>
      <TransactionList />
    </Container>
  );
};

export default AllTransactionsPage;
