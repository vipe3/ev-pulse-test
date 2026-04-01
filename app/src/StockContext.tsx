/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Stock, Timeframe, Interval } from './data/types';
import { loadAllStocks } from './data/api';

interface StockContextType {
  stocks: Stock[];
  loading: boolean;
  error: Error | null;
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  interval: Interval;
  setInterval: (i: Interval) => void;
}

const StockContext = createContext<StockContextType>({
  stocks: [], loading: true, error: null, 
  timeframe: '1M', setTimeframe: () => {}, 
  interval: '1d', setInterval: () => {}
});

export const useStocks = () => useContext(StockContext);

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<Error | null>(null);
  
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [interval, setInterval] = useState<Interval>('1d');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    let isCancelled = false;

    loadAllStocks(timeframe, interval)
      .then(data => {
        if (isCancelled) return;
        setStocks(data);
        setLoading(false);

        // Micro-fraction simulation only if we have data and user is watching it
        const id = window.setInterval(() => {
          setStocks(current => current.map(stock => {
            const last = stock.series[stock.series.length - 1];
            if (!last) return stock;
            
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
        
        return () => window.clearInterval(id);
      })
      .catch((e) => {
        if (!isCancelled) console.error(e);
      });

    return () => {
      isCancelled = true;
    };
  }, [timeframe, interval]);

  return (
    <StockContext.Provider value={{ stocks, loading, error, timeframe, setTimeframe, interval, setInterval }}>
      {children}
    </StockContext.Provider>
  );
};
