import React, { useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Activity, AlertTriangle } from 'lucide-react';
import { useStocks } from '../StockContext';
import { calculateRankings } from '../data/calculations';
import type { Timeframe } from '../data/types';

interface SlideOverProps {
  selectedStockSymbol: string | null;
  timeframe: Timeframe;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

export const StockDetailSlideOver: React.FC<SlideOverProps> = ({ 
  selectedStockSymbol, timeframe, onClose, onNavigate 
}) => {
  const { stocks } = useStocks();
  const rankings = useMemo(() => calculateRankings(stocks, timeframe), [stocks, timeframe]);
  
  const activeStock = rankings.find(r => r.symbol === selectedStockSymbol);
  const isOpen = !!activeStock;

  return (
    <div className={`slide-over ${isOpen ? 'open' : ''}`}>
      {activeStock && (
        <>
          <div className="slide-header">
            <button className="btn-icon" onClick={onClose} aria-label="Close detail panel">
              <X size={20} />
            </button>
            <h2 className="h2">{activeStock.name} ({activeStock.symbol})</h2>
            
            <div className="slide-nav">
              <button className="btn-icon" onClick={() => onNavigate('prev')} aria-label="Previous stock">
                <ChevronLeft size={20} />
              </button>
              <button className="btn-icon" onClick={() => onNavigate('next')} aria-label="Next stock">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="slide-content">
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
               <div className="detail-stat" style={{ marginBottom: 0 }}>
                  <div className="label">Current Price</div>
                  <div className="value">${activeStock.currentPrice.toFixed(2)}</div>
               </div>
               <div className="detail-stat" style={{ marginBottom: 0 }}>
                  <div className="label">{timeframe} Return</div>
                  <div className={`value ${activeStock.returnPct > 0 ? 'positive' : 'negative'}`}>
                    {activeStock.returnPct > 0 ? '+' : ''}{activeStock.returnPct.toFixed(2)}%
                  </div>
               </div>
             </div>
             
             <h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Key Statistics</h3>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--bg-border)' }}>
               <div className="detail-stat" style={{ marginBottom: 0 }}>
                  <div className="label">52W High (est)</div>
                  <div className="value text-muted" style={{ fontSize: '1.125rem' }}>${(activeStock.currentPrice * 1.5).toFixed(2)}</div>
               </div>
               <div className="detail-stat" style={{ marginBottom: 0 }}>
                  <div className="label">52W Low (est)</div>
                  <div className="value text-muted" style={{ fontSize: '1.125rem' }}>${(activeStock.currentPrice * 0.7).toFixed(2)}</div>
               </div>
               <div className="detail-stat" style={{ marginBottom: 0 }}>
                  <div className="label">P/E Ratio</div>
                  <div className="value text-muted" style={{ fontSize: '1.125rem' }}>{activeStock.currentPrice > 50 ? '24.5' : 'N/A'}</div>
               </div>
               <div className="detail-stat" style={{ marginBottom: 0 }}>
                  <div className="label">Volatility (30D)</div>
                  <div className="value" style={{ fontSize: '1.125rem', color: Math.abs(activeStock.returnPct) > 15 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                    {Math.abs(activeStock.returnPct) > 15 ? 'High' : 'Normal'}
                  </div>
               </div>
             </div>
             
             <div style={{ marginTop: '2.5rem' }}>
               <h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Recent News Alerts</h3>
               <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.875rem', color: 'var(--text-primary)', borderLeft: '2px solid var(--accent)', paddingLeft: '1rem', marginBottom: '1rem' }}>
                 <Activity size={16} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
                 <div>
                   <p style={{ marginBottom: '0.25rem' }}>{activeStock.name} announces Q3 delivery numbers showing stronger than expected results in key markets.</p>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2 hours ago</span>
                 </div>
               </div>
               {Math.abs(activeStock.returnPct) > 15 && (
                 <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.875rem', color: 'var(--text-primary)', borderLeft: '2px solid #ef4444', paddingLeft: '1rem' }}>
                   <AlertTriangle size={16} style={{ color: '#ef4444', marginTop: '2px', flexShrink: 0 }} />
                   <div>
                     <p style={{ marginBottom: '0.25rem' }}>Unusual price movement detected over the selected `{timeframe}` timeframe.</p>
                     <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>System Alert</span>
                   </div>
                 </div>
               )}
             </div>
          </div>
        </>
      )}
    </div>
  );
}
