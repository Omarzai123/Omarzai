import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider, CircularProgress, ToggleButton, ToggleButtonGroup } from "@mui/material";
import LineChart from "./LineChart";
import { useCurrency } from "../context/CurrencyContext";

const API_BASE = "https://app.exchangerate-api.com/key";

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export default function RateHistoryChart() {
  const { base, quote } = useCurrency();
  const [historyRange, setHistoryRange] = useState(7);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!base || !quote) return;
    
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (historyRange - 1));
    const start_s = formatDate(start);
    const end_s = formatDate(end);

    setLoading(true);
    fetch(`${API_BASE}/timeseries?start_date=${start_s}&end_date=${end_s}&base=${base}&symbols=${quote}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.rates) {
          const arr = Object.keys(data.rates)
            .sort()
            .map((d) => ({ date: d, value: data.rates[d][quote] }));
          setHistoryData(arr);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [base, quote, historyRange]);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle1">Rate History ({base} to {quote})</Typography>
        <ToggleButtonGroup
          value={historyRange}
          exclusive
          onChange={(e, v) => v && setHistoryRange(v)}
          size="small"
        >
          <ToggleButton value={7}>7d</ToggleButton>
          <ToggleButton value={30}>30d</ToggleButton>
          <ToggleButton value={90}>90d</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Divider sx={{ my: 1 }} />
      {loading ? <CircularProgress size={20} /> : <LineChart data={historyData} width={600} height={180} />}
    </Paper>
  );
}
