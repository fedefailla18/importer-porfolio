// /src/components/transactions/TransactionForm.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addTransaction } from "../../redux/slices/transactionSlice";
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Autocomplete,
  Switch,
  FormControlLabel,
  Collapse,
  Box,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface TransactionFormProps {
  defaultPortfolioName?: string;
  onSuccess?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ defaultPortfolioName, onSuccess }) => {
  const dispatch = useAppDispatch();
  const portfolios = useAppSelector((state) => state.portfolio.portfolios.map((p) => p.name));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [transaction, setTransaction] = useState<any>({
    dateUtc: null,
    side: "BUY",
    executed: 0,
    symbol: "",
    portfolioName: defaultPortfolioName || "",
    pair: "",
    price: 0,
    payedWith: "",
    payedAmount: 0,
    fee: "",
    feeAmount: 0,
    feeSymbol: "",
    processed: false,
    lastProcessedAt: null,
  });

  useEffect(() => {
    if (defaultPortfolioName) {
      setTransaction((prev: any) => ({ ...prev, portfolioName: defaultPortfolioName }));
    }
  }, [defaultPortfolioName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTransaction((prev: any) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePortfolioChange = (_event: any, newValue: string | null) => {
    setTransaction((prev: any) => ({ ...prev, portfolioName: newValue || "" }));
  };

  const handleDateChange = (value: Date | null) => {
    setTransaction((prev: any) => ({ ...prev, dateUtc: value }));
  };

  const handleLastProcessedAtChange = (value: Date | null) => {
    setTransaction((prev: any) => ({ ...prev, lastProcessedAt: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Map FE state to BE DTO
    const payload = {
      ...transaction,
      dateUtc: transaction.dateUtc ? new Date(transaction.dateUtc).toISOString() : null,
      lastProcessedAt: transaction.lastProcessedAt ? new Date(transaction.lastProcessedAt).toISOString() : null,
    };
    try {
      await dispatch(addTransaction(payload)).unwrap();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h2" gutterBottom>
        Add Transaction
      </Typography>
      <form onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Date (UTC)"
                value={transaction.dateUtc}
                onChange={handleDateChange}
                ampm={false}
                disablePast={false}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
                minutesStep={1}
                closeOnSelect
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Side"
                name="side"
                value={transaction?.side}
                onChange={handleChange}
              >
                <MenuItem value="BUY">Buy</MenuItem>
                <MenuItem value="SELL">Sell</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pair"
                name="pair"
                value={transaction?.pair}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={transaction?.price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Executed"
                name="executed"
                type="number"
                value={transaction?.executed}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Symbol"
                name="symbol"
                value={transaction?.symbol}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payed With"
                name="payedWith"
                value={transaction?.payedWith}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payed Amount"
                name="payedAmount"
                type="number"
                value={transaction?.payedAmount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fee"
                name="fee"
                value={transaction?.fee}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fee Amount"
                name="feeAmount"
                type="number"
                value={transaction?.feeAmount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fee Symbol"
                name="feeSymbol"
                value={transaction?.feeSymbol}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={portfolios}
                value={transaction.portfolioName}
                onInputChange={handlePortfolioChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Portfolio Name"
                    required
                  />
                )}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showAdvanced}
                    onChange={() => setShowAdvanced((prev) => !prev)}
                    color="primary"
                  />
                }
                label="Show Advanced Fields"
              />
            </Grid>
            <Collapse in={showAdvanced} style={{ width: "100%" }}>
              <Box sx={{ pl: 2, pr: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={transaction.processed}
                          onChange={handleChange}
                          name="processed"
                          color="primary"
                        />
                      }
                      label="Processed"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DateTimePicker
                      label="Last Processed At"
                      value={transaction.lastProcessedAt}
                      onChange={handleLastProcessedAtChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                      ampm={false}
                      minutesStep={1}
                      closeOnSelect
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Transaction
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </form>
    </Paper>
  );
};

export default TransactionForm;
