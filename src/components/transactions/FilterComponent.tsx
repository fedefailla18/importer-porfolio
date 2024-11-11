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
  selectedPortfolios?: string[];
  onFilterChange: (filterName: string, value: string) => void;
  onApplyFilters: () => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  filters,
  selectedPortfolios,
  onFilterChange,
  onApplyFilters,
}) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Symbol"
          value={filters.symbol || ""}
          onChange={(e) => onFilterChange("symbol", e.target.value)}
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
        />
      </Grid>
      {/* <Grid item xs={12} sm={3}>
        <Select
          multiple
          fullWidth
          value={filters.portfolioName}
          onChange={(e) =>
            onFilterChange("portfolios", e.target.value as string[])
          }
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {selectedPortfolios?.map((portfolio) => (
            <MenuItem key={portfolio} value={portfolio}>
              {portfolio}
            </MenuItem>
          ))}
        </Select>
      </Grid> */}
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Portfolio Name"
          value={filters.portfolioName}
          onChange={(e) => onFilterChange("portfolioName", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
          <InputLabel>Side</InputLabel>
          <Select
            value={filters.side}
            onChange={(e) => onFilterChange("side", e.target.value as string)}
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
          >
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
