/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Stock } from './data/types';
import { loadAllStocks } from './data/api';

interface StockContextType {
  stocks: Stock[];
  loading: boolean;
  error: Error | null;
}

const StockContext = createContext<StockContextType>({ stocks: [], loading: true, error: null });

export const useStocks = () => useContext(StockContext);

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<Error | null>(null);

  useEffect(() => {
    loadAllStocks()
      .then(data => {
        // Mock the flashes since we are using static history for now limits
        const id = setInterval(() => {
          setStocks(current => current.map(stock => {
            const last = stock.series[stock.series.length - 1];
            // 20% chance of ticking up or down a micro-fraction to simulate live
            if (Math.random() > 0.8) {
              const change = (Math.random() - 0.5) * 0.003;
              const newPrice = Number((last.price * (1 + change)).toFixed(2));
              return {
                ...stock,
                flashDirection: newPrice > last.price ? 'up' : 'down',
                series: [
                  ...stock.series.slice(0, -1),
                  { date: last.date, price: newPrice }
                ]
              };
            }
            return { ...stock, flashDirection: undefined };
          }));
        }, 3000);
        
        setStocks(data);
        setLoading(false);
        return () => clearInterval(id);
      })
      .catch(console.error);
  }, []);

  return (
    <StockContext.Provider value={{ stocks, loading, error }}>
      {children}
    </StockContext.Provider>
  );
};
