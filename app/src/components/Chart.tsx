import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { Timeframe, Comparison } from '../data/types';
import { calculateChartData } from '../data/calculations';
import { MOCK_STOCKS } from '../data/mockData';
import { STOCK_COLORS } from '../data/constants';

interface ChartProps {
  timeframe: Timeframe;
  comparison: Comparison;
  selectedStockSymbol: string | null;
  visibleStocks: Set<string>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  selectedStockSymbol: string | null;
}

const CustomTooltip = ({ active, payload, label, selectedStockSymbol }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    let displayPayload = payload;
    if (selectedStockSymbol) {
      displayPayload = payload.filter((entry) => entry.name === selectedStockSymbol);
    }
    
    const sortedPayload = [...displayPayload].sort((a, b) => b.value - a.value);
    
    if (sortedPayload.length === 0) return null;

    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-label">{label}</div>
        {sortedPayload.map((entry: any) => (
          <div key={entry.name} className="custom-tooltip-item" style={{ color: entry.color }}>
            <span>{entry.name}</span>
            <span>{entry.value > 0 ? '+' : ''}{entry.value.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const PerformanceChart: React.FC<ChartProps> = ({ timeframe, comparison, selectedStockSymbol, visibleStocks }) => {
  const chartData = useMemo(() => calculateChartData(MOCK_STOCKS, timeframe), [timeframe]);
  
  // What lines to render? 
  // Base line: if comparison != None, show benchmark.
  // Plus, show the EVs. If a stock is selected, we could highlight it by making others faint.
  // For V1 straight lines, no fills.
  
  const stocksToChart = MOCK_STOCKS.filter(s => s.group === 'EV-first' && visibleStocks.has(s.symbol));
  
  return (
    <div className="chart-section">
      <div className="chart-header">
        <h2 className="h2">{timeframe} Performance vs {comparison === 'None' ? 'None' : comparison}</h2>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis 
              dataKey="date" 
              stroke="#a1a1aa" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val.substring(5)} // Show MM-DD
              minTickGap={30}
            />
            <YAxis 
              stroke="#a1a1aa" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
            />
            <Tooltip content={<CustomTooltip selectedStockSymbol={selectedStockSymbol} />} />
            
            {/* Draw EV Stocks */}
            {stocksToChart.map(stock => {
              const isSelected = selectedStockSymbol === stock.symbol;
              const hasSelection = selectedStockSymbol !== null;
              // Dim others if something is selected
              const opacity = hasSelection && !isSelected ? 0.2 : 1;
              const strokeWidth = isSelected ? 2.5 : 1.5;

              return (
                <Line
                  key={stock.symbol}
                  type="linear" // Straight aesthetic
                  dataKey={stock.symbol}
                  stroke={STOCK_COLORS[stock.symbol] || '#fafafa'}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  isAnimationActive={false} // Clean look
                />
              );
            })}

            {/* Draw Benchmark */}
            {comparison !== 'None' && (
              <Line
                type="linear"
                dataKey={comparison}
                stroke={STOCK_COLORS[comparison]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
