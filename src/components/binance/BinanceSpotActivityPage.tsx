import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
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
import { fetchBinanceSpotActivity } from '../../redux/slices/binanceSpotActivitySlice';
import { RootState } from '../../redux/store';
import { BinanceSpotTradeRow } from '../../redux/types/types';
import Pagination from '../common/Pagination';

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

const BinanceSpotActivityPage = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state: RootState) => state.binanceSpotActivity);
  const [symbolFilter, setSymbolFilter] = useState('');
  const [sideFilter, setSideFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [page, setPage] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);

  const startBinanceFetch = () => {
    setHasStarted(true);
    dispatch(fetchBinanceSpotActivity());
  };

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

  if (status === 'loading' && !data) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading fresh Binance activity…</Typography>
      </Container>
    );
  }

  if (!hasStarted) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Paper variant='outlined' sx={{ p: 3 }}>
          <Typography variant='h4' gutterBottom>
            Binance Activity - Before You Start
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
            This action fetches live Binance spot balances and trade history for comparison against
            InvestTracker accounting.
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary='What it does: calls Binance and refreshes activity snapshots in this view.' />
            </ListItem>
            <ListItem>
              <ListItemText primary='What it does not do: it does not automatically rewrite portfolio accounting.' />
            </ListItem>
            <ListItem>
              <ListItemText primary='Best use: validate symbols, side, quantities, and totals before portfolio reconciliation.' />
            </ListItem>
          </List>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant='contained' startIcon={<RefreshIcon />} onClick={startBinanceFetch}>
              Fetch Binance Activity
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

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
            Binance Activity
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Fresh spot balances and raw trade history fetched directly from Binance for comparison
            against InvestTracker accounting.
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<RefreshIcon />}
          onClick={startBinanceFetch}
          disabled={status === 'loading'}
        >
          Refresh from Binance
        </Button>
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {data?.summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            {
              label: 'Active Assets',
              value: data.summary.activeAssetCount,
              tooltip: 'Assets in your Binance spot account with non-zero free or locked balance.',
            },
            {
              label: 'Symbols With Trades',
              value: data.summary.symbolCountWithTrades,
              tooltip: 'Distinct Binance spot pairs that returned at least one trade.',
            },
            {
              label: 'Fresh Trades',
              value: data.summary.totalTradeCount,
              tooltip: 'Raw trade rows fetched from Binance for this refresh.',
            },
            {
              label: 'Gross Buy Quote Qty',
              value: formatNumber(data.summary.grossBuyQuoteQty, 2),
              tooltip:
                'Sum of quote quantity for BUY trades. Useful for comparing cash deployed at the Binance level.',
            },
            {
              label: 'Gross Sell Quote Qty',
              value: formatNumber(data.summary.grossSellQuoteQty, 2),
              tooltip:
                'Sum of quote quantity for SELL trades. Useful for comparing sale proceeds at the Binance level.',
            },
            {
              label: 'Last Sync Timestamp',
              value: data.summary.lastSyncTimestamp
                ? formatDateTime(data.summary.lastSyncTimestamp)
                : 'Never',
              tooltip:
                'Most recent incremental sync timestamp stored by InvestTracker for Binance ingestion.',
            },
          ].map(card => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={card.label}>
              <Tooltip title={card.tooltip} arrow>
                <Card variant='outlined' sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='overline' color='text.secondary'>
                      {card.label}
                    </Typography>
                    <Typography variant='h6'>{card.value}</Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      )}

      {data?.balances && data.balances.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Spot Balances Snapshot
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {data.balances.slice(0, 20).map(balance => (
              <Chip
                key={balance.asset}
                label={`${balance.asset}: ${formatNumber(balance.total, 6)}`}
                variant='outlined'
                color='primary'
              />
            ))}
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            label='Filter by symbol'
            value={symbolFilter}
            onChange={e => setSymbolFilter(e.target.value)}
            size='small'
          />
          <FormControl size='small' sx={{ minWidth: 160 }}>
            <InputLabel id='binance-side-filter-label'>Side</InputLabel>
            <Select
              labelId='binance-side-filter-label'
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

      <Paper>
        <StyledTableContainer>
          <Table stickyHeader aria-label='Fresh Binance spot activity table'>
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
                <StickyHeaderCell>Maker</StickyHeaderCell>
                <StickyHeaderCell align='right'>Trade ID</StickyHeaderCell>
                <StickyHeaderCell align='right'>Order ID</StickyHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTrades.length > 0 ? (
                paginatedTrades.map((trade: BinanceSpotTradeRow) => (
                  <TableRow key={`${trade.symbol}-${trade.tradeId}-${trade.orderId}-${trade.time}`}>
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
                    <TableCell>{trade.maker ? 'Maker' : 'Taker'}</TableCell>
                    <TableCell align='right'>{trade.tradeId}</TableCell>
                    <TableCell align='right'>{trade.orderId}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13}>
                    <Typography align='center' color='text.secondary' sx={{ py: 4 }}>
                      No Binance trades matched the current filters.
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
    </Container>
  );
};

export default BinanceSpotActivityPage;
