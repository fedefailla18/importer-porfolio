import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import React from 'react';

const dictionary = [
  {
    term: 'Current Portfolio Value',
    definition: 'Live market value of all currently held assets in the portfolio.',
  },
  {
    term: 'Total Buy Spend',
    definition: 'Gross amount spent on BUY transactions. Cash-out metric, not cost basis.',
  },
  {
    term: 'Total Sell Proceeds',
    definition: 'Gross amount received from SELL transactions before accounting offsets.',
  },
  {
    term: 'Open Cost Basis',
    definition: 'Remaining cost basis for units still held after sold amounts are accounted for.',
  },
  {
    term: 'Total Realized P&L',
    definition: 'Profit/loss locked in by executed SELL transactions.',
  },
  {
    term: 'Open Unrealized P&L',
    definition: 'Paper profit/loss on current holdings at latest market prices.',
  },
  {
    term: 'Net Capital from Pocket',
    definition: 'External cash needed: Total Buys minus Total Sell Proceeds.',
  },
  {
    term: 'Net Return vs Capital',
    definition:
      'Portfolio growth relative to your own invested cash: (Current Value + Sells) - Buys.',
  },
  {
    term: 'Fetch Missing Transactions',
    definition:
      'Processes transactions that exist but are not yet fully accounted into holdings and P&L.',
  },
  {
    term: 'Exchange API Sync (Binance / MexC)',
    definition:
      'Incremental import of new trades since the last sync timestamp. Requires read-only API keys configured in Settings.',
  },
  {
    term: 'Full Historical Sync',
    definition:
      'Backfills complete trade history for a selected date range. Supported for both Binance and MexC. Use when doing an initial import or repairing historical data gaps.',
  },
];

const DataDictionaryPage = () => {
  return (
    <Container maxWidth='lg' sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant='h4' gutterBottom>
          Data Dictionary
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Plain-language definitions for every major metric and sync action.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {dictionary.map(item => (
          <Grid item xs={12} md={6} key={item.term}>
            <Paper variant='outlined' sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MenuBookIcon fontSize='small' color='primary' />
                <Typography variant='subtitle1' fontWeight={700}>
                  {item.term}
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                {item.definition}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DataDictionaryPage;
