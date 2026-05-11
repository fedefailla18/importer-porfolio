import { KeyboardArrowRight as ArrowIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchExchangeConfigs } from '../../redux/slices/exchangeConfigSlice';
import { RootState } from '../../redux/store';
import { ExchangeName } from '../../redux/types/types';

interface ExchangeCard {
  key: ExchangeName;
  name: string;
  tagline: string;
  description: string;
  to: string;
}

const EXCHANGE_CARDS: ExchangeCard[] = [
  {
    key: 'BINANCE',
    name: 'Binance',
    tagline: 'Spot Trading & Order History',
    description:
      'View your spot trades, order fills, and account activity fetched directly from the Binance API. Data reflects exactly what Binance has recorded — no transformations applied.',
    to: '/binance-activity',
  },
  {
    key: 'MEXC',
    name: 'MEXC',
    tagline: 'Spot Trades & Deposits',
    description:
      'Access your MEXC spot trading history, deposits, and withdrawal records as reported directly by the MEXC exchange API.',
    to: '/mexc-activity',
  },
  {
    key: 'IOL',
    name: 'InvertirOnline',
    tagline: 'Argentine Brokerage Account',
    description:
      'Browse your IOL portfolio holdings in ARS and USD, full account balances across all sub-accounts, and your complete operations history from the InvertirOnline brokerage platform.',
    to: '/iol',
  },
];

const ExchangesLandingPage = () => {
  const dispatch = useAppDispatch();
  const { configs, fetchStatus } = useAppSelector((state: RootState) => state.exchangeConfig);

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchExchangeConfigs());
    }
  }, [fetchStatus, dispatch]);

  const formatDate = (ts: number | null) => {
    if (!ts) return null;
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4' fontWeight={700} gutterBottom>
          Exchange Integrations
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 620 }}>
          Raw account data surfaced directly from your connected exchange and brokerage accounts.
          Information here reflects what each platform API reports — it is not processed through
          your portfolio accounting model.
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1.5 }}>
          To connect or update credentials, visit{' '}
          <Link component={RouterLink} to='/settings' underline='hover'>
            Settings → Exchange Settings
          </Link>
          .
        </Typography>
      </Box>

      {fetchStatus === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {EXCHANGE_CARDS.map(({ key, name, tagline, description, to }) => {
          const cfg = configs.find(c => c.exchangeName === key);
          const connected = Boolean(cfg);
          return (
            <Grid item xs={12} md={4} key={key}>
              <Card
                variant='outlined'
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 3 },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant='h6' fontWeight={700}>
                      {name}
                    </Typography>
                    <Chip
                      label={connected ? 'Connected' : 'Not connected'}
                      color={connected ? 'success' : 'default'}
                      size='small'
                    />
                  </Box>
                  <Typography variant='subtitle2' color='primary.main' sx={{ mb: 1 }}>
                    {tagline}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {description}
                  </Typography>
                  {cfg?.lastSyncTimestamp && (
                    <Typography
                      variant='caption'
                      color='text.disabled'
                      sx={{ display: 'block', mt: 2 }}
                    >
                      Last sync: {formatDate(cfg.lastSyncTimestamp)}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={RouterLink}
                    to={to}
                    variant={connected ? 'contained' : 'outlined'}
                    endIcon={<ArrowIcon />}
                    fullWidth
                  >
                    {connected ? `Open ${name}` : `View ${name}`}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ExchangesLandingPage;
