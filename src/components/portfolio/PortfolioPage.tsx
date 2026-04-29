// src/components/portfolio/PortfolioPage.tsx

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
} from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import usePortfolioComponent from './usePortfolioComponent';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchCoinInformation } from '../../redux/slices/coinInformationSlice';
import { syncBinance, syncMexc, resetSyncStatus } from '../../redux/slices/exchangeConfigSlice';
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
  const [syncExplainAction, setSyncExplainAction] = useState<
    null | 'calculate' | 'fetchMissing' | 'syncBinance' | 'syncMexc'
  >(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const coinInformationState = useAppSelector((state: RootState) => state.coinInformation);
  const syncStatus = useAppSelector((state: RootState) => state.exchangeConfig.syncStatus);
  const sortedHoldings = portfolioDistribution?.holdings?.slice().sort((a, b) => {
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

  const actionDescriptions: Record<NonNullable<typeof syncExplainAction>, string> = {
    calculate:
      'Rebuilds portfolio distribution, allocations, and valuation metrics from currently available transactions.',
    fetchMissing:
      'Processes transactions that are still marked as unprocessed and updates holdings/cost basis consistency.',
    syncBinance:
      'Pulls incremental trades from Binance for this portfolio based on the latest sync checkpoint.',
    syncMexc:
      'Pulls incremental trades from MexC for this portfolio based on the latest sync checkpoint.',
  };

  const handleConfirmGuidedAction = () => {
    if (syncExplainAction === 'calculate') {
      handleCalculateDistribution(portfolioDistribution.portfolioName);
    } else if (syncExplainAction === 'fetchMissing') {
      handleFetchCoinInformation();
    } else if (syncExplainAction === 'syncBinance') {
      handleSyncBinance();
    } else if (syncExplainAction === 'syncMexc') {
      handleSyncMexc();
    }
    setSyncExplainAction(null);
  };

  const renderStats = () => (
    <Paper style={{ marginBottom: '1rem', padding: '1rem' }}>
      {/* Header Section with Title and Right Column */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
          gap: 2,
        }}
      >
        {/* Left Column - Portfolio Title */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TruncateWithTooltip
            typography
            typographyVariant='h6'
            maxWidth='60vw'
            text={`${portfolioDistribution.portfolioName} Portfolio Stats`}
            title={`${portfolioDistribution.portfolioName} Portfolio Stats`}
          />
        </Box>

        {/* Right Column - Alert and Actions Stacked */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: 400,
            minWidth: 300,
          }}
        >
          {/* Alert */}
          {portfolioDistribution?.totalHoldings === 0 ? (
            <Alert severity='warning'>
              <AlertTitle>Portfolio Not Calculated</AlertTitle>
              This portfolio hasn't been calculated yet. Click "Calculate Distribution" to process
              your holdings and get accurate statistics.
            </Alert>
          ) : (
            showCalculationAlert && (
              <Alert severity='success' onClose={() => setShowCalculationAlert(false)}>
                <AlertTitle>Portfolio Calculated</AlertTitle>
                Your portfolio data is up to date. Total holdings:{' '}
                {portfolioDistribution.totalHoldings}
              </Alert>
            )
          )}

          {/* Actions */}
          <Button
            variant='contained'
            component='label'
            color='primary'
            size='large'
            sx={{
              py: 1.5,
              px: 3,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Upload Portfolio CSV
            <input
              type='file'
              accept='.csv'
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
                // Reset the input so the same file can be uploaded again if needed
                e.target.value = '';
              }}
            />
          </Button>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant='outlined' onClick={() => setSyncExplainAction('calculate')}>
              Calculate Distribution
            </Button>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => setSyncExplainAction('fetchMissing')}
              disabled={coinInformationState.status === 'loading'}
            >
              {coinInformationState.status === 'loading' ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                'Fetch Missing Transactions'
              )}
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => setSyncExplainAction('syncBinance')}
              disabled={syncStatus === 'loading'}
            >
              {syncStatus === 'loading' ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                'Sync from Binance'
              )}
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => setSyncExplainAction('syncMexc')}
              disabled={syncStatus === 'loading'}
            >
              {syncStatus === 'loading' ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                'Sync from MexC'
              )}
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                setFullSyncExchange('BINANCE');
                setFullSyncOpen(true);
              }}
            >
              Full Historical Sync (Binance)
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                setFullSyncExchange('MEXC');
                setFullSyncOpen(true);
              }}
            >
              Full Historical Sync (MexC)
            </Button>
            <Button variant='outlined' color='error' onClick={() => setClearConfirmOpen(true)}>
              Clear All Transactions
            </Button>
          </Box>
        </Box>
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

        return (
          <>
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
        <DialogTitle>Confirm Portfolio Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {syncExplainAction ? actionDescriptions[syncExplainAction] : ''}
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
