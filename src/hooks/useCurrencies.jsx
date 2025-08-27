import { useState, useEffect } from 'react';

const API_BASE = "https://app.exchangerate-api.com/";

export default function useCurrencies() {
  const [symbols, setSymbols] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    setLoading(true);
    fetch(`${API_BASE}/symbols`)
      .then(response => response.json())
      .then(data => {
        if (!mounted) return;
        if (data && data.symbols) {
          setSymbols(data.symbols);
        }
        setLoading(false);
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return symbols;
}
