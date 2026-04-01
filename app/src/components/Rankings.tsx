import React, { useMemo } from 'react';
import type { Timeframe } from '../data/types';
import { MOCK_STOCKS } from '../data/mockData';
import { calculateRankings } from '../data/calculations';

interface RankingsProps {
  timeframe: Timeframe;
  selectedStockSymbol: string | null;
  onSelectStock: (symbol: string) => void;
}

const STOCK_COLORS: Record<string, string> = {
  TSLA: '#ef4444',
  RIVN: '#f59e0b',
  LCID: '#3b82f6',
  NIO: '#8b5cf6',
  XPEV: '#ec4899',
  LI: '#14b8a6',
  F: '#64748b',
  GM: '#94a3b8',
  TM: '#cbd5e1',
};

export const Rankings: React.FC<RankingsProps> = ({ timeframe, selectedStockSymbol, onSelectStock }) => {
  const rankings = useMemo(() => calculateRankings(MOCK_STOCKS, timeframe), [timeframe]);
  
  // Per design, display EV First by default. We can show them all or filter. Let's just show EV First to keep context clean.
  const evRankings = rankings.filter(r => r.isEv);

  return (
    <div className="rankings">
      <div className="rankings-header">
          <span>Name (EV)</span>
          <span style={{ textAlign: 'right' }}>{timeframe} Return</span>
        </div>
        <div className="rankings-list">
          {evRankings.map((rank) => {
             const isSelected = selectedStockSymbol === rank.symbol;
             const signClass = rank.returnPct > 0 ? 'positive' : rank.returnPct < 0 ? 'negative' : 'neutral';
             const sign = rank.returnPct > 0 ? '+' : '';
             
             // Management by exception: notify of extreme volatility > 15%
             const isVolatile = Math.abs(rank.returnPct) > 15 && (timeframe === '1M' || timeframe === '90D' || timeframe === 'YTD');

             return (
               <div 
                 key={rank.symbol} 
                 className={`rank-row`}
                 style={{ background: isSelected ? 'var(--bg-hover)' : '' }}
                 onClick={() => onSelectStock(rank.symbol)}
               >
                 <div className="rank-symbol">
                   <span className="color-dot" style={{ backgroundColor: STOCK_COLORS[rank.symbol] }} />
                   <div>
                     {rank.name} <span className="text-xs text-muted" style={{ fontSize: '0.75rem' }}>({rank.symbol})</span>
                     <div className="text-xs text-muted" style={{ fontSize: '0.75rem', marginTop: '2px', fontFamily: 'monospace' }}>
                       ${rank.currentPrice.toFixed(2)}
                     </div>
                   </div>
                 </div>
                 <div className={`rank-value ${signClass}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                   <span>{sign}{rank.returnPct.toFixed(2)}%</span>
                   {isVolatile && (
                     <span style={{ 
                       fontSize: '0.65rem', 
                       color: 'var(--accent)', 
                       marginTop: '4px',
                       background: 'rgba(59, 130, 246, 0.15)',
                       padding: '2px 6px',
                       borderRadius: '4px',
                       textTransform: 'uppercase',
                       letterSpacing: '0.05em'
                     }}>
                       Volatile
                     </span>
                   )}
                 </div>
               </div>
             )
          })}
        </div>
      </div>
  );
};
