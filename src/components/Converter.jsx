import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useCurrency } from "../context/CurrencyContext";

const API_BASE = "https://v6.exchangerate-api.com/v6/ea12f397ed5e93869ccbe0da/latest/USD";

export default function Converter() {
  const { 
    base, 
    setBase, 
    quote, 
    setQuote, 
    amount, 
    setAmount, 
    swapCurrencies,
    exchangeRates
  } = useCurrency();

  const [converted, setConverted] = useState(null);
  const [latestRates, setLatestRates] = useState(null);
  const [loadingLatest, setLoadingLatest] = useState(false);

  // Fetch latest rates
  useEffect(() => {
    let mounted = true;
    setLoadingLatest(true);
    fetch(`${API_BASE}/latest?base=${base}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data && data.rates) setLatestRates(data.rates);
        setLoadingLatest(false);
      })
      .catch(() => setLoadingLatest(false));
    return () => (mounted = false);
  }, [base]);

  // Update converted 
  useEffect(() => {
    if (!latestRates) return;
    const rate = latestRates[quote];
    setConverted((Number(amount) || 0) * (rate || 0));
  }, [latestRates, amount, quote]);

  const onConvertNow = () => {
    if (!latestRates) return;
    const rate = latestRates[quote];
    setConverted((Number(amount) || 0) * (rate || 0));
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1">Converter</Typography>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 2 }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="base-label">From</InputLabel>
          <Select
            labelId="base-label"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            label="From"
          >
            {exchangeRates &&
              Object.keys(exchangeRates)
                .sort()
                .map((code) => (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>

        <IconButton onClick={swapCurrencies} size="large">
          <SwapHorizIcon />
        </IconButton>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="quote-label">To</InputLabel>
          <Select
            labelId="quote-label"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            label="To"
          >
            {exchangeRates &&
              Object.keys(exchangeRates)
                .sort()
                .map((code) => (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mt: 2, alignItems: 'flex-start' }}>
        <TextField
          label="Amount"
          size="small"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={onConvertNow}>
          Convert
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        {loadingLatest ? (
          <CircularProgress size={20} />
        ) : (
          <>
            <Typography variant="body2">
              1 {base} = {latestRates && latestRates[quote] ? latestRates[quote].toFixed(6) : "-"} {quote}
            </Typography>
            <Typography variant="h6">
              {converted != null ? `${converted.toFixed(6)} ${quote}` : "-"}
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
}
