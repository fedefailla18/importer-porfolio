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
  Paper,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchExchangeConfigs,
  saveExchangeConfig,
  resetSaveStatus,
} from '../../redux/slices/exchangeConfigSlice';
import { RootState } from '../../redux/store';

const ExchangeConfigPage = () => {
  const dispatch = useAppDispatch();
  const { configs, fetchStatus, saveStatus } = useAppSelector(
    (state: RootState) => state.exchangeConfig
  );

  const [selectedExchange, setSelectedExchange] = useState<'BINANCE' | 'MEXC'>('BINANCE');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  useEffect(() => {
    dispatch(fetchExchangeConfigs());
  }, [dispatch]);

  useEffect(() => {
    if (saveStatus === 'succeeded') {
      toast.success(`${selectedExchange} API keys saved successfully`);
      setApiKey('');
      setApiSecret('');
      dispatch(fetchExchangeConfigs());
      dispatch(resetSaveStatus());
    }
    if (saveStatus === 'failed') {
      toast.error(`Failed to save ${selectedExchange} configuration`);
      dispatch(resetSaveStatus());
    }
  }, [saveStatus, dispatch, selectedExchange]);

  const handleSave = () => {
    if (!apiKey.trim() || !apiSecret.trim()) {
      toast.warning('Both API Key and API Secret are required');
      return;
    }
    dispatch(
      saveExchangeConfig({
        exchangeName: selectedExchange,
        apiKey: apiKey.trim(),
        apiSecret: apiSecret.trim(),
      })
    );
  };

  const binanceConfig = configs.find(c => c.exchangeName === 'BINANCE');
  const mexcConfig = configs.find(c => c.exchangeName === 'MEXC');

  const formatLastSync = (ts: number | null) => {
    if (!ts) return 'Never';
    return new Date(ts).toLocaleString();
  };

  const maskApiKey = (key: string) =>
    key.length > 8 ? `${key.slice(0, 4)}${'•'.repeat(8)}${key.slice(-4)}` : '••••••••';

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Typography variant='h5' fontWeight={700} gutterBottom>
        Exchange Settings
      </Typography>

      {fetchStatus === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {fetchStatus === 'succeeded' && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card variant='outlined' sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant='h6' fontWeight={600}>
                    Binance
                  </Typography>
                  {binanceConfig ? (
                    <Chip label='Connected' color='success' size='small' />
                  ) : (
                    <Chip label='Not Connected' color='default' size='small' />
                  )}
                </Box>
                {binanceConfig && (
                  <>
                    <Typography variant='body2' color='text.secondary'>
                      API Key: {maskApiKey(binanceConfig.apiKey)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Last sync: {formatLastSync(binanceConfig.lastSyncTimestamp)}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant='outlined' sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant='h6' fontWeight={600}>
                    MexC
                  </Typography>
                  {mexcConfig ? (
                    <Chip label='Connected' color='success' size='small' />
                  ) : (
                    <Chip label='Not Connected' color='default' size='small' />
                  )}
                </Box>
                {mexcConfig && (
                  <>
                    <Typography variant='body2' color='text.secondary'>
                      API Key: {maskApiKey(mexcConfig.apiKey)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Last sync: {formatLastSync(mexcConfig.lastSyncTimestamp)}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' fontWeight={600}>
            Connect Exchange
          </Typography>
          <FormControl size='small' sx={{ minWidth: 150 }}>
            <InputLabel id='exchange-select-label'>Exchange</InputLabel>
            <Select
              labelId='exchange-select-label'
              value={selectedExchange}
              label='Exchange'
              onChange={e => setSelectedExchange(e.target.value as 'BINANCE' | 'MEXC')}
            >
              <MenuItem value='BINANCE'>Binance</MenuItem>
              <MenuItem value='MEXC'>MexC</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Your API Secret is encrypted at rest. Provide read-only keys with no withdrawal
          permissions.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label='API Key'
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            fullWidth
            autoComplete='off'
          />
          <TextField
            label='API Secret'
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
              {saveStatus === 'loading' ? 'Saving…' : 'Save Keys'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ExchangeConfigPage;
