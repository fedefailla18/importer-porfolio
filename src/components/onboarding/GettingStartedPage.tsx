// src/components/onboarding/GettingStartedPage.tsx
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const steps = [
  {
    icon: <PersonAddIcon />,
    label: 'Create your account',
    description:
      'Register with a username, email, and password. Your account is the secure container for all your portfolios and transactions.',
    detail: null,
    action: { label: 'Register now', to: '/register' },
  },
  {
    icon: <LoginIcon />,
    label: 'Sign in',
    description:
      'Log in to access your personal dashboard. InvestTracker uses JWT tokens — your session is secure and stateless.',
    detail: null,
    action: { label: 'Sign in', to: '/login' },
  },
  {
    icon: <CreateNewFolderIcon />,
    label: 'Create a portfolio',
    description:
      'A portfolio groups your holdings by exchange or strategy (e.g. "Binance", "MexC", "Cold Wallet"). You can have multiple portfolios.',
    detail:
      'From the dashboard, click "New Portfolio" and give it a name. You can create as many as you need.',
    action: null,
  },
  {
    icon: <UploadFileIcon />,
    label: 'Upload your transactions',
    description:
      'Import your trade history by uploading a CSV or Excel export from your exchange. Binance and MexC formats are natively supported.',
    detail: (
      <Box sx={{ mt: 1 }}>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Supported formats:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label='Binance CSV' size='small' color='primary' variant='outlined' />
          <Chip label='MexC CSV' size='small' color='primary' variant='outlined' />
          <Chip label='Excel (.xlsx)' size='small' color='primary' variant='outlined' />
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1.5 }}>
          Alternatively, add transactions manually via the "Add Transaction" button — useful for OTC
          trades or on-chain swaps.
        </Typography>
      </Box>
    ),
    action: null,
  },
  {
    icon: <PieChartIcon />,
    label: 'View your portfolio distribution',
    description:
      'Once transactions are imported, InvestTracker calculates your current holdings for each asset — including current market value in USDT and BTC, and your share of the total portfolio.',
    detail:
      'Holdings are recalculated from your full transaction history using the weighted-average cost basis method.',
    action: null,
  },
  {
    icon: <TrendingUpIcon />,
    label: 'Track realized and unrealized P&L',
    description:
      'For each asset you can see your cost basis, realized profit from past sells, and unrealized profit on your current position.',
    detail: (
      <Box sx={{ mt: 1 }}>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Accounting rules:
        </Typography>
        <Box component='ul' sx={{ mt: 0, pl: 2 }}>
          <Typography component='li' variant='body2' color='text.secondary'>
            <strong>Cost basis</strong> — weighted average of all BUY transactions
          </Typography>
          <Typography component='li' variant='body2' color='text.secondary'>
            <strong>Realized P&L</strong> — recognized immediately on each SELL
          </Typography>
          <Typography component='li' variant='body2' color='text.secondary'>
            <strong>Unrealized P&L</strong> — live market value minus remaining cost basis
          </Typography>
          <Typography component='li' variant='body2' color='text.secondary'>
            <strong>Crypto-to-crypto trades</strong> — treated as simultaneous sell + buy in USDT
            terms
          </Typography>
        </Box>
      </Box>
    ),
    action: null,
  },
];

const GettingStartedPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 6 }}>
      <Container maxWidth='md'>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant='h1' gutterBottom sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
            InvestTracker
          </Typography>
          <Typography variant='h6' color='text.secondary' sx={{ maxWidth: 560, mx: 'auto' }}>
            A crypto portfolio tracker that ingests your trade history, calculates your cost basis,
            and shows realized &amp; unrealized P&amp;L across all your exchanges.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to='/register'
              variant='contained'
              size='large'
              startIcon={<PersonAddIcon />}
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to='/login'
              variant='outlined'
              size='large'
              startIcon={<LoginIcon />}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* Steps */}
        <Typography variant='h2' gutterBottom sx={{ fontSize: '1.5rem', mb: 3 }}>
          How it works
        </Typography>

        <Stepper orientation='vertical' nonLinear>
          {steps.map((step, index) => (
            <Step key={step.label} active>
              <StepLabel
                icon={
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(step.icon, { fontSize: 'small' })}
                  </Box>
                }
              >
                <Typography variant='subtitle1' fontWeight={600}>
                  {index + 1}. {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ pb: 2 }}>
                  <Typography variant='body1'>{step.description}</Typography>
                  {step.detail && typeof step.detail === 'string' && (
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                      {step.detail}
                    </Typography>
                  )}
                  {step.detail && typeof step.detail !== 'string' && step.detail}
                  {step.action && (
                    <Button
                      component={RouterLink}
                      to={step.action.to}
                      variant='contained'
                      size='small'
                      sx={{ mt: 2 }}
                    >
                      {step.action.label}
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* Footer CTA */}
        <Paper elevation={0} sx={{ mt: 6, p: 3, bgcolor: 'primary.main', borderRadius: 2 }}>
          <Typography variant='h6' color='white' gutterBottom>
            Ready to start?
          </Typography>
          <Typography variant='body2' color='rgba(255,255,255,0.85)' gutterBottom>
            Register an account, upload your first CSV export, and see your full portfolio in
            minutes.
          </Typography>
          <Button
            component={RouterLink}
            to='/register'
            variant='contained'
            sx={{
              mt: 1,
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Create Account
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default GettingStartedPage;
