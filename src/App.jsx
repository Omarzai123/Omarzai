import React from "react";
import { Container, Paper, Typography } from "@mui/material";
import Converter from "./components/Converter.jsx";
import HistoricalRate from "./components/HistoricalRate.jsx";
import LatestRates from "./components/LatestRates.jsx";
import RateHistoryChart from "./components/RateHistoryChart.jsx";
import { CurrencyProvider } from "./context/CurrencyContext";

export default function App() {
  return (
    <CurrencyProvider>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }} elevation={6}>
          <Typography variant="h5" gutterBottom>
            Money Exchange App
          </Typography>
          <Converter />
          <HistoricalRate />
          <LatestRates />
          <RateHistoryChart />
        </Paper>
      </Container>
    </CurrencyProvider>
  );
}

