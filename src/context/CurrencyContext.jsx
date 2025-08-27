import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();


export function CurrencyProvider({ children }) {
  const [base, setBase] = useState('USD');
  const [quote, setQuote] = useState('INR');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [historicalRates, setHistoricalRates] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  
  const swapCurrencies = () => {
    setBase(quote);
    setQuote(base);
  };

  
  useEffect(() => {
    const mockRates = {
      USD: 1,
      INR: 83.37,
      AFN: 68.50
    };
    setExchangeRates(mockRates);
    setHistoricalRates(mockRates);
  }, []);

  const value = {
    base,
    setBase,
    quote,
    setQuote,
    amount,
    setAmount,
    convertedAmount,
    setConvertedAmount,
    exchangeRates,
    historicalRates,
    date,
    setDate,
    swapCurrencies
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}


export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
