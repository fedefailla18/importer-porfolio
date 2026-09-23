import ReplayIcon from '@mui/icons-material/Replay';
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchBinanceSyncJobs, retryBinanceSyncJob } from '../../redux/slices/syncJobsSlice';
import { RootState } from '../../redux/store';
import { SyncJobStatus } from '../../redux/types/types';

const ENTITY_LABELS: Record<string, string> = {
  TRADES: 'Spot Trades',
  DEPOSITS: 'Deposits',
  WITHDRAWALS: 'Withdrawals',
  FIAT_ORDERS: 'Fiat Orders',
  CONVERT_TRADES: 'Convert Trades',
};

const STATUS_LABELS: Record<SyncJobStatus, string> = {
  PENDING: 'Pendiente',
  RUNNING: 'En ejecución',
  COMPLETED: 'Finalizada',
  FAILED: 'Error',
};

const STATUS_COLORS: Record<SyncJobStatus, 'default' | 'info' | 'success' | 'error'> = {
  PENDING: 'default',
  RUNNING: 'info',
  COMPLETED: 'success',
  FAILED: 'error',
};

const POLL_INTERVAL_MS = 4000;

/**
 * Shows the status of the most recent Binance full-sync batch (one job per data type),
 * polling while any job is still PENDING/RUNNING. Each job tracks its own chunks
 * (symbols or date windows) so a failure in one data type (e.g. withdrawals rate-limited)
 * never blocks or hides the progress of the others — see investracker's sync-job design.
 */
const SyncJobsPanel = () => {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state: RootState) => state.syncJobs.jobs);
  const retryingJobIds = useAppSelector((state: RootState) => state.syncJobs.retryingJobIds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    dispatch(fetchBinanceSyncJobs());
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const hasActiveJob = jobs.some(j => j.status === 'PENDING' || j.status === 'RUNNING');
    if (hasActiveJob && !intervalRef.current) {
      intervalRef.current = setInterval(() => dispatch(fetchBinanceSyncJobs()), POLL_INTERVAL_MS);
    } else if (!hasActiveJob && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [jobs, dispatch]);

  if (jobs.length === 0) {
    return null;
  }

  const latestBatchId = jobs[0].batchId;
  const latestJobs = jobs.filter(j => j.batchId === latestBatchId);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant='subtitle2' sx={{ mb: 1 }}>
        Sync Progress
      </Typography>
      <Stack spacing={1}>
        {latestJobs.map(job => (
          <Box
            key={job.id}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}
          >
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
              <Typography variant='body2'>
                {ENTITY_LABELS[job.entityType] || job.entityType}
              </Typography>
              <Stack direction='row' spacing={1} alignItems='center'>
                <Typography variant='caption' color='text.secondary'>
                  {job.chunksCompleted}/{job.chunksTotal}
                </Typography>
                <Chip
                  size='small'
                  label={STATUS_LABELS[job.status]}
                  color={STATUS_COLORS[job.status]}
                />
                {job.status === 'FAILED' && (
                  <Tooltip title={job.errorMessage || 'Reintentar'}>
                    <span>
                      <IconButton
                        size='small'
                        disabled={retryingJobIds.includes(job.id)}
                        onClick={() => dispatch(retryBinanceSyncJob(job.id))}
                      >
                        {retryingJobIds.includes(job.id) ? (
                          <CircularProgress size={16} />
                        ) : (
                          <ReplayIcon fontSize='small' />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
            {(job.status === 'RUNNING' || job.status === 'PENDING') && job.chunksTotal > 0 && (
              <LinearProgress
                variant='determinate'
                value={(job.chunksCompleted / job.chunksTotal) * 100}
                sx={{ mt: 0.5 }}
              />
            )}
            {job.status === 'FAILED' && job.errorMessage && (
              <Typography variant='caption' color='error' sx={{ display: 'block', mt: 0.5 }}>
                {job.errorMessage}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default SyncJobsPanel;
