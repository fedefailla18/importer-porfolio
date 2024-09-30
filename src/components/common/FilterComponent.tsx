// src/components/common/FilterComponent.tsx
import React from "react";
import { TextField, Button, Grid } from "@mui/material";

interface FilterComponentProps {
  filters: {
    symbol: string;
    startDate: string;
    endDate: string;
    portfolioName: string;
  };
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
          value={filters.symbol}
          onChange={(e) => onFilterChange("symbol", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Start Date"
          type="date"
          value={filters.startDate}
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
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={onApplyFilters}>
          Apply Filters
        </Button>
      </Grid>
    </Grid>
  );
};

export default FilterComponent;
