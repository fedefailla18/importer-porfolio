import React, { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import {
  addTransaction,
  Transaction,
} from "../../redux/slices/transactionSlice";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
const TransactionForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [transaction, setTransaction] = useState<Omit<Transaction, "id">>({
    dateUtc: new Date().toISOString(),
    side: "BUY",
    pair: "",
    price: 0,
    executed: 0,
    symbol: "",
    paidWith: "",
    paidAmount: 0,
    feeAmount: 0,
    feeSymbol: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };
  const handleChange2 = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name as string]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addTransaction(transaction));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h2" gutterBottom>
        Add Transaction
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date (UTC)"
              type="datetime-local"
              name="dateUtc"
              value={transaction.dateUtc}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Side"
              name="side"
              value={transaction.side}
              onChange={handleChange}
            >
              <MenuItem value="BUY">Buy</MenuItem>
              <MenuItem value="SELL">Sell</MenuItem>
            </TextField>
            <FormControl fullWidth>
              <InputLabel id="side-label">Side</InputLabel>
              <Select
                labelId="side-label"
                name="side"
                value={transaction.side}
                //onChange={handleChange2}
              >
                <MenuItem value="BUY">Buy</MenuItem>
                <MenuItem value="SELL">Sell</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pair"
              name="pair"
              value={transaction.pair}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={transaction.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Executed"
              name="executed"
              type="number"
              value={transaction.executed}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Symbol"
              name="symbol"
              value={transaction.symbol}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Paid With"
              name="paidWith"
              value={transaction.paidWith}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Paid Amount"
              name="paidAmount"
              type="number"
              value={transaction.paidAmount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fee Amount"
              name="feeAmount"
              type="number"
              value={transaction.feeAmount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fee Symbol"
              name="feeSymbol"
              value={transaction.feeSymbol}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Transaction
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default TransactionForm;
