// src/components/portfolio/PortfolioPage.tsx

import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import HistoryIcon from '@mui/icons-material/History';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SyncIcon from '@mui/icons-material/Sync';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Container,
  Typography,
  styled,
  Paper,
  Box,
  Grid,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  CircularProgress,
  Alert,
  AlertTitle,
  Theme,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import usePortfolioComponent from './usePortfolioComponent';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchCoinInformation } from '../../redux/slices/coinInformationSlice';
import {
  syncBinance,
  syncMexc,
  resetSyncStatus,
  fetchExchangeConfigs,
} from '../../redux/slices/exchangeConfigSlice';
import { fetchPortfolioHoldingDistribution } from '../../redux/slices/portfolioSlice';
import { clearPortfolioTransactions } from '../../redux/slices/transactionSlice';
import { RootState } from '../../redux/store';
import { ExchangeName, PortfolioDistribution } from '../../redux/types/types';
import BinanceSyncDialog from '../common/BinanceSyncDialog';
import TruncateWithTooltip from '../common/TruncateWithTooltip';
import AddHoldingsForm from '../holdings/AddHoldingsForm';
import HoldingListPage from '../holdings/HoldingListPage';
import TransactionList from '../transactions/TransactionList';

const StyledContainer = styled(Container)({
  marginTop: '2rem',
});

const PORTFOLIO_LIST_HEIGHT = '72vh';
const BINANCE_LABEL = 'binance';
const MEXC_LABEL = 'mexc';

// Title handled via TruncateWithTooltip now

const StatCard = styled(Paper)(({ theme }) => ({
  padding: '1rem',
  borderRadius: 8,
  background: (theme as Theme).palette.background.paper,
  boxShadow: (theme as Theme).shadows[1],
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  color: (theme as Theme).palette.text.secondary,
  fontSize: '0.85rem',
}));

const StatValue = styled(Typography)({
  fontWeight: 700,
});

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const formatPct = (value: number) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    value
  ) + '%';

const pnlColor = (value: number) => {
  if (value > 0) return 'success.main';
  if (value < 0) return 'error.main';
  return 'text.primary';
};

const StatHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

interface Props {
  portfolioDistribution: PortfolioDistribution;
}

const PortfolioPage = ({ portfolioDistribution }: Props) => {
  const { handleSubmitPortfolioActions } = usePortfolioComponent();
  const dispatch = useAppDispatch();
  const [priceMultiplier, setPriceMultiplier] = useState<{
    [key: number]: number;
  }>({});
  const [predictionUsdt, setPredictionUsdt] = useState<{
    [key: number]: number;
  }>({});
  const [predictionBtc, setPredictionBtc] = useState<{
    [key: number]: number;
  }>({});
  const [showCalculationAlert, setShowCalculationAlert] = useState(true);
  const [fullSyncOpen, setFullSyncOpen] = useState(false);
  const [fullSyncExchange, setFullSyncExchange] = useState<ExchangeName>('BINANCE');
  const [syncExplainAction, setSyncExplainAction] = useState<null | 'syncBinance' | 'syncMexc'>(
    null
  );
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const coinInformationState = useAppSelector((state: RootState) => state.coinInformation);
  const syncStatus = useAppSelector((state: RootState) => state.exchangeConfig.syncStatus);
  const exchangeConfigs = useAppSelector((state: RootState) => state.exchangeConfig.configs);

  useEffect(() => {
    if (exchangeConfigs.length === 0) {
      dispatch(fetchExchangeConfigs());
    }
  }, [dispatch, exchangeConfigs.length]);

  const binanceConfig = exchangeConfigs.find(c => c.exchangeName === 'BINANCE');
  const mexcConfig = exchangeConfigs.find(c => c.exchangeName === 'MEXC');

  const formatSyncDate = (ts: number | null | undefined): string | null => {
    if (!ts) return null;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts));
  };

  const supportsBinance =
    portfolioDistribution.exchangeName === 'BINANCE' ||
    (portfolioDistribution.exchangeName == null &&
      portfolioDistribution.portfolioName.toLowerCase().includes(BINANCE_LABEL));
  const supportsMexc =
    portfolioDistribution.exchangeName === 'MEXC' ||
    (portfolioDistribution.exchangeName == null &&
      portfolioDistribution.portfolioName.toLowerCase().includes(MEXC_LABEL));
  const showBinanceActions = supportsBinance;
  const showMexcActions = supportsMexc;
  const sortedHoldings = portfolioDistribution?.holdings?.slice().sort(() => {
    return 0;
  });

  // this should be in PortfolioComponent.tsx
  const [activeTab, setActiveTab] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleFetchCoinInformation = () => {
    dispatch(fetchCoinInformation(portfolioDistribution.portfolioName)).then(action => {
      if (fetchCoinInformation.fulfilled.match(action)) {
        const { processedCount } = action.payload;
        if (processedCount > 0) {
          toast.success(
            `Processed ${processedCount} transaction${processedCount === 1 ? '' : 's'}`
          );
        } else {
          toast.info('All transactions were already up to date');
        }
      }
    });
  };

  const handleCalculateDistribution = (name: string) => {
    dispatch(fetchPortfolioHoldingDistribution(name)).then(() => {
      toast.success('Portfolio updated');
    });
  };

  const handleClearTransactions = () => {
    setClearing(true);
    dispatch(clearPortfolioTransactions(portfolioDistribution.portfolioName)).then(action => {
      setClearing(false);
      setClearConfirmOpen(false);
      if (clearPortfolioTransactions.fulfilled.match(action)) {
        toast.success('All transactions cleared. Re-sync to repopulate.');
      } else {
        toast.error('Failed to clear transactions.');
      }
    });
  };

  const handleSyncBinance = () => {
    dispatch(syncBinance(portfolioDistribution.portfolioName)).then(action => {
      if (syncBinance.fulfilled.match(action)) {
        toast.success('Binance sync completed. Refresh to see new transactions.');
      } else {
        const msg = action.payload as string;
        if (msg?.includes('not configured')) {
          toast.error('Binance API keys not configured. Go to Settings to connect your account.');
        } else {
          toast.error(`Sync failed: ${msg || 'Unknown error'}`);
        }
      }
      dispatch(resetSyncStatus());
    });
  };

  const handleSyncMexc = () => {
    dispatch(syncMexc(portfolioDistribution.portfolioName)).then(action => {
      if (syncMexc.fulfilled.match(action)) {
        toast.success('MexC sync completed. Refresh to see new transactions.');
      } else {
        const msg = action.payload as string;
        if (msg?.includes('not configured')) {
          toast.error('MexC API keys not configured. Go to Settings to connect your account.');
        } else {
          toast.error(`Sync failed: ${msg || 'Unknown error'}`);
        }
      }
      dispatch(resetSyncStatus());
    });
  };

  const handleConfirmGuidedAction = () => {
    if (syncExplainAction === 'syncBinance') {
      handleSyncBinance();
    } else if (syncExplainAction === 'syncMexc') {
      handleSyncMexc();
    }
    setSyncExplainAction(null);
  };

  const renderStats = () => (
    <Paper style={{ marginBottom: '1rem', padding: '1rem' }}>
      {/* Title row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <TruncateWithTooltip
          typography
          typographyVariant='h6'
          maxWidth='60vw'
          text={`${portfolioDistribution.portfolioName} Portfolio Stats`}
          title={`${portfolioDistribution.portfolioName} Portfolio Stats`}
        />
        {portfolioDistribution.exchangeName && (
          <Chip
            label={portfolioDistribution.exchangeName}
            size='small'
            color='secondary'
            variant='outlined'
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
        )}
      </Box>

      {/* Alert — full width */}
      {portfolioDistribution?.totalHoldings === 0 ? (
        <Alert severity='warning' sx={{ mb: 2 }}>
          <AlertTitle>Portfolio Not Calculated</AlertTitle>
          This portfolio hasn't been calculated yet. Click "Calculate Distribution" to process your
          holdings and get accurate statistics.
        </Alert>
      ) : (
        showCalculationAlert && (
          <Alert severity='success' onClose={() => setShowCalculationAlert(false)} sx={{ mb: 2 }}>
            <AlertTitle>Portfolio Calculated</AlertTitle>
            Your portfolio data is up to date. Total holdings: {portfolioDistribution.totalHoldings}
          </Alert>
        )
      )}

      {/* ── Actions Panel ─────────────────────────────────── */}
      <Box sx={{ mt: 2, mb: 2 }}>
        {/* Section: Add Transactions */}
        <Typography
          variant='overline'
          color='text.secondary'
          sx={{ fontWeight: 600, letterSpacing: 1 }}
        >
          Add Transactions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5, mb: 0.5 }}>
          {/* Upload CSV — primary CTA */}
          <Tooltip
            title='Import a Binance or MexC CSV / Excel export. Supported formats: Binance CSV, MexC CSV, Excel (.xlsx).'
            arrow
            placement='top'
          >
            <Button
              variant='contained'
              component='label'
              color='primary'
              startIcon={<UploadFileIcon />}
            >
              Upload CSV
              <input
                type='file'
                accept='.csv,.xlsx'
                hidden
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      await handleSubmitPortfolioActions(portfolioDistribution.portfolioName, file);
                      toast.success('Portfolio transactions uploaded successfully!');
                    } catch (error: any) {
                      toast.error(error?.message || 'Failed to upload portfolio transactions');
                    }
                  }
                  e.target.value = '';
                }}
              />
            </Button>
          </Tooltip>

          {/* Binance incremental sync */}
          {showBinanceActions && (
            <Tooltip
              title={`Fetch Binance trades newer than the last sync checkpoint and import them into this portfolio.${binanceConfig?.lastSyncTimestamp ? ` Last synced: ${formatSyncDate(binanceConfig.lastSyncTimestamp)}.` : ' No sync recorded yet.'}`}
              arrow
              placement='top'
            >
              <span>
                <Button
                  variant='outlined'
                  color='secondary'
                  startIcon={
                    syncStatus === 'loading' ? (
                      <CircularProgress size={16} color='inherit' />
                    ) : (
                      <SyncIcon />
                    )
                  }
                  onClick={() => setSyncExplainAction('syncBinance')}
                  disabled={syncStatus === 'loading'}
                >
                  Sync Binance
                </Button>
              </span>
            </Tooltip>
          )}

          {/* MexC incremental sync */}
          {showMexcActions && (
            <Tooltip
              title={`Fetch MexC trades newer than the last sync checkpoint and import them into this portfolio.${mexcConfig?.lastSyncTimestamp ? ` Last synced: ${formatSyncDate(mexcConfig.lastSyncTimestamp)}.` : ' No sync recorded yet.'}`}
              arrow
              placement='top'
            >
              <span>
                <Button
                  variant='outlined'
                  color='secondary'
                  startIcon={
                    syncStatus === 'loading' ? (
                      <CircularProgress size={16} color='inherit' />
                    ) : (
                      <SyncIcon />
                    )
                  }
                  onClick={() => setSyncExplainAction('syncMexc')}
                  disabled={syncStatus === 'loading'}
                >
                  Sync MexC
                </Button>
              </span>
            </Tooltip>
          )}

          {/* Full sync — lower visual weight */}
          {showBinanceActions && (
            <Tooltip
              title='Backfill the complete Binance trade history for a custom date range. Runs in the background — you will receive a notification when it completes.'
              arrow
              placement='top'
            >
              <Button
                variant='text'
                color='secondary'
                size='small'
                startIcon={<HistoryIcon />}
                onClick={() => {
                  setFullSyncExchange('BINANCE');
                  setFullSyncOpen(true);
                }}
              >
                Full Sync (Binance)
              </Button>
            </Tooltip>
          )}
          {showMexcActions && (
            <Tooltip
              title='Backfill the complete MexC trade history for a custom date range. Runs in the background — you will receive a notification when it completes.'
              arrow
              placement='top'
            >
              <Button
                variant='text'
                color='secondary'
                size='small'
                startIcon={<HistoryIcon />}
                onClick={() => {
                  setFullSyncExchange('MEXC');
                  setFullSyncOpen(true);
                }}
              >
                Full Sync (MexC)
              </Button>
            </Tooltip>
          )}
        </Box>

        {/* Last sync pills — shown only when timestamps exist */}
        {((showBinanceActions && binanceConfig?.lastSyncTimestamp) ||
          (showMexcActions && mexcConfig?.lastSyncTimestamp)) && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
            {showBinanceActions && binanceConfig?.lastSyncTimestamp && (
              <Chip
                icon={<SyncIcon />}
                label={`Binance: last synced ${formatSyncDate(binanceConfig.lastSyncTimestamp)}`}
                size='small'
                variant='outlined'
                color='secondary'
                sx={{ fontSize: '0.7rem' }}
              />
            )}
            {showMexcActions && mexcConfig?.lastSyncTimestamp && (
              <Chip
                icon={<SyncIcon />}
                label={`MexC: last synced ${formatSyncDate(mexcConfig.lastSyncTimestamp)}`}
                size='small'
                variant='outlined'
                color='secondary'
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        )}

        <Divider sx={{ my: 1.5 }} />

        {/* Section: Process & Refresh */}
        <Typography
          variant='overline'
          color='text.secondary'
          sx={{ fontWeight: 600, letterSpacing: 1 }}
        >
          Process &amp; Refresh
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5, mb: 1.5 }}>
          <Tooltip
            title='Recalculates holdings, USDT/BTC valuations, and allocation percentages from your full transaction history.'
            arrow
            placement='top'
          >
            <Button
              variant='outlined'
              startIcon={<CalculateIcon />}
              onClick={() => handleCalculateDistribution(portfolioDistribution.portfolioName)}
            >
              Calculate Distribution
            </Button>
          </Tooltip>
          <Tooltip
            title="Runs the cost-basis engine over transactions that haven't been processed yet, updating holdings and P&L."
            arrow
            placement='top'
          >
            <span>
              <Button
                variant='outlined'
                color='primary'
                startIcon={
                  coinInformationState.status === 'loading' ? (
                    <CircularProgress size={16} color='inherit' />
                  ) : (
                    <FindInPageIcon />
                  )
                }
                onClick={handleFetchCoinInformation}
                disabled={coinInformationState.status === 'loading'}
              >
                Fetch Missing Transactions
              </Button>
            </span>
          </Tooltip>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Danger zone */}
        <Tooltip
          title='Permanently deletes all transactions in this portfolio. Holdings and P&L will reset. Cannot be undone — you will need to re-sync or re-upload to repopulate data.'
          arrow
          placement='top'
        >
          <Button
            variant='text'
            color='error'
            size='small'
            startIcon={<DeleteSweepIcon />}
            onClick={() => setClearConfirmOpen(true)}
          >
            Clear All Transactions
          </Button>
        </Tooltip>
      </Box>

      {/* Stats Section */}
      {(() => {
        const totalBuy = portfolioDistribution.totalBuySpentUsdt ?? 0;
        const totalSell = portfolioDistribution.totalSellEarnedUsdt ?? 0;
        const netCapital = portfolioDistribution.netCapitalFromPocket ?? totalBuy - totalSell;
        const totalRealized =
          portfolioDistribution.totalRealizedProfitUsdt ??
          sortedHoldings.reduce((acc, h) => acc + (h.totalRealizedProfitUsdt ?? 0), 0);
        const totalUnrealized =
          portfolioDistribution.totalUnrealizedProfitUsdt ??
          sortedHoldings.reduce((acc, h) => acc + (h.unrealizedProfitUsdt ?? 0), 0);
        const totalPnl = totalRealized + totalUnrealized;
        const netReturn = portfolioDistribution.totalUsdt + totalSell - totalBuy;
        const netReturnPct = netCapital > 0 ? (netReturn / netCapital) * 100 : 0;

        const positionStats = [
          {
            label: 'Current Portfolio Value',
            tooltip:
              'Live market value of your currently held assets — sum of each holding multiplied by its latest USDT market price.',
            value: formatCurrency(portfolioDistribution.totalUsdt),
          },
          {
            label: 'Total Holdings',
            tooltip: 'Number of active asset positions currently held in this portfolio.',
            value: portfolioDistribution.totalHoldings,
          },
          {
            label: 'Total Buy Spend',
            tooltip:
              'Gross USDT spent across all BUY transactions. This is total cash deployed, not the remaining cost basis of open positions.',
            value: formatCurrency(totalBuy),
          },
          {
            label: 'Total Sell Proceeds',
            tooltip:
              'Gross USDT received across all SELL transactions before cost-basis comparison.',
            value: formatCurrency(totalSell),
          },
          {
            label: 'Open Position Value (USDT)',
            tooltip:
              'Live market value of all open holdings combined — should match the sum of the "Current Position" column.',
            value: formatCurrency(
              sortedHoldings.reduce((acc, e) => acc + (e.currentPositionInUsdt ?? 0), 0)
            ),
          },
          {
            label: 'Open Position Value (BTC)',
            tooltip: 'Current BTC-denominated value of all open holdings combined.',
            value: new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 8,
              maximumFractionDigits: 8,
            }).format(sortedHoldings.reduce((acc, e) => acc + e.amountInBtc, 0)),
          },
          {
            label: 'Prediction (USDT)',
            tooltip:
              'Scenario total using the price-multiplier column. A multiplier of 2 means "what if every price doubled?"',
            value: formatCurrency(Object.values(predictionUsdt).reduce((a, c) => a + c, 0)),
          },
          {
            label: 'Prediction (BTC)',
            tooltip: 'Same scenario as above expressed in BTC-equivalent value.',
            value: new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 8,
              maximumFractionDigits: 8,
            }).format(Object.values(predictionBtc).reduce((a, c) => a + c, 0)),
          },
          {
            label: 'Open Cost Basis',
            tooltip:
              'Remaining cost basis of the positions you still hold — excludes the cost already attributed to sold units.',
            value: formatCurrency(
              sortedHoldings.reduce((acc, e) => acc + (e.stableTotalCost ?? 0), 0)
            ),
          },
        ];

        const pnlStats: Array<{
          label: string;
          tooltip: string;
          value: string | number;
          color?: string;
        }> = [
          {
            label: 'Net Capital from Pocket',
            tooltip:
              'The real cash you needed from your own wallet: Total Buys − Total Sell Proceeds. This isolates money you actually invested vs. capital recycled from taking profits.',
            value: formatCurrency(netCapital),
          },
          {
            label: 'Total Realized P&L',
            tooltip:
              'Cumulative profit/loss from all completed sell trades across every coin, calculated using average cost basis (AVCO). Green = net profit, Red = net loss.',
            value: formatCurrency(totalRealized),
            color: pnlColor(totalRealized),
          },
          {
            label: 'Open Unrealized P&L',
            tooltip:
              'Current market value of open positions minus their remaining cost basis. Shows paper gains/losses if you liquidated everything now.',
            value: formatCurrency(totalUnrealized),
            color: pnlColor(totalUnrealized),
          },
          {
            label: 'Total P&L (Realized + Unrealized)',
            tooltip:
              'Combined accounting P&L: realized gains/losses from closed trades plus unrealized gains/losses on open positions.',
            value: formatCurrency(totalPnl),
            color: pnlColor(totalPnl),
          },
          {
            label: 'Net Return vs Capital',
            tooltip:
              'How much your portfolio has grown beyond the cash you put in: (Current Portfolio Value + Total Sells) − Total Buys. Positive means you are ahead of what you invested.',
            value: `${formatCurrency(netReturn)} (${formatPct(netReturnPct)})`,
            color: pnlColor(netReturn),
          },
        ];

        const formatTxDate = (iso: string | null | undefined) => {
          if (!iso) return null;
          return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(new Date(iso));
        };
        const oldest = formatTxDate(portfolioDistribution.oldestTransactionDate);
        const newest = formatTxDate(portfolioDistribution.newestTransactionDate);

        return (
          <>
            {oldest && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  mb: 2,
                  color: 'text.secondary',
                }}
              >
                <HistoryIcon sx={{ fontSize: 16 }} />
                <Typography variant='caption'>
                  Transaction history: <strong>{oldest}</strong>
                  {newest && oldest !== newest && (
                    <>
                      {' → '}
                      <strong>{newest}</strong>
                    </>
                  )}
                </Typography>
              </Box>
            )}
            <Grid container spacing={2} sx={{ mb: 1 }}>
              {positionStats.map(stat => (
                <Grid item xs={12} sm={6} md={3} key={stat.label}>
                  <StatCard>
                    <StatHeader>
                      <StatLabel variant='overline'>{stat.label}</StatLabel>
                      <Tooltip title={stat.tooltip} arrow placement='top'>
                        <InfoOutlinedIcon fontSize='inherit' color='action' sx={{ fontSize: 16 }} />
                      </Tooltip>
                    </StatHeader>
                    <StatValue variant='h6'>{stat.value}</StatValue>
                  </StatCard>
                </Grid>
              ))}
            </Grid>

            <Typography
              variant='overline'
              color='text.secondary'
              sx={{ mt: 1, mb: 0.5, display: 'block' }}
            >
              P&amp;L Overview
            </Typography>
            <Grid container spacing={2}>
              {pnlStats.map(stat => (
                <Grid item xs={12} sm={6} md={2.4} key={stat.label}>
                  <StatCard>
                    <StatHeader>
                      <StatLabel variant='overline'>{stat.label}</StatLabel>
                      <Tooltip title={stat.tooltip} arrow placement='top'>
                        <InfoOutlinedIcon fontSize='inherit' color='action' sx={{ fontSize: 16 }} />
                      </Tooltip>
                    </StatHeader>
                    <StatValue variant='h6' color={stat.color ?? 'text.primary'}>
                      {stat.value}
                    </StatValue>
                  </StatCard>
                </Grid>
              ))}
            </Grid>
          </>
        );
      })()}
    </Paper>
  );

  return (
    <StyledContainer maxWidth='xl'>
      {renderStats()}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label='Holdings' />
          <Tab label='Transactions' />
        </Tabs>
      </Box>

      {activeTab === 0 && sortedHoldings && (
        <>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant='contained' color='primary' onClick={toggleDrawer(true)}>
              Add Holdings
            </Button>
          </Box>
          <HoldingListPage
            holdings={sortedHoldings}
            portfolioName={portfolioDistribution.portfolioName}
            setPriceMultiplier={setPriceMultiplier}
            setPredictionBtc={setPredictionBtc}
            setPredictionUsdt={setPredictionUsdt}
            priceMultiplier={priceMultiplier}
            maxTableHeight={PORTFOLIO_LIST_HEIGHT}
          />
        </>
      )}
      {activeTab === 1 && (
        <>
          <TransactionList
            portfolioName={portfolioDistribution.portfolioName}
            maxTableHeight={PORTFOLIO_LIST_HEIGHT}
          />
        </>
      )}
      <Drawer anchor='right' open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 400, padding: 2 }}>
          <Typography variant='h6' gutterBottom>
            Add Holdings
          </Typography>
          <AddHoldingsForm portfolio={portfolioDistribution.portfolioName} />
        </Box>
      </Drawer>

      <BinanceSyncDialog
        portfolioName={portfolioDistribution.portfolioName}
        exchangeName={fullSyncExchange}
        open={fullSyncOpen}
        onClose={() => setFullSyncOpen(false)}
      />

      <Dialog open={clearConfirmOpen} onClose={() => !clearing && setClearConfirmOpen(false)}>
        <DialogTitle>Clear All Transactions?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete <strong>all transactions</strong> in the{' '}
            <strong>{portfolioDistribution.portfolioName}</strong> portfolio. Holdings and P&amp;L
            will reset. This cannot be undone — you will need to re-sync to repopulate data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearConfirmOpen(false)} disabled={clearing}>
            Cancel
          </Button>
          <Button
            onClick={handleClearTransactions}
            color='error'
            variant='contained'
            disabled={clearing}
          >
            {clearing ? <CircularProgress size={20} color='inherit' /> : 'Clear All Transactions'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={syncExplainAction !== null}
        onClose={() => setSyncExplainAction(null)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Confirm Sync Action</DialogTitle>
        <DialogContent>
          <DialogContentText component='div'>
            {syncExplainAction === 'syncBinance' && (
              <>
                This will fetch all Binance trades{' '}
                <strong>newer than the last sync checkpoint</strong> and import them into this
                portfolio.{' '}
                {binanceConfig?.lastSyncTimestamp ? (
                  <>
                    Last synced: <strong>{formatSyncDate(binanceConfig.lastSyncTimestamp)}</strong>.
                  </>
                ) : (
                  <>
                    <strong>No prior sync recorded</strong> — all available trades will be fetched.
                  </>
                )}
              </>
            )}
            {syncExplainAction === 'syncMexc' && (
              <>
                This will fetch all MexC trades <strong>newer than the last sync checkpoint</strong>{' '}
                and import them into this portfolio.{' '}
                {mexcConfig?.lastSyncTimestamp ? (
                  <>
                    Last synced: <strong>{formatSyncDate(mexcConfig.lastSyncTimestamp)}</strong>.
                  </>
                ) : (
                  <>
                    <strong>No prior sync recorded</strong> — all available trades will be fetched.
                  </>
                )}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSyncExplainAction(null)}>Cancel</Button>
          <Button variant='contained' onClick={handleConfirmGuidedAction}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default PortfolioPage;
