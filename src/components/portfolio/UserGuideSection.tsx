// src/components/portfolio/UserGuideSection.tsx
import CalculateIcon from '@mui/icons-material/Calculate';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import SyncIcon from '@mui/icons-material/Sync';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const workflowSteps = [
  {
    icon: <CreateNewFolderIcon fontSize='small' />,
    label: 'Create a portfolio',
    description:
      'Click "Create Portfolio" above to create a named group for your holdings. Organise by exchange or strategy — e.g. "Binance", "MexC", "Cold Wallet". You can have as many portfolios as you need.',
  },
  {
    icon: <UploadFileIcon fontSize='small' />,
    label: 'Import your transactions',
    description: 'Three ways to add trade history:',
    detail: (
      <Box sx={{ mt: 1 }}>
        <Box component='ul' sx={{ m: 0, pl: 2 }}>
          <Typography component='li' variant='body2' color='text.secondary'>
            <strong>Upload CSV / Excel</strong> — export from Binance or MexC and drag it into the
            portfolio. Native support for both exchange formats.
          </Typography>
          <Typography component='li' variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
            <strong>Binance API sync</strong> — connect read-only API keys in{' '}
            <Button
              component={Link}
              to='/settings'
              size='small'
              sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline' }}
            >
              Settings
            </Button>{' '}
            and then press "Sync from Binance" on the portfolio page. Incremental — only fetches
            trades newer than the last sync.
          </Typography>
          <Typography component='li' variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
            <strong>Manual entry</strong> — useful for OTC deals or on-chain swaps not covered by
            exchange exports.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
          <Chip label='Binance CSV' size='small' variant='outlined' color='primary' />
          <Chip label='MexC CSV' size='small' variant='outlined' color='primary' />
          <Chip label='Excel (.xlsx)' size='small' variant='outlined' color='primary' />
          <Chip label='Binance API' size='small' variant='outlined' color='secondary' />
        </Box>
      </Box>
    ),
  },
  {
    icon: <CalculateIcon fontSize='small' />,
    label: 'Calculate your distribution',
    description:
      'Open the portfolio, then press "Calculate Distribution". This recalculates holdings from the full transaction history and updates the USDT / BTC valuations and percentage allocations per asset.',
  },
  {
    icon: <SyncIcon fontSize='small' />,
    label: 'Process missing transactions',
    description:
      'Press "Fetch Missing Transactions" to run the cost-basis engine over any transactions that haven\'t been processed yet. The status chip on each transaction row shows Processed / Unprocessed at a glance.',
  },
  {
    icon: <TrendingUpIcon fontSize='small' />,
    label: 'Track your P&L',
    description:
      'The holdings table shows open-position cost basis, current position value, and realised profit for every asset. The stats panel also separates gross BUY spend from gross SELL proceeds for the whole portfolio.',
  },
];

const accountingFacts = [
  {
    term: 'Cost basis',
    explanation:
      'Weighted average of all BUY transactions for an asset. Buying the same asset at different prices blends into a single reference price.',
    example: 'Buy 0.5 BTC at $20 000 and 0.5 BTC at $30 000 → cost basis = $25 000.',
  },
  {
    term: 'Total Buy Spend',
    explanation:
      'Gross USDT value deployed into BUY transactions across the portfolio. This is a cashflow metric, not a cost-basis metric.',
    example: 'Buy $10 000 of BTC and later $5 000 of ETH → total buy spend = $15 000.',
  },
  {
    term: 'Total Sell Proceeds',
    explanation:
      'Gross USDT value received from SELL transactions across the portfolio. This is revenue from sells before subtracting any buy cost basis.',
    example: 'Sell BTC for $16 000 and ETH for $2 500 → total sell proceeds = $18 500.',
  },
  {
    term: 'Realized P&L',
    explanation:
      'Locked in the moment you SELL. Calculated as sale proceeds minus the proportional cost basis of the units sold. This is different from gross sell proceeds.',
    example: 'Sell 0.4 BTC at $40 000 with a $25 000 cost basis → realized profit = $6 000.',
  },
  {
    term: 'Unrealized P&L',
    explanation: 'Live market value of your remaining position minus its remaining cost basis.',
    example: 'Hold 0.6 BTC worth $36 000 with $15 000 cost → unrealized profit = $21 000.',
  },
  {
    term: 'Crypto-to-crypto trades',
    explanation:
      'Treated as two simultaneous events: a SELL of the base asset and a BUY of the quote asset, both converted to USDT at trade time. Cost basis is correctly updated for both sides.',
    example: 'Buying ETH with BTC registers a BTC sell and an ETH buy at their USDT equivalent.',
  },
];

const UserGuideSection: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Divider sx={{ mb: 4 }} />
      <Typography variant='h5' fontWeight={700} gutterBottom>
        User Guide
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
        Expand a section to learn how InvestTracker works and how to get the most out of it.
      </Typography>

      {/* Core workflow */}
      <Accordion
        expanded={expanded === 'workflow'}
        onChange={handleChange('workflow')}
        variant='outlined'
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Core workflow — start here</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stepper orientation='vertical' nonLinear>
            {workflowSteps.map((step, index) => (
              <Step key={step.label} active>
                <StepLabel
                  icon={
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.icon}
                    </Box>
                  }
                >
                  <Typography variant='subtitle2' fontWeight={600}>
                    {index + 1}. {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ pb: 2 }}>
                    <Typography variant='body2'>{step.description}</Typography>
                    {step.detail && step.detail}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </AccordionDetails>
      </Accordion>

      {/* Binance API sync */}
      <Accordion
        expanded={expanded === 'binance'}
        onChange={handleChange('binance')}
        variant='outlined'
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography fontWeight={600}>Binance API sync</Typography>
            <Chip label='New' color='secondary' size='small' />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Connect read-only Binance API keys to let InvestTracker automatically fetch and import
            your trade history — no CSV exports needed.
          </Typography>

          <Stepper orientation='vertical' nonLinear>
            {[
              {
                icon: <SettingsIcon fontSize='small' />,
                label: 'Connect your API keys',
                body: (
                  <>
                    Go to{' '}
                    <Button
                      component={Link}
                      to='/settings'
                      size='small'
                      sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline' }}
                    >
                      Settings → Exchange Settings
                    </Button>{' '}
                    and enter your Binance API Key and API Secret. Use{' '}
                    <strong>read-only keys with no withdrawal permissions</strong>. Your secret is
                    encrypted at rest (AES) and is never returned by the API.
                  </>
                ),
              },
              {
                icon: <SyncIcon fontSize='small' />,
                label: 'Trigger a sync',
                body: 'Open any portfolio and press "Sync from Binance". The system discovers all assets with a non-zero balance on your Binance account, finds the relevant trading pairs, and fetches every trade.',
              },
              {
                icon: <TrendingUpIcon fontSize='small' />,
                label: 'Incremental updates',
                body: 'The sync is incremental. After the first full import, subsequent syncs only fetch trades newer than the last sync timestamp — keeping things fast and within Binance API rate limits.',
              },
              {
                icon: <CalculateIcon fontSize='small' />,
                label: 'Process your P&L',
                body: 'After syncing, click "Fetch Missing Transactions" to run the cost-basis engine over the newly imported trades and update your holdings.',
              },
            ].map((step, index) => (
              <Step key={step.label} active>
                <StepLabel
                  icon={
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'secondary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.icon}
                    </Box>
                  }
                >
                  <Typography variant='subtitle2' fontWeight={600}>
                    {index + 1}. {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant='body2' sx={{ pb: 2 }}>
                    {step.body}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          <Paper
            variant='outlined'
            sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderColor: 'warning.200' }}
          >
            <Typography variant='body2' color='text.secondary'>
              <strong>Tip:</strong> Binance API keys must have <em>Read Info</em> and{' '}
              <em>Read Spot &amp; Margin Trading</em> permissions. Disable all write and withdrawal
              permissions for maximum security.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Accounting model */}
      <Accordion
        expanded={expanded === 'accounting'}
        onChange={handleChange('accounting')}
        variant='outlined'
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Accounting model — how P&amp;L is calculated</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            InvestTracker uses the <strong>weighted-average cost basis</strong> method. All
            calculations are performed in USDT.
          </Typography>
          <Grid container spacing={2}>
            {accountingFacts.map(fact => (
              <Grid item xs={12} sm={6} key={fact.term}>
                <Paper variant='outlined' sx={{ p: 2, height: '100%' }}>
                  <Typography variant='subtitle2' fontWeight={700} gutterBottom>
                    {fact.term}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' gutterBottom>
                    {fact.explanation}
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.disabled'
                    sx={{ fontStyle: 'italic', display: 'block' }}
                  >
                    {fact.example}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Supported exchanges */}
      <Accordion
        expanded={expanded === 'exchanges'}
        onChange={handleChange('exchanges')}
        variant='outlined'
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Supported exchanges &amp; file formats</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {[
              {
                name: 'Binance',
                methods: ['CSV export', 'Excel (.xlsx)', 'Direct API sync'],
                notes: 'Export from Account → Transaction History → Generate All Statements.',
              },
              {
                name: 'MexC',
                methods: ['CSV export'],
                notes: 'Export from Orders → Spot Orders → Export.',
              },
            ].map(exchange => (
              <Grid item xs={12} sm={6} key={exchange.name}>
                <Paper variant='outlined' sx={{ p: 2 }}>
                  <Typography variant='subtitle2' fontWeight={700} gutterBottom>
                    {exchange.name}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    {exchange.methods.map(m => (
                      <Chip
                        key={m}
                        label={m}
                        size='small'
                        variant='outlined'
                        color={m.includes('API') ? 'secondary' : 'primary'}
                      />
                    ))}
                  </Box>
                  <Typography variant='caption' color='text.secondary'>
                    {exchange.notes}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default UserGuideSection;
