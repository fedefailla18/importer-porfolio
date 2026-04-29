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

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { syncMexcFull, resetFullSyncStatus } from '../../redux/slices/exchangeConfigSlice';
import { RootState } from '../../redux/store';

interface MexcSyncDialogProps {
  portfolioName: string;
  open: boolean;
  onClose: () => void;
}

const DEFAULT_START = new Date('2017-01-01');

const MexcSyncDialog = ({ portfolioName, open, onClose }: MexcSyncDialogProps) => {
  const dispatch = useAppDispatch();
  const fullSyncStatus = useAppSelector((state: RootState) => state.exchangeConfig.fullSyncStatus);
  const [startDate, setStartDate] = useState<Date | null>(DEFAULT_START);
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleSync = () => {
    dispatch(
      syncMexcFull({
        portfolio: portfolioName,
        startDate: startDate ? startDate.getTime() : undefined,
        endDate: endDate ? endDate.getTime() : undefined,
      })
    ).then(action => {
      dispatch(resetFullSyncStatus());
      if (syncMexcFull.fulfilled.match(action)) {
        toast.info(
          `Full MexC sync started for ${portfolioName}. You will be notified here when it completes.`,
          { autoClose: 6000 }
        );
        onClose();
      } else {
        const msg = action.payload as string;
        if (msg?.includes('not configured')) {
          toast.error('MexC API keys not configured. Go to Settings to connect your account.');
        } else {
          toast.error(`Could not start MexC sync: ${msg || 'Unknown error'}`);
        }
      }
    });
  };

  const loading = fullSyncStatus === 'loading';

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Full Historical Sync from MexC</DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Fetches all spot trades, deposits and withdrawals from MexC for{' '}
          <strong>{portfolioName}</strong>. Leave the default dates to sync everything since 2017.
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSync} variant='contained' color='secondary' disabled={loading}>
          {loading ? <CircularProgress size={20} color='inherit' /> : 'Start Full Sync'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MexcSyncDialog;
