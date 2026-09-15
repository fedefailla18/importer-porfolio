import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import SyncJobsPanel from './SyncJobsPanel';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  syncBinanceFull,
  syncMexcFull,
  resetFullSyncStatus,
} from '../../redux/slices/exchangeConfigSlice';
import { fetchBinanceSyncJobs } from '../../redux/slices/syncJobsSlice';
import { RootState } from '../../redux/store';
import { ExchangeName } from '../../redux/types/types';

interface BinanceSyncDialogProps {
  portfolioName: string;
  exchangeName: ExchangeName;
  open: boolean;
  onClose: () => void;
}

const DEFAULT_START = new Date('2017-01-01');

const BinanceSyncDialog = ({
  portfolioName,
  exchangeName,
  open,
  onClose,
}: BinanceSyncDialogProps) => {
  const dispatch = useAppDispatch();
  const fullSyncStatus = useAppSelector((state: RootState) => state.exchangeConfig.fullSyncStatus);
  const [startDate, setStartDate] = useState<Date | null>(DEFAULT_START);
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const isBinance = exchangeName === 'BINANCE';

  const handleSyncError = (msg: string) => {
    if (msg?.includes('not configured')) {
      toast.error(
        `${exchangeName} API keys not configured. Go to Settings to connect your account.`
      );
    } else if (msg?.includes('already in progress')) {
      toast.warning(msg);
      if (isBinance) {
        dispatch(fetchBinanceSyncJobs());
      }
    } else {
      toast.error(`Could not start sync: ${msg || 'Unknown error'}`);
    }
  };

  const syncParams = {
    portfolio: portfolioName,
    startDate: startDate ? startDate.getTime() : undefined,
    endDate: endDate ? endDate.getTime() : undefined,
  };

  const handleSync = () => {
    if (isBinance) {
      dispatch(syncBinanceFull(syncParams)).then(action => {
        dispatch(resetFullSyncStatus());
        if (syncBinanceFull.fulfilled.match(action)) {
          // Job-tracked: keep the dialog open so SyncJobsPanel shows live per-data-type progress
          // instead of a single opaque "started" toast.
          dispatch(fetchBinanceSyncJobs());
        } else {
          handleSyncError(action.payload as string);
        }
      });
    } else {
      dispatch(syncMexcFull(syncParams)).then(action => {
        dispatch(resetFullSyncStatus());
        if (syncMexcFull.fulfilled.match(action)) {
          toast.info(
            `${exchangeName} full sync started for ${portfolioName}. You will be notified here when it completes.`,
            { autoClose: 6000 }
          );
          onClose();
        } else {
          handleSyncError(action.payload as string);
        }
      });
    }
  };

  const loading = fullSyncStatus === 'loading';

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        Full Historical Sync from {exchangeName === 'BINANCE' ? 'Binance' : 'MexC'}
      </DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {isBinance
            ? 'Fetches all spot trades, deposits, withdrawals, fiat orders and convert trades.'
            : 'Fetches all spot trades, deposits and withdrawals.'}{' '}
          Portfolio: <strong>{portfolioName}</strong>. Leave the default dates to sync everything
          since 2017.
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label='Start date'
            value={startDate}
            onChange={v => setStartDate(v)}
            slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: 2 } } }}
          />
          <DatePicker
            label='End date'
            value={endDate}
            onChange={v => setEndDate(v)}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
        </LocalizationProvider>
        {isBinance && <SyncJobsPanel />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {isBinance ? 'Close' : 'Cancel'}
        </Button>
        <Button onClick={handleSync} variant='contained' color='secondary' disabled={loading}>
          {loading ? <CircularProgress size={20} color='inherit' /> : 'Start Full Sync'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BinanceSyncDialog;
