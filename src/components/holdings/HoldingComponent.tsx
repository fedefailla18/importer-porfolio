// src/components/holdings/HoldingComponent.tsx
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { fetchHoldingDetails } from '../../redux/slices/holdingDetailsSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Select, CircularProgress, Alert } from '@mui/material';
import TransactionList from '../transactions/TransactionList';

interface NumberFormatOptionsStyleRegistry {
  decimal: never;
  percent: never;
  currency: never;
}

const HoldingComponent = () => {
  const { portfolioName, symbol } = useParams<{
    portfolioName: string;
    symbol: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    holdingDetails,
    status: holdingStatus,
    error: holdingError,
  } = useAppSelector(state => state.holdingDetails);

  useEffect(() => {
    if (portfolioName && symbol) {
      dispatch(fetchHoldingDetails({ portfolioName, symbol }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioName, symbol]);

  const handleHoldingChange = (event: any) => {
    const newSymbol = event.target.value as string;
    navigate(`/holdings/${portfolioName}/${newSymbol}`);
  };

  const formatNumber = (
    number: number,
    minimumFractionDigits: number,
    maximumFractionDigits: number,
    style?: keyof NumberFormatOptionsStyleRegistry,
    currency?: string
  ) => {
    return (
      new Intl.NumberFormat('en-US', {
        minimumFractionDigits,
        maximumFractionDigits,
        style,
        currency,
      }).format(number) || 'Not available'
    );
  };

  const renderHoldingDetails = () => {
    if (holdingStatus === 'loading') return <CircularProgress />;
    if (holdingStatus === 'failed') return <Alert severity='error'>{holdingError}</Alert>;
    if (!holdingDetails) return <Typography>No holding details available</Typography>;

    return (
      <div>
        <Typography>
          Amount: {formatNumber(holdingDetails.amount, 6, 6, undefined, undefined)}
        </Typography>
        <Typography>
          Total Amount Bought:{' '}
          {formatNumber(holdingDetails?.totalAmountBought ?? 0, 6, 6, undefined, undefined)}
        </Typography>
        <Typography>
          Total Amount Sold:{' '}
          {formatNumber(holdingDetails?.totalAmountSold ?? 0, 6, 6, undefined, undefined)}
        </Typography>
        <Typography>
          Price in BTC: {formatNumber(holdingDetails?.priceInBtc ?? 0, 6, 6, undefined, undefined)}
        </Typography>
        <Typography>
          Price in USDT: {formatNumber(holdingDetails?.priceInUsdt ?? 0, 2, 2, 'currency', 'USD')}
        </Typography>
        <Typography>
          Amount in BTC: {formatNumber(holdingDetails.amountInBtc, 6, 6, undefined, undefined)}
        </Typography>
        <Typography>
          Current Position in USDT:{' '}
          {formatNumber(holdingDetails?.currentPositionInUsdt ?? 0, 2, 2, 'currency', 'USD')}
        </Typography>
        <Typography>
          Percentage: {formatNumber(holdingDetails?.percentage ?? 0, 2, 2, 'percent', undefined)}%
        </Typography>
        <Typography>
          Total Cost Basis:{' '}
          {formatNumber(holdingDetails?.stableTotalCost ?? 0, 2, 2, 'currency', 'USD')}
        </Typography>
        <Typography>
          Total Realized Profit:{' '}
          {formatNumber(holdingDetails?.totalRealizedProfitUsdt ?? 0, 2, 2, 'currency', 'USD')}
        </Typography>
      </div>
    );
  };

  return (
    <div>
      <Select
        value={holdingDetails}
        onChange={handleHoldingChange}
        style={{ marginBottom: '1rem' }}
      ></Select>

      <div>
        <Paper style={{ marginBottom: '1rem', padding: '1rem' }}>
          <Typography variant='h6'>Holding Stats for {symbol}</Typography>
          {renderHoldingDetails()}
        </Paper>

        <Typography variant='h6' style={{ marginBottom: '1rem' }}>
          Transactions for {symbol}
        </Typography>
        <TransactionList symbol={symbol} portfolioName={portfolioName} />
      </div>
    </div>
  );
};

export default HoldingComponent;
