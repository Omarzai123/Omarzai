import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import { useCurrency } from "../context/CurrencyContext";

const API_BASE = "https://app.exchangerate-api.com/";

export default function LatestRates() {
  const { base } = useCurrency();
  const [latestRates, setLatestRates] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!base) return;
    
    setLoading(true);
    fetch(`${API_BASE}/latest?base=${base}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.rates) {
          setLatestRates(data.rates);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [base]);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1">Latest Rates (Base: {base})</Typography>
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {latestRates &&
            Object.entries(latestRates)
              .slice(0, 12)
              .map(([sym, val]) => (
                <Grid key={sym} item xs={6}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">{sym}</Typography>
                    <Typography variant="body2">{val.toFixed(6)}</Typography>
                  </Box>
                </Grid>
              ))}
        </Grid>
      )}
    </Paper>
  );
}
