import React, { useMemo } from 'react';
import type { Timeframe, Comparison, Interval } from '../data/types';
import { useStocks } from '../StockContext';
import { getBasketReturns } from '../data/calculations';

interface HeaderProps {
  comparison: Comparison;
  setComparison: (c: Comparison) => void;
}

const INTERVAL_OPTIONS: Record<Timeframe, Interval[]> = {
  '1D': ['5m', '15m', '1h'],
  '1W': ['15m', '1h', '1d'],
  '1M': ['1h', '1d'],
  '90D': ['1d', '1wk'],
  'YTD': ['1d', '1wk']
};

export const Header: React.FC<HeaderProps> = ({ comparison, setComparison }) => {
  const timeframes: Timeframe[] = ['1D', '1W', '1M', '90D', 'YTD'];
  const comparisons: Comparison[] = ['EV Basket', 'Big Auto', 'None'];

  const { stocks, timeframe, setTimeframe, interval, setInterval } = useStocks();
  const basketReturns = useMemo(() => getBasketReturns(stocks), [stocks]);

  const availableIntervals = INTERVAL_OPTIONS[timeframe];

  const handleTimeframeChange = (tf: Timeframe) => {
    setTimeframe(tf);
    // If current interval is not valid for new timeframe, pick default (last in the valid list is usually the 'widest' or first one, let's pick first)
    if (!INTERVAL_OPTIONS[tf].includes(interval)) {
      setInterval(INTERVAL_OPTIONS[tf][0]);
    }
  };

  return (
    <header className="header">
      <div className="header-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 className="h1" style={{ letterSpacing: '-0.05em', margin: 0 }}>EV Pulse</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--ev-basket)', fontWeight: 600, letterSpacing: '0.05em' }}>{interval.toUpperCase()} SYNC</span>
          </div>
        </div>
        <div className="header-kpis">
          <div className="kpi">
            <span className="kpi-label">EV Basket</span>
            <span className={`kpi-value ${basketReturns['EV Basket'] >= 0 ? 'positive' : 'negative'}`}>
              {basketReturns['EV Basket'] >= 0 ? '+' : ''}{basketReturns['EV Basket'].toFixed(2)}%
            </span>
          </div>
          <div className="kpi">
            <span className="kpi-label">Big Auto</span>
            <span className={`kpi-value ${basketReturns['Big Auto'] >= 0 ? 'positive' : 'negative'}`}>
              {basketReturns['Big Auto'] >= 0 ? '+' : ''}{basketReturns['Big Auto'].toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      <div className="header-controls">
        <div className="toggle-group" style={{ marginRight: 'auto' }}>
          {comparisons.map(c => (
            <button
              key={c}
              className={`toggle-btn ${comparison === c ? 'active' : ''}`}
              onClick={() => setComparison(c)}
            >
              {c}
            </button>
          ))}
        </div>
        
        <div className="toggle-group" style={{ marginRight: '12px' }}>
          {availableIntervals.map(inv => (
            <button
              key={inv}
              className={`toggle-btn ${interval === inv ? 'active' : ''}`}
              onClick={() => setInterval(inv)}
            >
              {inv}
            </button>
          ))}
        </div>

        <div className="toggle-group">
          {timeframes.map(tf => (
            <button
              key={tf}
              className={`toggle-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => handleTimeframeChange(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
