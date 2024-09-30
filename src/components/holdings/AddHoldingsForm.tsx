// src/components/holdings/AddHoldingsForm.tsx
import React, { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { addMultipleHoldings } from "../../redux/slices/portfolioSlice";
import { TextField, Button, Grid, Typography, IconButton } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { HoldingDto } from "../../redux/types/types";

interface AddHoldingsFormProps {
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
  portfolio?: string;
}

const AddHoldingsForm: React.FC<AddHoldingsFormProps> = ({
  onClose,
  portfolio,
}) => {
  const dispatch = useAppDispatch();
  const [holding, setHolding] = useState({
    symbol: "",
    amount: 0,
    portfolioName: "",
    costInUsdt: 0,
  });
  const [holdings, setHoldings] = useState<HoldingDto[]>([
    {
      symbol: "",
      amount: 0,
      portfolioName: portfolio ? portfolio : "",
      stableTotalCost: 0,
    },
  ]);

  const handleAddRow = () => {
    setHoldings([
      ...holdings,
      {
        symbol: "",
        amount: 0,
        portfolioName: portfolio ? portfolio : "",
        stableTotalCost: 0,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const newHoldings = holdings.filter((_, i) => i !== index);
    setHoldings(newHoldings);
  };

  const handleChange = <K extends keyof HoldingDto>(
    index: number,
    field: K,
    value: any
  ) => {
    const newHoldings = [...holdings];
    const holding = newHoldings[index];
    holding[field] = value;
    setHoldings(newHoldings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addMultipleHoldings(holdings));
    setHoldings([
      {
        symbol: "",
        amount: 0,
        portfolioName: portfolio ? portfolio : "",
        stableTotalCost: 0,
      },
    ]);
  };

  const handleChangeSingle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHolding({ ...holding, [e.target.name]: e.target.value });
  };

  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addMultipleHoldings([holding]));
    onClose({ type: "keydown" } as React.KeyboardEvent);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Add Holdings
      </Typography>
      {holdings.map((holding, index) => (
        <Grid
          container
          spacing={2}
          key={index}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Symbol"
              value={holding.symbol}
              onChange={(e) => handleChange(index, "symbol", e.target.value)}
              required
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={holding.amount}
              onChange={(e) =>
                handleChange(index, "amount", Number(e.target.value))
              }
              required
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Portfolio"
              value={holding.portfolioName}
              defaultValue={portfolio}
              onChange={(e) =>
                handleChange(index, "portfolioName", e.target.value)
              }
              disabled={!!portfolio}
              required
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cost in USDT"
              type="number"
              value={holding.stableTotalCost}
              onChange={(e) =>
                handleChange(index, "stableTotalCost", Number(e.target.value))
              }
              required
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              onClick={() => handleRemoveRow(index)}
              disabled={holdings.length === 1}
            >
              <RemoveIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button startIcon={<AddIcon />} onClick={handleAddRow} sx={{ mt: 2 }}>
        Add Another Holding
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2, ml: 2 }}
      >
        Submit Holdings
      </Button>
    </form>
  );
};

export default AddHoldingsForm;

/* 
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="symbol"
            label="Symbol"
            value={holding.symbol}
            onChange={handleChangeSingle}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="amount"
            label="Amount"
            type="number"
            value={holding.amount}
            onChange={handleChangeSingle}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="portfolioName"
            label="Portfolio Name"
            value={holding.portfolioName}
            onChange={handleChangeSingle}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="costInUsdt"
            label="Cost in USDT"
            type="number"
            value={holding.costInUsdt}
            onChange={handleChangeSingle}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add Holding
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddHoldingsForm; */
