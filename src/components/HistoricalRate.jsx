import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, TextField, CircularProgress } from "@mui/material";
import { useCurrency } from "../context/CurrencyContext";

const API_BASE = "https://app.exchangerate-api.com/key";

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export default function HistoricalRate() {
  const { base, quote } = useCurrency();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [dateRate, setDateRate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!base || !quote) return;
    
    setLoading(true);
    fetch(`${API_BASE}/${selectedDate}?base=${base}&symbols=${quote}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.rates && data.rates[quote]) {
          setDateRate(data.rates[quote]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedDate, base, quote]);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1">Historical Rate</Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center" }}>
        <TextField 
          type="date" 
          label="Date" 
          size="small" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          InputLabelProps={{ shrink: true }} 
        />
        <Box>
          <Typography variant="body2">Rate on {selectedDate}:</Typography>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography variant="h6">{dateRate ? `${dateRate} ${quote}` : "-"}</Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
