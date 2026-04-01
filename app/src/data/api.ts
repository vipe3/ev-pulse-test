import type { Stock, Timeframe, Interval } from './types';
import { fetchStockData } from './yahooApi';

const STOCK_DEFINITIONS = [
  { symbol: 'TSLA', name: 'Tesla', group: 'EV-first' as const },
  { symbol: 'RIVN', name: 'Rivian', group: 'EV-first' as const },
  { symbol: 'LCID', name: 'Lucid', group: 'EV-first' as const },
  { symbol: 'NIO', name: 'NIO', group: 'EV-first' as const },
  { symbol: 'XPEV', name: 'XPeng', group: 'EV-first' as const },
  { symbol: 'LI', name: 'Li Auto', group: 'EV-first' as const },
  { symbol: 'PSNY', name: 'Polestar', group: 'EV-first' as const },
  { symbol: 'F', name: 'Ford', group: 'Big Auto' as const },
  { symbol: 'GM', name: 'GM', group: 'Big Auto' as const },
  { symbol: 'TM', name: 'Toyota', group: 'Big Auto' as const },
];

const TIMEFRAME_TO_RANGE_MAP: Record<Timeframe, string> = {
  '1D': '1d',
  '1W': '5d',
  '1M': '1mo',
  '90D': '3mo',
  'YTD': 'ytd'
};

export const loadAllStocks = async (timeframe: Timeframe, interval: Interval): Promise<Stock[]> => {
  const stocks: Stock[] = [];
  const range = TIMEFRAME_TO_RANGE_MAP[timeframe] || '1mo';
  
  // We fetch them in parallel for speed
  const promises = STOCK_DEFINITIONS.map(async (def) => {
    try {
      const series = await fetchStockData(def.symbol, range, interval);
      return {
        ...def,
        series
      };
    } catch (e) {
      console.error(`Failed to fetch data for ${def.symbol}`, e);
      return null;
    }
  });

  const results = await Promise.all(promises);
  results.forEach(res => {
    // Only include stocks that actually returned valid data points
    if (res && res.series.length > 0) {
      stocks.push(res);
    }
  });

  return stocks;
};
