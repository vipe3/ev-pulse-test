import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PerformanceChart } from './components/Chart';
import { Rankings } from './components/Rankings';
import { StockDetailSlideOver } from './components/StockDetailSlideOver';
import type { Timeframe, Comparison } from './data/types';
import { MOCK_STOCKS, tickMockPrices } from './data/mockData';

function App() {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [comparison, setComparison] = useState<Comparison>('EV Basket');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [, setTick] = useState<number>(0); // Drives simulated live updates

  const evStocks = MOCK_STOCKS.filter(s => s.group === 'EV-first');
  const [visibleStocks, setVisibleStocks] = useState<Set<string>>(new Set(evStocks.map(s => s.symbol)));

  // Simulated live data feed (updating hourly per user preference)
  useEffect(() => {
    const interval = setInterval(() => {
      tickMockPrices();
      setTick(t => t + 1); // Trigger re-render
    }, 60 * 60 * 1000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  const toggleStockVisibility = (symbol: string) => {
    setVisibleStocks(prev => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  const handleNavigate = (dir: 'next' | 'prev') => {
    if (!selectedStock) return;
    const currentIndex = evStocks.findIndex(s => s.symbol === selectedStock);
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex;
    if (dir === 'next') {
      newIndex = (currentIndex + 1) % evStocks.length;
    } else {
      newIndex = (currentIndex - 1 + evStocks.length) % evStocks.length;
    }
    setSelectedStock(evStocks[newIndex].symbol);
  };

  return (
    <div className="app-container">
      <Header 
        timeframe={timeframe} 
        setTimeframe={setTimeframe} 
        comparison={comparison}
        setComparison={setComparison}
      />
      <div className="main-content">
        <PerformanceChart 
           timeframe={timeframe} 
           comparison={comparison}
           selectedStockSymbol={selectedStock}
           visibleStocks={visibleStocks}
        />
        
        {/* We wrap the side panel and slide-over together so slide-over covers the rankings */}
        <div className="side-panel" style={{ overflow: 'hidden' }}>
          <Rankings 
            timeframe={timeframe} 
            selectedStockSymbol={selectedStock}
            onSelectStock={setSelectedStock}
            visibleStocks={visibleStocks}
            onToggleStockVisibility={toggleStockVisibility}
          />
          <StockDetailSlideOver 
            selectedStockSymbol={selectedStock}
            timeframe={timeframe}
            onClose={() => setSelectedStock(null)}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
