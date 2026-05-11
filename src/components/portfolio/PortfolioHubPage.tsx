import {
  AccountBalance as PortfolioIcon,
  ReceiptLong as TransactionsIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAllPortfolios } from '../../redux/slices/portfolioSlice';
import { RootState } from '../../redux/store';

const PortfolioHubPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const username = useAppSelector((state: RootState) => state.auth.user?.username);
  const { portfolios, status } = useAppSelector((state: RootState) => state.portfolio);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllPortfolios());
    }
  }, [status, dispatch]);

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4' fontWeight={700} gutterBottom>
          {username ? `Welcome back, ${username}` : 'Portfolio Management'}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 620 }}>
          Your consolidated investment workspace. Track holdings, cost basis, and realized and
          unrealized P&amp;L across all portfolios. Review your full transaction history and audit
          cost-basis calculations in one place.
        </Typography>
      </Box>

      {status === 'succeeded' && portfolios.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography variant='h5' fontWeight={700} color='primary'>
            {portfolios.length}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {portfolios.length === 1 ? 'Active portfolio' : 'Active portfolios'}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            variant='outlined'
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: 3 },
            }}
            onClick={() => navigate('/portfolio')}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <PortfolioIcon color='primary' sx={{ fontSize: 32 }} />
                <Typography variant='h6' fontWeight={700}>
                  My Portfolios
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                Create and manage portfolios. Upload trade files, connect exchange accounts, and
                drill into individual holdings with full cost-basis and P&amp;L breakdowns.
              </Typography>
              {status === 'succeeded' && portfolios.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={`${portfolios.length} portfolio${portfolios.length !== 1 ? 's' : ''}`}
                    size='small'
                    color='primary'
                    variant='outlined'
                  />
                </Box>
              )}
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button variant='contained' size='small'>
                Open Portfolios
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            variant='outlined'
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: 3 },
            }}
            onClick={() => navigate('/transactions')}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <TransactionsIcon color='primary' sx={{ fontSize: 32 }} />
                <Typography variant='h6' fontWeight={700}>
                  Transaction History
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                Inspect and filter your complete trade record across all portfolios. Verify
                execution details, review buy and sell entries, and audit cost-basis calculations.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button variant='contained' size='small'>
                View Transactions
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PortfolioHubPage;
