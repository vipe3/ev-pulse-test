import React, { useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { Timeframe } from '../data/types';
import { MOCK_STOCKS } from '../data/mockData';
import { calculateRankings } from '../data/calculations';
import { STOCK_COLORS } from '../data/constants';

interface RankingsProps {
  timeframe: Timeframe;
  selectedStockSymbol: string | null;
  onSelectStock: (symbol: string) => void;
  visibleStocks: Set<string>;
  onToggleStockVisibility: (symbol: string) => void;
}

export const Rankings: React.FC<RankingsProps> = ({ timeframe, selectedStockSymbol, onSelectStock, visibleStocks, onToggleStockVisibility }) => {
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
                 <div className="rank-symbol" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <button 
                     className="text-muted" 
                     style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
                     onClick={(e) => { e.stopPropagation(); onToggleStockVisibility(rank.symbol); }}
                     aria-label={visibleStocks.has(rank.symbol) ? "Hide stock" : "Show stock"}
                   >
                     {visibleStocks.has(rank.symbol) ? <Eye size={16} /> : <EyeOff size={16} opacity={0.5} />}
                   </button>
                   <span className="color-dot" style={{ backgroundColor: STOCK_COLORS[rank.symbol], opacity: visibleStocks.has(rank.symbol) ? 1 : 0.3 }} />
                   <div style={{ opacity: visibleStocks.has(rank.symbol) ? 1 : 0.5 }}>
                     {rank.name} <span className="text-xs text-muted" style={{ fontSize: '0.75rem' }}>({rank.symbol})</span>
                     <div 
                       key={rank.currentPrice} /* force re-render for animation */
                       className={`text-xs text-muted ${rank.flashDirection ? `flash-${rank.flashDirection}` : ''}`} 
                       style={{ fontSize: '0.75rem', marginTop: '2px', fontFamily: 'monospace' }}
                     >
                       ${rank.currentPrice.toFixed(2)}
                     </div>
                   </div>
                 </div>
                 <div className={`rank-value ${signClass}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                   <span key={rank.returnPct} /* force re-render for animation */ className={rank.flashDirection ? `flash-${rank.flashDirection}` : ''}>
                     {sign}{rank.returnPct.toFixed(2)}%
                   </span>
                   {isVolatile && (
                     <span style={{ 
                       fontSize: '0.65rem', 
                       color: 'var(--bg-primary)', 
                       marginTop: '4px',
                       background: 'var(--accent)',
                       padding: '2px 6px',
                       borderRadius: '4px',
                       textTransform: 'uppercase',
                       letterSpacing: '0.05em',
                       fontWeight: 600
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
