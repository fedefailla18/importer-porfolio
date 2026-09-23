import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  consolidatePortfolio,
  fetchMyPortfolios,
  resetConsolidateStatus,
} from '../../redux/slices/portfolioSlice';
import { RootState } from '../../redux/store';

interface ConsolidateDialogProps {
  /** The manually-managed portfolio the user is currently viewing — always the consolidate target. */
  targetPortfolioName: string;
  open: boolean;
  onClose: () => void;
  onConsolidated: () => void;
}

/**
 * Lets the user merge an exchange-synced portfolio's transactions into the manual portfolio
 * they're currently viewing — the explicit "I've compared them, bring the exchange data in" step.
 * Never happens automatically; see PortfolioExchangesGuide / docs/architecture.md.
 */
const ConsolidateDialog = ({
  targetPortfolioName,
  open,
  onClose,
  onConsolidated,
}: ConsolidateDialogProps) => {
  const dispatch = useAppDispatch();
  const { myPortfolios, myPortfoliosStatus, consolidateStatus, consolidateResult } = useAppSelector(
    (state: RootState) => state.portfolio
  );
  const [source, setSource] = useState('');

  useEffect(() => {
    if (open) {
      dispatch(fetchMyPortfolios());
      dispatch(resetConsolidateStatus());
      setSource('');
    }
  }, [open, dispatch]);

  const exchangePortfolios = myPortfolios.filter(p => Boolean(p.exchangeName));
  const loading = consolidateStatus === 'loading';

  const handleConsolidate = () => {
    if (!source) return;
    dispatch(consolidatePortfolio({ source, target: targetPortfolioName })).then(action => {
      if (consolidatePortfolio.fulfilled.match(action)) {
        const { movedCount, skippedCount } = action.payload;
        toast.success(
          `Consolidated ${movedCount} transaction${movedCount === 1 ? '' : 's'} from ${source}` +
            (skippedCount > 0 ? ` (${skippedCount} already present, skipped)` : '') +
            ` into ${targetPortfolioName}.`
        );
        onConsolidated();
        onClose();
      } else {
        toast.error(`Consolidate failed: ${(action.payload as string) || 'Unknown error'}`);
      }
    });
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Consolidate into {targetPortfolioName}</DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Moves every transaction from an exchange-synced portfolio into{' '}
          <strong>{targetPortfolioName}</strong>. Safe to run again later — it only moves what
          hasn't already been consolidated.
        </Typography>

        {myPortfoliosStatus === 'succeeded' && exchangePortfolios.length === 0 && (
          <Alert severity='info' sx={{ mb: 2 }}>
            No exchange-synced portfolios yet. Connect and sync Binance or MexC under Exchanges
            first.
          </Alert>
        )}

        <TextField
          select
          fullWidth
          size='small'
          label='Consolidate from'
          value={source}
          onChange={e => setSource(e.target.value)}
          disabled={exchangePortfolios.length === 0 || loading}
        >
          {exchangePortfolios.map(p => (
            <MenuItem key={p.id} value={p.name}>
              {p.name} ({p.exchangeName})
            </MenuItem>
          ))}
        </TextField>

        {consolidateResult && (
          <Alert severity='success' sx={{ mt: 2 }}>
            Moved {consolidateResult.movedCount}, skipped {consolidateResult.skippedCount}.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConsolidate}
          variant='contained'
          color='secondary'
          disabled={!source || loading}
        >
          {loading ? <CircularProgress size={20} color='inherit' /> : 'Consolidate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsolidateDialog;
