import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RefreshIcon from '@mui/icons-material/Refresh';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SyncIcon from '@mui/icons-material/Sync';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  styled,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMexcSpotActivity } from '../../redux/slices/mexcSpotActivitySlice';
import { RootState } from '../../redux/store';
import { MexcSpotTradeRow } from '../../redux/types/types';
import BinanceSyncDialog from '../common/BinanceSyncDialog';
import Pagination from '../common/Pagination';

// See BinanceSpotActivityPage's BINANCE_PORTFOLIO_NAME — same reasoning, MexC's own default.
const MEXC_PORTFOLIO_NAME = 'MEXC';

const StyledTableContainer = styled(TableContainer)({
  maxHeight: '72vh',
  overflow: 'auto',
  '& table': {
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
});

const StickyHeaderCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  backgroundColor: theme.palette?.background?.paper || '#fff',
  fontWeight: 600,
}));

const PAGE_SIZE = 25;

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const formatBtc = (value?: number) => {
  if (value === undefined || value === null) return '-';
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(value)} BTC`;
};

const MexcSpotActivityPage = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state: RootState) => state.mexcSpotActivity);
  const [symbolFilter, setSymbolFilter] = useState('');
  const [sideFilter, setSideFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [page, setPage] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [valueCurrency, setValueCurrency] = useState<'USDT' | 'BTC'>('USDT');

  const startMexcFetch = () => {
    setHasStarted(true);
    dispatch(fetchMexcSpotActivity());
  };

  const symbolOptions = useMemo(() => {
    const trades = data?.trades ?? [];
    return Array.from(new Set(trades.map(trade => trade.baseAsset))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [data?.trades]);

  const filteredTrades = useMemo(() => {
    const trades = data?.trades ?? [];
    return trades.filter(trade => {
      const matchesSymbol =
        !symbolFilter.trim() ||
        trade.symbol.toLowerCase().includes(symbolFilter.trim().toLowerCase()) ||
        trade.baseAsset.toLowerCase().includes(symbolFilter.trim().toLowerCase()) ||
        trade.quoteAsset.toLowerCase().includes(symbolFilter.trim().toLowerCase());
      const matchesSide = sideFilter === 'ALL' || trade.side === sideFilter;
      return matchesSymbol && matchesSide;
    });
  }, [data?.trades, sideFilter, symbolFilter]);

  const paginatedTrades = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredTrades.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredTrades, page]);

  useEffect(() => {
    setPage(1);
  }, [symbolFilter, sideFilter]);

  const formatDateTime = (timestamp?: number) => {
    if (!timestamp) return '-';
    return format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss');
  };

  const formatNumber = (value?: number, maxDecimals = 8) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDecimals,
    }).format(value);
  };

  const formatValue = (value?: number) =>
    valueCurrency === 'USDT' ? formatCurrency(value) : formatBtc(value);

  if (status === 'loading' && !data) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading fresh MexC activity…</Typography>
      </Container>
    );
  }

  if (!hasStarted) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Paper variant='outlined' sx={{ p: 3 }}>
          <Typography variant='h4' gutterBottom>
            MexC Activity - Before You Start
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
            This action shows live MexC spot balances plus whatever trades InvestTracker has already
            synced for comparison against InvestTracker accounting.
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary='Balances are live from MexC every time you refresh. Trades shown here are whatever has already been synced into InvestTracker — this view does not itself fetch new trade history.' />
            </ListItem>
            <ListItem>
              <ListItemText primary="Don't see trades you expect? Use Sync below to pull new history from MexC first, then refresh this view." />
            </ListItem>
            <ListItem>
              <ListItemText primary='Best use: validate symbols, side, quantities, and totals before portfolio reconciliation.' />
            </ListItem>
          </List>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant='contained' startIcon={<RefreshIcon />} onClick={startMexcFetch}>
              View MexC Activity
            </Button>
            <Button variant='outlined' startIcon={<SyncIcon />} onClick={() => setSyncOpen(true)}>
              Sync from MexC
            </Button>
          </Box>
        </Paper>

        <BinanceSyncDialog
          portfolioName={MEXC_PORTFOLIO_NAME}
          exchangeName='MEXC'
          open={syncOpen}
          onClose={() => setSyncOpen(false)}
        />
      </Container>
    );
  }

  const accountStats = data?.summary
    ? [
        {
          label: 'Active Assets',
          value: data.summary.activeAssetCount,
          tooltip: 'Assets in your MexC spot account with non-zero free or locked balance.',
          icon: <AccountBalanceWalletIcon fontSize='small' color='primary' />,
        },
        {
          label: 'Symbols With Trades',
          value: data.summary.symbolCountWithTrades,
          tooltip: 'Distinct MexC spot pairs that returned at least one trade.',
          icon: <SwapHorizIcon fontSize='small' color='primary' />,
        },
        {
          label: 'Last Sync Timestamp',
          value: data.summary.lastSyncTimestamp
            ? formatDateTime(data.summary.lastSyncTimestamp)
            : 'Never',
          tooltip:
            'Most recent incremental sync timestamp stored by InvestTracker for MexC ingestion.',
          icon: <AccessTimeIcon fontSize='small' color='primary' />,
        },
      ]
    : [];

  const activityStats = data?.summary
    ? [
        {
          label: 'Fresh Trades',
          value: data.summary.totalTradeCount,
          tooltip: 'Raw trade rows fetched from MexC for this refresh.',
          icon: <ReceiptLongIcon fontSize='small' color='action' />,
        },
        {
          label: 'Gross Buy Quote Qty',
          value: formatNumber(data.summary.grossBuyQuoteQty, 2),
          tooltip:
            'Sum of quote quantity for BUY trades. Useful for comparing cash deployed at the MexC level.',
          icon: <TrendingUpIcon fontSize='small' color='success' />,
        },
        {
          label: 'Gross Sell Quote Qty',
          value: formatNumber(data.summary.grossSellQuoteQty, 2),
          tooltip:
            'Sum of quote quantity for SELL trades. Useful for comparing sale proceeds at the MexC level.',
          icon: <TrendingDownIcon fontSize='small' color='warning' />,
        },
      ]
    : [];

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          flexDirection: { xs: 'column', md: 'row' },
          mb: 3,
        }}
      >
        <Box>
          <Typography variant='h4' gutterBottom>
            MexC Activity
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Fresh spot balances and raw trade history fetched directly from MexC for comparison
            against InvestTracker accounting.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant='outlined' startIcon={<SyncIcon />} onClick={() => setSyncOpen(true)}>
            Sync from MexC
          </Button>
          <Button
            variant='contained'
            startIcon={<RefreshIcon />}
            onClick={startMexcFetch}
            disabled={status === 'loading'}
          >
            Refresh from MexC
          </Button>
        </Box>
      </Box>

      <BinanceSyncDialog
        portfolioName={MEXC_PORTFOLIO_NAME}
        exchangeName='MEXC'
        open={syncOpen}
        onClose={() => setSyncOpen(false)}
      />

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {typeof error === 'string' ? error : 'An unexpected error occurred'}
        </Alert>
      )}

      {data?.summary && (
        <>
          <Paper
            variant='outlined'
            sx={{
              p: 3,
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              borderLeft: theme => `6px solid ${theme.palette.primary.main}`,
            }}
          >
            <Box>
              <Typography variant='overline' color='text.secondary'>
                Total Spot Balance Value
              </Typography>
              <Typography variant='h3' fontWeight={700}>
                {formatValue(
                  valueCurrency === 'USDT'
                    ? data.summary.totalValueUsdt
                    : data.summary.totalValueBtc
                )}
              </Typography>
            </Box>
            <ToggleButtonGroup
              value={valueCurrency}
              exclusive
              size='small'
              onChange={(_e, newValue: 'USDT' | 'BTC' | null) =>
                newValue && setValueCurrency(newValue)
              }
            >
              <ToggleButton value='USDT'>USDT</ToggleButton>
              <ToggleButton value='BTC'>BTC</ToggleButton>
            </ToggleButtonGroup>
          </Paper>

          <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
            Account
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {accountStats.map(card => (
              <Grid item xs={12} sm={6} md={4} key={card.label}>
                <Tooltip title={card.tooltip} arrow>
                  <Card variant='outlined' sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {card.icon}
                        <Typography variant='overline' color='text.secondary'>
                          {card.label}
                        </Typography>
                      </Box>
                      <Typography variant='h6'>{card.value}</Typography>
                    </CardContent>
                  </Card>
                </Tooltip>
              </Grid>
            ))}
          </Grid>

          <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
            Trade Activity
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {activityStats.map(card => (
              <Grid item xs={12} sm={6} md={4} key={card.label}>
                <Tooltip title={card.tooltip} arrow>
                  <Card variant='outlined' sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {card.icon}
                        <Typography variant='overline' color='text.secondary'>
                          {card.label}
                        </Typography>
                      </Box>
                      <Typography variant='h6'>{card.value}</Typography>
                    </CardContent>
                  </Card>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {data?.balances && data.balances.length > 0 && (
        <Accordion defaultExpanded variant='outlined' sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>
              Spot Balances Snapshot ({data.balances.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.balances.map(balance => (
                <Chip
                  key={balance.asset}
                  label={`${balance.asset}: ${formatNumber(balance.total, 6)} (${
                    valueCurrency === 'USDT'
                      ? formatCurrency(balance.valueUsdt)
                      : formatBtc(balance.valueBtc)
                  })`}
                  variant='outlined'
                  color='primary'
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion variant='outlined'>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Trades ({filteredTrades.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper variant='outlined' sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Autocomplete
                freeSolo
                options={symbolOptions}
                inputValue={symbolFilter}
                onInputChange={(_e, newInputValue) => setSymbolFilter(newInputValue)}
                sx={{ minWidth: 220 }}
                renderInput={params => (
                  <TextField {...params} label='Filter by symbol' size='small' />
                )}
              />
              <FormControl size='small' sx={{ minWidth: 160 }}>
                <InputLabel id='mexc-side-filter-label'>Side</InputLabel>
                <Select
                  labelId='mexc-side-filter-label'
                  value={sideFilter}
                  label='Side'
                  onChange={e => setSideFilter(e.target.value as 'ALL' | 'BUY' | 'SELL')}
                >
                  <MenuItem value='ALL'>All</MenuItem>
                  <MenuItem value='BUY'>Buy</MenuItem>
                  <MenuItem value='SELL'>Sell</MenuItem>
                </Select>
              </FormControl>
              <Typography variant='body2' color='text.secondary'>
                Showing {filteredTrades.length} trade{filteredTrades.length === 1 ? '' : 's'}
              </Typography>
            </Box>
          </Paper>

          <Paper variant='outlined'>
            <StyledTableContainer>
              <Table stickyHeader aria-label='Fresh MexC spot activity table'>
                <TableHead>
                  <TableRow>
                    <StickyHeaderCell>Time</StickyHeaderCell>
                    <StickyHeaderCell>Symbol</StickyHeaderCell>
                    <StickyHeaderCell>Side</StickyHeaderCell>
                    <StickyHeaderCell align='right'>Price</StickyHeaderCell>
                    <StickyHeaderCell align='right'>Qty</StickyHeaderCell>
                    <StickyHeaderCell align='right'>Quote Qty</StickyHeaderCell>
                    <StickyHeaderCell align='right'>Commission</StickyHeaderCell>
                    <StickyHeaderCell>Commission Asset</StickyHeaderCell>
                    <StickyHeaderCell>Base</StickyHeaderCell>
                    <StickyHeaderCell>Quote</StickyHeaderCell>
                    <StickyHeaderCell align='right'>Trade ID</StickyHeaderCell>
                    <StickyHeaderCell align='right'>Order ID</StickyHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTrades.length > 0 ? (
                    paginatedTrades.map((trade: MexcSpotTradeRow) => (
                      <TableRow
                        key={`${trade.symbol}-${trade.tradeId}-${trade.orderId}-${trade.time}`}
                      >
                        <TableCell>{formatDateTime(trade.time)}</TableCell>
                        <TableCell>{trade.symbol}</TableCell>
                        <TableCell>
                          <Chip
                            label={trade.side}
                            color={trade.side === 'BUY' ? 'success' : 'warning'}
                            size='small'
                          />
                        </TableCell>
                        <TableCell align='right'>{formatNumber(trade.price)}</TableCell>
                        <TableCell align='right'>{formatNumber(trade.qty)}</TableCell>
                        <TableCell align='right'>{formatNumber(trade.quoteQty)}</TableCell>
                        <TableCell align='right'>{formatNumber(trade.commission)}</TableCell>
                        <TableCell>{trade.commissionAsset}</TableCell>
                        <TableCell>{trade.baseAsset}</TableCell>
                        <TableCell>{trade.quoteAsset}</TableCell>
                        <TableCell align='right'>{trade.tradeId}</TableCell>
                        <TableCell align='right'>{trade.orderId}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12}>
                        <Typography align='center' color='text.secondary' sx={{ py: 4 }}>
                          No MexC trades matched the current filters.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Pagination
              currentPage={page}
              totalPages={Math.max(1, Math.ceil(filteredTrades.length / PAGE_SIZE))}
              onPageChange={setPage}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default MexcSpotActivityPage;
