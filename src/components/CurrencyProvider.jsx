import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

// Create Currency Context
const CurrencyContext = createContext();

// components of Currency Provider
function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [historicalRates, setHistoricalRates] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  
  useEffect(() => {
    
    const mockRates = {
      USD: 1
      INR: 83.37,
      AFN: 68.50//  Afghani
    };
    setExchangeRates(mockRates);
    
    // Set historical rates (https://app.exchangerate-api.com/)
    setHistoricalRates(mockRates);
  }, []);

  //  convert currency function
  const convertCurrency = () => {
    if (!exchangeRates[currency] || !exchangeRates[targetCurrency]) {
      alert('Please select valid currencies');
      return;
    }
  
    const amountInUSD = amount / exchangeRates[currency];
    const result = amountInUSD * exchangeRates[targetCurrency];
    
    setConvertedAmount(result.toFixed(2));
  };

  const value = {
    currency,
    setCurrency,
    targetCurrency,
    setTargetCurrency,
    amount,
    setAmount,
    convertedAmount,
    setConvertedAmount,
    exchangeRates,
    historicalRates,
    date,
    setDate,
    convertCurrency
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}


function CurrencyConverter() {
  const {
    currency,
    setCurrency,
    targetCurrency,
    setTargetCurrency,
    amount,
    setAmount,
    convertedAmount,
    convertCurrency,
    exchangeRates,
    historicalRates,
    date,
    setDate
  } = useCurrency();

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'AFN', name: 'Afghan Afghani' },
    { code: 'INR', name: 'Indian Rupee' },
  ];

  return (
    <div className="container">
      <header>
        <h1>Currency Converter</h1>
        <p>Convert between currencies with real-time exchange rates</p>
      </header>
      
      <div className="app-content">
        <div className="converter-panel">
          <h2>Currency Converter</h2>
          
          <div className="converter-form">
            <div className="input-group">
              <label>From</label>
              <div className="input-with-select">
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="swap-button">
              <button 
                onClick={() => {
                  setCurrency(targetCurrency);
                  setTargetCurrency(currency);
                }}
                className="icon-button"
              >
                <i className="fas fa-exchange-alt"></i>
              </button>
            </div>
            
            <div className="input-group">
              <label>To</label>
              <div className="input-with-select">
                <select 
                  value={targetCurrency} 
                  onChange={(e) => setTargetCurrency(e.target.value)}
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="input-group">
              <label>Amount</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                min="0"
              />
            </div>
            
            <button className="convert-button" onClick={convertCurrency}>
              Convert
            </button>
            
            {convertedAmount !== null && (
              <div className="result">
                <h3>Converted Amount</h3>
                <p>{amount} {currency} = {convertedAmount} {targetCurrency}</p>
                <p className="rate">
                  Rate: 1 {currency} = {(convertedAmount / amount).toFixed(6)} {targetCurrency}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="info-panel">
          <div className="historical-rates">
            <h2>Historical Rate</h2>
            <div className="date-selector">
              <label>Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="historical-result">
              <p>Rate on {date}:</p>
              <p className="rate-value">
                {historicalRates[currency] && historicalRates[targetCurrency] 
                  ? (historicalRates[targetCurrency] / historicalRates[currency]).toFixed(6)
                  : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="latest-rates">
            <h2>Latest Rates (Base: USD)</h2>
            <div className="rates-grid">
              {Object.entries(exchangeRates).map(([code, rate]) => (
                <div key={code} className="rate-item">
                  <span className="currency-code">{code}</span>
                  <span className="rate-value">{rate.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function App() {
  return (
    <CurrencyProvider>
      <CurrencyConverter />
    </CurrencyProvider>
  );
}


const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  body {
    background: linear-gradient(135deg, #6b11f2 0%, #2575fc 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  
  .container {
    width: 100%;
    max-width: 900px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  
  header {
    background: #4e54c8;
    color: white;
    padding: 20px;
    text-align: center;
  }
  
  header h1 {
    font-size: 2.2rem;
    margin-bottom: 10px;
  }
  
  header p {
    opacity: 0.9;
  }
  
  .app-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding: 30px;
  }
  
  @media (max-width: 768px) {
    .app-content {
      grid-template-columns: 1fr;
    }
  }
  
  .converter-panel {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .converter-panel h2 {
    color: #4e54c8;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }
  
  .input-group input,
  .input-group select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
  }
  
  .input-group input:focus,
  .input-group select:focus {
    border-color: #4e54c8;
    outline: none;
  }
  
  .swap-button {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }
  
  .icon-button {
    background: #4e54c8;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .icon-button:hover {
    background: #3a3eb3;
  }
  
  .convert-button {
    width: 100%;
    background: #4e54c8;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 15px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 10px;
  }
  
  .convert-button:hover {
    background: #3a3eb3;
  }
  
  .result {
    margin-top: 25px;
    padding: 20px;
    background: #f0f8ff;
    border-radius: 10px;
    text-align: center;
  }
  
  .result h3 {
    color: #4e54c8;
    margin-bottom: 10px;
  }
  
  .result p {
    font-size: 18px;
    margin-bottom: 5px;
  }
  
  .rate {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .info-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .historical-rates,
  .latest-rates {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .historical-rates h2,
  .latest-rates h2 {
    color: #4e54c8;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .date-selector {
    margin-bottom: 20px;
  }
  
  .historical-result {
    text-align: center;
    padding: 15px;
    background: #f0f8ff;
    border-radius: 10px;
  }
  
  .rate-value {
    font-size: 24px;
    font-weight: 700;
    color: #4e54c8;
    margin-top: 10px;
  }
  
  .rates-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .rate-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .currency-code {
    font-weight: 600;
    color: #333;
  }
`;


const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
