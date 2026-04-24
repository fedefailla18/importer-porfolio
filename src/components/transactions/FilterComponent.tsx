// src/components/common/FilterComponent.tsx
import React from 'react';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FetchTransactionsParams } from '../../redux/slices/transactionSlice';

interface FilterComponentProps {
  filters: FetchTransactionsParams;
  portfolios?: string[];
  selectedPortfolio?: string;
  onFilterChange: (filterName: string, value: string) => void;
  onApplyFilters: () => void;
}

const FilterComponent = ({
  filters,
  portfolios,
  selectedPortfolio,
  onFilterChange,
  onApplyFilters,
}: FilterComponentProps) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>Filters</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label='Symbol'
              value={filters.symbol || ''}
              onChange={e => onFilterChange('symbol', e.target.value)}
              variant='filled'
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label='Start Date'
                value={filters.startDate ? new Date(filters.startDate) : null}
                onChange={value => onFilterChange('startDate', value ? value.toISOString() : '')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'filled',
                    size: 'small',
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label='End Date'
                value={filters.endDate ? new Date(filters.endDate) : null}
                onChange={value => onFilterChange('endDate', value ? value.toISOString() : '')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'filled',
                    size: 'small',
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label='Portfolio Name'
              value={selectedPortfolio || ''}
              select
              onChange={e => onFilterChange('portfolioName', e.target.value)}
              variant='filled'
              size='small'
            >
              <MenuItem value=''>All</MenuItem>
              {portfolios?.map(portfolio => (
                <MenuItem key={portfolio} value={portfolio}>
                  {portfolio}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Side</InputLabel>
              <Select
                value={filters.side}
                onChange={e => onFilterChange('side', e.target.value as string)}
                variant='filled'
                size='small'
              >
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='BUY'>Buy</MenuItem>
                <MenuItem value='SELL'>Sell</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label='Paid With'
              value={filters.paidWith}
              onChange={e => onFilterChange('paidWith', e.target.value)}
              variant='filled'
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Paid Amount Operator</InputLabel>
              <Select
                value={filters.paidAmountOperator}
                onChange={e => onFilterChange('paidAmountOperator', e.target.value as string)}
                variant='filled'
                size='small'
              >
                <MenuItem value=''>All</MenuItem>
                <Tooltip title='Equal to' placement='right'>
                  <MenuItem value='='>=</MenuItem>
                </Tooltip>
                <Tooltip title='Less than' placement='right'>
                  <MenuItem value='<'>&lt;</MenuItem>
                </Tooltip>
                <Tooltip title='Greater than' placement='right'>
                  <MenuItem value='>'>&gt;</MenuItem>
                </Tooltip>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label='Paid Amount'
              type='number'
              value={filters.paidAmount}
              onChange={e => onFilterChange('paidAmount', e.target.value)}
              variant='standard'
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' color='primary' onClick={onApplyFilters}>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterComponent;
