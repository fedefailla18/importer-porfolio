import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import {
  Box,
  Container,
  Divider,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import React from 'react';

const steps = [
  {
    label: 'Create or choose a portfolio',
    body: 'Start in Portfolio Center. Keep separate portfolios for each strategy or exchange.',
  },
  {
    label: 'Load your transaction history',
    body: 'Use CSV/Excel upload or manual entries. Data quality here determines accounting quality.',
  },
  {
    label: 'Run portfolio calculations',
    body: 'Use "Calculate Distribution" to refresh holdings, values, and allocation percentages.',
  },
  {
    label: 'Process missing transactions',
    body: 'Use "Fetch Missing Transactions" to run accounting processing for unprocessed records.',
  },
  {
    label: 'Sync with Binance or MexC (optional)',
    body: 'Add read-only API keys in Settings. Then press "Sync from Binance" or "Sync from MexC" on the portfolio page. Incremental sync fetches only trades newer than the last sync. Use full historical sync to backfill a date range from scratch.',
  },
  {
    label: 'Interpret P&L and cashflow',
    body: 'Use Data Dictionary to distinguish total buy/sell cashflow vs realized/unrealized P&L.',
  },
];

const ManualUserPage = () => {
  return (
    <Container maxWidth='md' sx={{ py: 2 }}>
      <Typography variant='h4' gutterBottom>
        Manual User Guide
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
        Practical workflow for all investor profiles, from first-time users to advanced portfolio
        analysts.
      </Typography>

      <Paper variant='outlined' sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ChecklistIcon color='primary' />
          <Typography variant='subtitle1' fontWeight={700}>
            Operating Sequence
          </Typography>
        </Box>
        <Stepper orientation='vertical' nonLinear>
          {steps.map((step, idx) => (
            <Step active key={step.label}>
              <StepLabel>
                <Typography variant='subtitle2'>
                  {idx + 1}. {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant='body2' color='text.secondary'>
                  {step.body}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Divider sx={{ my: 2 }} />

      <Paper variant='outlined' sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CloudSyncIcon color='secondary' />
          <Typography variant='subtitle1' fontWeight={700}>
            Sync Safety Rules
          </Typography>
        </Box>
        <Typography variant='body2' color='text.secondary'>
          Use read-only API keys. Start with incremental sync. Use full historical sync only when
          you need a complete rebuild or after correcting historical data gaps.
        </Typography>
      </Paper>

      <Paper variant='outlined' sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <SyncAltIcon color='primary' />
          <Typography variant='subtitle1' fontWeight={700}>
            Daily Routine (Quick)
          </Typography>
        </Box>
        <Typography variant='body2' color='text.secondary'>
          Sync Binance / MexC → Fetch Missing Transactions → Calculate Distribution → Review P&amp;L
          cards.
        </Typography>
      </Paper>

      <Paper variant='outlined' sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AccountBalanceIcon color='primary' />
          <Typography variant='subtitle1' fontWeight={700}>
            InvertirOnline (IOL)
          </Typography>
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
          IOL is an Argentine brokerage. Configure credentials in Settings (username → API Key,
          password → API Secret). Once connected, the IOL tab shows your Argentine and US market
          holdings, ARS/USD account balances, and full operations history.
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Data is read-only — IOL credentials are only used to query your account, never to place
          orders.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ManualUserPage;
