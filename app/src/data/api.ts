import type { Stock } from './types';
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

export const loadAllStocks = async (): Promise<Stock[]> => {
  const stocks: Stock[] = [];
  
  // We fetch them in parallel for speed
  const promises = STOCK_DEFINITIONS.map(async (def) => {
    try {
      const series = await fetchStockData(def.symbol);
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
    if (res && res.series.length > 0) {
      stocks.push(res);
    }
  });

  return stocks;
};
