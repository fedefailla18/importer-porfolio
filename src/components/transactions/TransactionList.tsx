import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Button,
  CircularProgress,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { debounce } from 'lodash';
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

import AddTransactionButton from './AddTransactionButton';
import FilterComponent from './FilterComponent';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  fetchTransactions,
  deleteTransaction,
  FetchTransactionsParams,
} from '../../redux/slices/transactionSlice';
import { RootState } from '../../redux/store';
import { Transaction } from '../../redux/types/types';
import BinanceSyncDialog from '../common/BinanceSyncDialog';
import Pagination from '../common/Pagination';
import TruncateWithTooltip from '../common/TruncateWithTooltip';

const StyledTableContainer = styled(TableContainer)<{ maxTableHeight?: string | number }>(
  ({ maxTableHeight = '60vh' }) => ({
    maxHeight: maxTableHeight,
    overflow: 'auto',
    '& table': {
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
  })
);

const StickyHeaderCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  backgroundColor: theme.palette?.background?.paper || '#fff',
  fontWeight: 600,
}));

const NumericCell = styled(TableCell)({
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums lining-nums',
});

const NoWrapCell = styled(TableCell)({
  whiteSpace: 'nowrap',
});

const TextEllipsisCell = styled(TableCell)({
  maxWidth: 160,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const SIDE_CHIPS: Array<{ label: string; value: string }> = [
  { label: 'All', value: '' },
  { label: 'Buy', value: 'BUY' },
  { label: 'Sell', value: 'SELL' },
  { label: 'Deposit', value: 'DEPOSIT' },
  { label: 'Withdraw', value: 'WITHDRAW' },
];

const sideChipColor = (side: string): 'default' | 'success' | 'error' | 'info' | 'warning' => {
  switch (side) {
    case 'BUY':
      return 'success';
    case 'SELL':
      return 'error';
    case 'DEPOSIT':
      return 'info';
    case 'WITHDRAW':
      return 'warning';
    default:
      return 'default';
  }
};

interface TransactionListProps {
  symbol?: string;
  portfolioName?: string;
  maxTableHeight?: string | number;
}

const TransactionList = ({ symbol, portfolioName, maxTableHeight }: TransactionListProps) => {
  const dispatch = useAppDispatch();
  const { transactions, status, error, pagination } = useAppSelector(
    (state: RootState) => state.transactions
  );
  const portfolios = useAppSelector(state => state.portfolio.portfolios.map(p => p.name));
  const [filters, setFilters] = useState<FetchTransactionsParams>({
    symbol: symbol || undefined,
    startDate: undefined,
    endDate: undefined,
    portfolioName: portfolioName || undefined,
    side: undefined,
    paidWith: undefined,
    paidAmountOperator: 'eq',
    paidAmount: undefined,
    page: 0,
    size: 10,
    sort: 'dateUtc,desc',
  });

  const [deleteDialogId, setDeleteDialogId] = useState<number | null>(null);
  const [fullSyncOpen, setFullSyncOpen] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce(f => dispatch(fetchTransactions(f)), 500),
    []
  );

  const loadTransactions = (overrides?: Partial<FetchTransactionsParams>) => {
    dispatch(fetchTransactions({ ...filters, ...overrides }));
  };

  const handleRowsPerPageChange = (event: any) => {
    setFilters(prev => ({ ...prev, size: event.target.value as number, page: 0 }));
  };

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.size, filters.sort]);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page: page - 1 }));
  };

  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...filters, [filterName]: value, page: 0 };
    setFilters(newFilters);
    if (filterName === 'symbol') {
      debouncedFetch(newFilters);
    } else {
      dispatch(fetchTransactions(newFilters));
    }
  };

  const handleSideChip = (side: string) => {
    const newFilters = { ...filters, side: side || undefined, page: 0 };
    setFilters(newFilters);
    dispatch(fetchTransactions(newFilters));
  };

  const handleSort = (property: string) => {
    const isAsc = filters.sort?.split(',')[0] === property && filters.sort?.split(',')[1] === 'asc';
    const newSort = `${property},${isAsc ? 'desc' : 'asc'}`;
    setFilters(prev => ({ ...prev, sort: newSort, page: 0 }));
  };

  const handleApplyFilters = () => {
    dispatch(fetchTransactions(filters));
  };

  const handleDeleteConfirm = () => {
    if (deleteDialogId == null) return;
    dispatch(deleteTransaction(deleteDialogId)).then(action => {
      if (deleteTransaction.fulfilled.match(action)) {
        toast.success('Transaction deleted.');
      } else {
        toast.error('Failed to delete transaction.');
      }
    });
    setDeleteDialogId(null);
  };

  const formatDate = (dateUtc: string | undefined) => {
    if (!dateUtc) return 'N/A';
    try {
      return format(parseISO(dateUtc), 'yyyy-MM-dd HH:mm:ss');
    } catch {
      return 'Invalid Date';
    }
  };

  if (status === 'loading') {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (status === 'failed') {
    toast.error(`The request failed. ${error}`);
    return (
      <Container>
        <TableContainer component={Paper}>
          <Typography>No records were found</Typography>
        </TableContainer>
      </Container>
    );
  }

  const activeSide = filters.side || '';

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Transactions
      </Typography>

      {/* Action bar */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1, alignItems: 'center' }}>
        <AddTransactionButton
          defaultPortfolioName={portfolioName}
          variant='contained'
          color='primary'
        />
        {portfolioName && (
          <Button variant='outlined' color='secondary' onClick={() => setFullSyncOpen(true)}>
            Full Historical Sync
          </Button>
        )}
      </Box>

      {/* Quick side-filter chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
        {SIDE_CHIPS.map(chip => (
          <Chip
            key={chip.value}
            label={chip.label}
            color={activeSide === chip.value ? sideChipColor(chip.value) || 'primary' : 'default'}
            variant={activeSide === chip.value ? 'filled' : 'outlined'}
            onClick={() => handleSideChip(chip.value)}
            size='small'
            clickable
          />
        ))}
      </Box>

      <FilterComponent
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        portfolios={portfolios}
        selectedPortfolio={portfolioName || ''}
      />

      <Paper>
        <StyledTableContainer maxTableHeight={maxTableHeight}>
          <Table stickyHeader aria-label='Transactions table'>
            <TableHead>
              <TableRow>
                <StickyHeaderCell sortDirection={false as any}>
                  <TableSortLabel
                    active={filters.sort?.split(',')[0] === 'dateUtc'}
                    direction={filters.sort?.split(',')[1] as 'asc' | 'desc'}
                    onClick={() => handleSort('dateUtc')}
                  >
                    Date
                  </TableSortLabel>
                </StickyHeaderCell>
                <StickyHeaderCell>Side</StickyHeaderCell>
                <StickyHeaderCell>Pair</StickyHeaderCell>
                <StickyHeaderCell align='right'>Price</StickyHeaderCell>
                <StickyHeaderCell align='right'>Executed</StickyHeaderCell>
                <StickyHeaderCell>Symbol</StickyHeaderCell>
                <StickyHeaderCell>Paid With</StickyHeaderCell>
                <StickyHeaderCell align='right'>Paid Amount</StickyHeaderCell>
                <StickyHeaderCell align='right'>Fee Amount</StickyHeaderCell>
                <StickyHeaderCell>Fee Symbol</StickyHeaderCell>
                <StickyHeaderCell>Status</StickyHeaderCell>
                <StickyHeaderCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction: Transaction) => (
                  <TableRow key={transaction.id ?? transaction.dateUtc + transaction.pair}>
                    <NoWrapCell>{formatDate(transaction.dateUtc)}</NoWrapCell>
                    <TableCell>
                      <Chip
                        label={transaction.side}
                        color={sideChipColor(transaction.side ?? '')}
                        size='small'
                        variant='outlined'
                      />
                    </TableCell>
                    <TextEllipsisCell>
                      <TruncateWithTooltip text={transaction.pair || ''} maxWidth={160} />
                    </TextEllipsisCell>
                    <NumericCell>{transaction.price}</NumericCell>
                    <NumericCell>{transaction.executed}</NumericCell>
                    <TextEllipsisCell>
                      <TruncateWithTooltip text={transaction.symbol || ''} maxWidth={160} />
                    </TextEllipsisCell>
                    <TableCell>{transaction.paidWith}</TableCell>
                    <NumericCell>{transaction.paidAmount}</NumericCell>
                    <NumericCell>{transaction.feeAmount}</NumericCell>
                    <TableCell>{transaction.feeSymbol}</TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.processed ? 'Processed' : 'Unprocessed'}
                        color={transaction.processed ? 'success' : 'warning'}
                        size='small'
                      />
                    </TableCell>
                    <TableCell padding='none'>
                      {transaction.id != null && (
                        <Tooltip title='Delete transaction'>
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() => setDeleteDialogId(transaction.id!)}
                          >
                            <DeleteOutlineIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12}>
                    <Typography>No records were found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1,
        }}
      >
        <FormControl variant='outlined' style={{ minWidth: 120 }}>
          <InputLabel id='rows-per-page-label'>Rows per page</InputLabel>
          <Select
            labelId='rows-per-page-label'
            value={filters.size}
            onChange={e => handleRowsPerPageChange(e)}
            label='Rows per page'
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
        <Pagination
          currentPage={pagination.currentPage + 1}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogId != null} onClose={() => setDeleteDialogId(null)}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove the transaction and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogId(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Full historical sync dialog */}
      {portfolioName && (
        <BinanceSyncDialog
          portfolioName={portfolioName}
          open={fullSyncOpen}
          onClose={() => setFullSyncOpen(false)}
          exchangeName={'BINANCE'}
        />
      )}
    </Container>
  );
};

export default TransactionList;
