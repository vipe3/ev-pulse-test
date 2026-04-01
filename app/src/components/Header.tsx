import React, { useMemo } from 'react';
import type { Timeframe, Comparison } from '../data/types';
import { MOCK_STOCKS } from '../data/mockData';
import { getBasketReturns } from '../data/calculations';

interface HeaderProps {
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  comparison: Comparison;
  setComparison: (c: Comparison) => void;
}

export const Header: React.FC<HeaderProps> = ({ timeframe, setTimeframe, comparison, setComparison }) => {
  const timeframes: Timeframe[] = ['1D', '1W', '1M', '90D', 'YTD'];
  const comparisons: Comparison[] = ['EV Basket', 'Big Auto', 'None'];

  const basketReturns = useMemo(() => getBasketReturns(MOCK_STOCKS, timeframe), [timeframe]);

  return (
    <header className="header">
      <div className="header-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 className="h1" style={{ letterSpacing: '-0.05em', margin: 0 }}>EV Pulse</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--ev-basket)', fontWeight: 600, letterSpacing: '0.05em' }}>1H SYNC</span>
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
        <div className="toggle-group">
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
        <div className="toggle-group">
          {timeframes.map(tf => (
            <button
              key={tf}
              className={`toggle-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
