// src/components/holdings/HoldingListPage.tsx
import styled from '@emotion/styled';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  Input,
  Theme,
  Tooltip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { HoldingDto } from '../../redux/types/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface HoldingListPageProps {
  holdings: HoldingDto[];
  portfolioName: string;
  setPriceMultiplier: Dispatch<SetStateAction<{ [key: number]: number }>>;
  setPredictionBtc: Dispatch<SetStateAction<{ [key: number]: number }>>;
  setPredictionUsdt: Dispatch<SetStateAction<{ [key: number]: number }>>;
  priceMultiplier: {
    [key: number]: number;
  };
}

const StyledTableContainer = styled(TableContainer)({
  maxHeight: '60vh',
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
});

const StickyTableCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  backgroundColor: (theme as Theme).palette?.background?.paper || '#fff',
  zIndex: 2,
}));

const StickyHeaderCell = styled(StickyTableCell)({
  top: 0,
  zIndex: 1,
});

const formatNumber = (value: number, decimals: number = 2) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const HoldingListPage = ({
  holdings,
  portfolioName,
  setPriceMultiplier,
  setPredictionBtc,
  setPredictionUsdt,
  priceMultiplier,
}: HoldingListPageProps) => {
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const initialPriceMultiplier = holdings.reduce(
      (acc, _, index) => {
        acc[index] = 1;
        return acc;
      },
      {} as { [key: number]: number }
    );
    setPriceMultiplier(initialPriceMultiplier);

    holdings.forEach((holding, index) => {
      setPredictionUsdt(prev => ({
        ...prev,
        [index]: holding?.currentPositionInUsdt || 0,
      }));
      setPredictionBtc(prev => ({
        ...prev,
        [index]: holding?.amountInBtc || 0,
      }));
    });
  }, []);

  const handleSort = (field: string) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const sortedHoldings = holdings.slice().sort((a, b) => {
    if (sortBy === 'symbol') {
      return sortDirection === 'asc'
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    } else if (sortBy === 'amount') {
      const aValue = a.amount ?? 0;
      const bValue = b.amount ?? 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortBy === 'totalAmountBought') {
      const aValue = a.totalAmountBought ?? 0;
      const bValue = b.totalAmountBought ?? 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortBy === 'totalAmountSold') {
      const aValue = a.totalAmountSold ?? 0;
      const bValue = b.totalAmountSold ?? 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortBy === 'priceInBtc') {
      const aValue = a.priceInBtc ?? 0;
      const bValue = b.priceInBtc ?? 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortBy === 'priceInUsdt') {
      const aValue = a.priceInUsdt ?? 0;
      const bValue = b.priceInUsdt ?? 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortBy === 'amountInBtc') {
      const aValue = a.amountInBtc ?? 0;
      const bValue = b.amountInBtc ?? 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortBy === 'currentPositionInUsdt') {
      const aValue = a.currentPositionInUsdt ?? 0;
      const bValue = b.currentPositionInUsdt ?? 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortBy === 'percentage') {
      const aValue = a.percentage ?? 0;
      const bValue = b.percentage ?? 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortBy === 'stableTotalCost') {
      const aValue = a.stableTotalCost ?? 0;
      const bValue = b.stableTotalCost ?? 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortBy === 'totalRealizedProfitUsdt') {
      const aValue = a.totalRealizedProfitUsdt ?? 0;
      const bValue = b.totalRealizedProfitUsdt ?? 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  return (
    <StyledTableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StickyHeaderCell>#</StickyHeaderCell>
            <StickyHeaderCell>Symbol</StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='The amount of cryptocurrency held in its native units'>
                <TableSortLabel
                  active={sortBy === 'amount'}
                  direction={sortBy === 'amount' ? sortDirection : 'asc'}
                  onClick={() => handleSort('amount')}
                >
                  Amount
                </TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell style={{ display: 'none' }}>
              <Tooltip title='The total amount of this cryptocurrency that has been bought across all transactions'>
                <TableSortLabel
                  active={sortBy === 'totalAmountBought'}
                  direction={sortBy === 'totalAmountBought' ? sortDirection : 'asc'}
                  onClick={() => handleSort('totalAmountBought')}
                >
                  Total Bought
                </TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell style={{ display: 'none' }}>
              <Tooltip title='The total amount of this cryptocurrency that has been sold across all transactions'>
                <TableSortLabel
                  active={sortBy === 'totalAmountSold'}
                  direction={sortBy === 'totalAmountSold' ? sortDirection : 'asc'}
                  onClick={() => handleSort('totalAmountSold')}
                >
                  Total Sold
                </TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='The current price of one unit of the cryptocurrency in BTC'>
                <TableSortLabel
                  active={sortBy === 'priceInBtc'}
                  direction={sortBy === 'priceInBtc' ? sortDirection : 'asc'}
                  onClick={() => handleSort('priceInBtc')}
                >
                  Price (BTC)
                </TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='The current price of one unit of the cryptocurrency in USDT'>
                <TableSortLabel
                  active={sortBy === 'priceInUsdt'}
                  direction={sortBy === 'priceInUsdt' ? sortDirection : 'asc'}
                  onClick={() => handleSort('priceInUsdt')}
                >
                  Price (USDT)
                </TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='The value of the holding converted to BTC'>
                <TableSortLabel
                  active={sortBy === 'amountInBtc'}
                  direction={sortBy === 'amountInBtc' ? sortDirection : 'asc'}
                  onClick={() => handleSort('amountInBtc')}
                >
                  Amount (BTC)
                </TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='The value of the holding converted to USDT'>
                <TableSortLabel
                  active={sortBy === 'currentPositionInUsdt'}
                  direction={sortBy === 'currentPositionInUsdt' ? sortDirection : 'asc'}
                  onClick={() => handleSort('currentPositionInUsdt')}
                >
                  Current Position (USDT)
                </TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='The percentage this holding represents in the portfolio'>
                <TableSortLabel
                  active={sortBy === 'percentage'}
                  direction={sortBy === 'percentage' ? sortDirection : 'asc'}
                  onClick={() => handleSort('percentage')}
                >
                  Percentage
                </TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='The total cost in stable currency (USDT) spent to acquire this holding'>
                <TableSortLabel
                  active={sortBy === 'stableTotalCost'}
                  direction={sortBy === 'stableTotalCost' ? sortDirection : 'asc'}
                  onClick={() => handleSort('stableTotalCost')}
                >
                  Total Cost (USDT)
                </TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='The total profit realized from selling this cryptocurrency, in USDT'>
                <TableSortLabel
                  active={sortBy === 'totalRealizedProfitUsdt'}
                  direction={sortBy === 'totalRealizedProfitUsdt' ? sortDirection : 'asc'}
                  onClick={() => handleSort('totalRealizedProfitUsdt')}
                >
                  Realized Profit (USDT)
                </TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='Price multiplier for predictions'>
                <TableSortLabel>Price Multiplier</TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='Predicted value in USDT based on price multiplier'>
                <TableSortLabel>Prediction (USDT)</TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
            <StickyHeaderCell>
              <Tooltip title='Predicted value in BTC based on price multiplier'>
                <TableSortLabel>Prediction (BTC)</TableSortLabel>
              </Tooltip>
            </StickyHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedHoldings?.map((holding: HoldingDto, index: number) => (
            <TableRow key={holding.symbol}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Link to={`/portfolio/${portfolioName}/${holding.symbol}`}>{holding.symbol}</Link>
              </TableCell>
              <TableCell>{formatNumber(holding.amount, 6)}</TableCell>
              <TableCell style={{ display: 'none' }}>
                {holding.totalAmountBought !== undefined
                  ? formatNumber(holding.totalAmountBought, 6)
                  : '-'}
              </TableCell>
              <TableCell style={{ display: 'none' }}>
                {holding.totalAmountSold !== undefined
                  ? formatNumber(holding.totalAmountSold, 6)
                  : '-'}
              </TableCell>
              <TableCell>
                {holding.priceInBtc !== undefined ? formatNumber(holding.priceInBtc, 8) : '-'}
              </TableCell>
              <TableCell>
                {holding.priceInUsdt !== undefined ? formatCurrency(holding.priceInUsdt) : '-'}
              </TableCell>
              <TableCell>{formatNumber(holding.amountInBtc, 8)}</TableCell>
              <TableCell>
                {holding.currentPositionInUsdt !== undefined
                  ? formatCurrency(holding.currentPositionInUsdt)
                  : '-'}
              </TableCell>
              <TableCell>
                {holding.percentage !== undefined ? formatNumber(holding.percentage, 2) + '%' : '-'}
              </TableCell>
              <TableCell>
                {holding.stableTotalCost !== undefined
                  ? formatCurrency(holding.stableTotalCost)
                  : '-'}
              </TableCell>
              <TableCell>
                {holding.totalRealizedProfitUsdt !== undefined
                  ? formatCurrency(holding.totalRealizedProfitUsdt)
                  : '-'}
              </TableCell>
              <TableCell>
                <Input
                  type='number'
                  value={priceMultiplier[index]}
                  onChange={e => {
                    const multiplier = e.target.value !== '' ? Number(e.target.value) : 1;

                    setPriceMultiplier(prevState => ({
                      ...prevState,
                      [index]: multiplier,
                    }));

                    const currentPositionInUsdt = holding.currentPositionInUsdt ?? 0;
                    const amountInBtc = holding.amountInBtc;

                    setPredictionUsdt(prevState => ({
                      ...prevState,
                      [index]: multiplier * currentPositionInUsdt,
                    }));

                    setPredictionBtc(prevState => ({
                      ...prevState,
                      [index]: multiplier * amountInBtc,
                    }));
                  }}
                />
              </TableCell>
              <TableCell>
                {formatCurrency(
                  (priceMultiplier[index] || 1) * (holding.currentPositionInUsdt ?? 0)
                )}
              </TableCell>
              <TableCell>
                {formatNumber((priceMultiplier[index] || 1) * holding.amountInBtc, 8)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default HoldingListPage;
