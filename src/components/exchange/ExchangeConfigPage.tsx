// src/components/exchange/ExchangeConfigPage.tsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchExchangeConfigs,
  resetSaveStatus,
  saveExchangeConfig,
} from '../../redux/slices/exchangeConfigSlice';
import { RootState } from '../../redux/store';
import { ExchangeName } from '../../redux/types/types';

type SupportedExchange = 'BINANCE' | 'MEXC' | 'IOL';

const EXCHANGE_META: Record<
  SupportedExchange,
  { label: string; keyLabel: string; secretLabel: string; hint: string }
> = {
  BINANCE: {
    label: 'Binance',
    keyLabel: 'API Key',
    secretLabel: 'API Secret',
    hint: 'Provide read-only keys with no withdrawal permissions.',
  },
  MEXC: {
    label: 'MexC',
    keyLabel: 'API Key',
    secretLabel: 'API Secret',
    hint: 'Provide read-only keys with no withdrawal permissions.',
  },
  IOL: {
    label: 'InvertirOnline (IOL)',
    keyLabel: 'Username',
    secretLabel: 'Password',
    hint: 'Use your standard invertironline.com login credentials. Your password is encrypted at rest.',
  },
};

const ExchangeConfigPage = () => {
  const dispatch = useAppDispatch();
  const { configs, fetchStatus, saveStatus } = useAppSelector(
    (state: RootState) => state.exchangeConfig
  );

  const [selectedExchange, setSelectedExchange] = useState<SupportedExchange>('BINANCE');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  useEffect(() => {
    dispatch(fetchExchangeConfigs());
  }, [dispatch]);

  useEffect(() => {
    setApiKey('');
    setApiSecret('');
  }, [selectedExchange]);

  useEffect(() => {
    if (saveStatus === 'succeeded') {
      const { label } = EXCHANGE_META[selectedExchange];
      toast.success(`${label} credentials saved successfully`);
      setApiKey('');
      setApiSecret('');
      dispatch(fetchExchangeConfigs());
      dispatch(resetSaveStatus());
    }
    if (saveStatus === 'failed') {
      toast.error(`Failed to save ${EXCHANGE_META[selectedExchange].label} configuration`);
      dispatch(resetSaveStatus());
    }
  }, [saveStatus, dispatch, selectedExchange]);

  const handleSave = () => {
    const { keyLabel, secretLabel } = EXCHANGE_META[selectedExchange];
    if (!apiKey.trim() || !apiSecret.trim()) {
      toast.warning(`Both ${keyLabel} and ${secretLabel} are required`);
      return;
    }
    dispatch(
      saveExchangeConfig({
        exchangeName: selectedExchange as ExchangeName,
        apiKey: apiKey.trim(),
        apiSecret: apiSecret.trim(),
      })
    );
  };

  const binanceConfig = configs.find(c => c.exchangeName === 'BINANCE');
  const mexcConfig = configs.find(c => c.exchangeName === 'MEXC');
  const iolConfig = configs.find(c => c.exchangeName === 'IOL');

  const formatLastSync = (ts: number | null) => {
    if (!ts) return 'Never';
    return new Date(ts).toLocaleString();
  };

  const maskKey = (key: string) =>
    key.length > 8 ? `${key.slice(0, 4)}${'•'.repeat(8)}${key.slice(-4)}` : '••••••••';

  const meta = EXCHANGE_META[selectedExchange];

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Typography variant='h5' fontWeight={700} gutterBottom>
        Exchange Settings
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
        Connect your exchange accounts. Credentials are encrypted at rest and never returned by the
        API.
      </Typography>

      {fetchStatus === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Connected accounts overview */}
      {fetchStatus === 'succeeded' && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {(
            [
              { name: 'Binance', cfg: binanceConfig },
              { name: 'MexC', cfg: mexcConfig },
              { name: 'InvertirOnline', cfg: iolConfig },
            ] as const
          ).map(({ name, cfg }) => (
            <Grid item xs={12} sm={4} key={name}>
              <Card variant='outlined'>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Typography variant='subtitle1' fontWeight={600}>
                      {name}
                    </Typography>
                    <Chip
                      label={cfg ? 'Connected' : 'Not connected'}
                      color={cfg ? 'success' : 'default'}
                      size='small'
                    />
                  </Box>
                  {cfg && (
                    <>
                      <Typography variant='body2' color='text.secondary'>
                        Key: {maskKey(cfg.apiKey)}
                      </Typography>
                      {cfg.lastSyncTimestamp != null && (
                        <Typography variant='body2' color='text.secondary'>
                          Last sync: {formatLastSync(cfg.lastSyncTimestamp)}
                        </Typography>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Connect / update form */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' fontWeight={600}>
            {configs.find(c => c.exchangeName === selectedExchange)
              ? `Update ${meta.label}`
              : `Connect ${meta.label}`}
          </Typography>
          <FormControl size='small' sx={{ minWidth: 200 }}>
            <InputLabel id='exchange-select-label'>Exchange</InputLabel>
            <Select
              labelId='exchange-select-label'
              value={selectedExchange}
              label='Exchange'
              onChange={e => setSelectedExchange(e.target.value as SupportedExchange)}
            >
              <MenuItem value='BINANCE'>Binance</MenuItem>
              <MenuItem value='MEXC'>MexC</MenuItem>
              <MenuItem value='IOL'>InvertirOnline (IOL)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          {meta.hint}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={meta.keyLabel}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            fullWidth
            autoComplete='off'
          />
          <TextField
            label={meta.secretLabel}
            value={apiSecret}
            onChange={e => setApiSecret(e.target.value)}
            fullWidth
            type='password'
            autoComplete='new-password'
          />
          <Box>
            <Button
              variant='contained'
              onClick={handleSave}
              disabled={saveStatus === 'loading'}
              startIcon={
                saveStatus === 'loading' ? (
                  <CircularProgress size={16} color='inherit' />
                ) : undefined
              }
            >
              {saveStatus === 'loading' ? 'Saving…' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ExchangeConfigPage;
