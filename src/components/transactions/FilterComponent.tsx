// src/components/common/FilterComponent.tsx
import React from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { FetchTransactionsParams } from "../../redux/slices/transactionSlice";

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
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Symbol"
          value={filters.symbol || ""}
          onChange={(e) => onFilterChange("symbol", e.target.value)}
          variant="filled"
          size="small"
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Start Date"
          type="date"
          value={filters.startDate || ""}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="filled"
          size="small"
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="End Date"
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="filled"
          size="small"
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Portfolio Name"
          value={selectedPortfolio || ""}
          select
          onChange={(e) => onFilterChange("portfolioName", e.target.value)}
          variant="filled"
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          {portfolios?.map((portfolio) => (
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
            onChange={(e) => onFilterChange("side", e.target.value as string)}
            variant="filled"
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="BUY">Buy</MenuItem>
            <MenuItem value="SELL">Sell</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Paid With"
          value={filters.paidWith}
          onChange={(e) => onFilterChange("paidWith", e.target.value)}
          variant="filled"
          size="small"
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <FormControl fullWidth>
          <InputLabel>Paid Amount Operator</InputLabel>
          <Select
            value={filters.paidAmountOperator}
            onChange={(e) =>
              onFilterChange("paidAmountOperator", e.target.value as string)
            }
            variant="filled"
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            <Tooltip title="Equal to" placement="right">
              <MenuItem value="=">=</MenuItem>
            </Tooltip>
            <Tooltip title="Less than" placement="right">
              <MenuItem value="<">&lt;</MenuItem>
            </Tooltip>
            <Tooltip title="Greater than" placement="right">
              <MenuItem value=">">&gt;</MenuItem>
            </Tooltip>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField
          fullWidth
          label="Paid Amount"
          type="number"
          value={filters.paidAmount}
          onChange={(e) => onFilterChange("paidAmount", e.target.value)}
          variant="standard"
          size="small"
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={onApplyFilters}>
          Apply Filters
        </Button>
      </Grid>
    </Grid>
  );
};

export default FilterComponent;
