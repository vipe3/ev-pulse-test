import type { Stock, RawDataPoint } from './types';

// Generate list of trading days (weekdays) from one year ago to now
const generateTradingDates = (days: number): string[] => {
  const dates: string[] = [];
  const start = new Date('2024-03-30'); // Today's date mock
  start.setUTCDate(start.getUTCDate() - (days * 1.5)); // Start further back to account for weekends
  
  let current = new Date(start);
  while (dates.length < days) {
    if (current.getUTCDay() !== 0 && current.getUTCDay() !== 6) {
      dates.push(current.toISOString().split('T')[0]);
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
};

const TRADING_DAYS = 300;
export const alignedDates = generateTradingDates(TRADING_DAYS);

const generateSeries = (startPrice: number, volatility: number, drift: number): RawDataPoint[] => {
  let currentPrice = startPrice;
  return alignedDates.map(date => {
    // Random walk with drift
    const change = (Math.random() - 0.5) * volatility + drift;
    currentPrice = currentPrice * (1 + change);
    return { date, price: Number(currentPrice.toFixed(2)) };
  });
};

export const MOCK_STOCKS: Stock[] = [
  // EV First
  { symbol: 'TSLA', name: 'Tesla', group: 'EV-first', series: generateSeries(180, 0.03, 0.001) },
  { symbol: 'RIVN', name: 'Rivian', group: 'EV-first', series: generateSeries(15, 0.04, -0.001) },
  { symbol: 'LCID', name: 'Lucid', group: 'EV-first', series: generateSeries(4, 0.05, -0.002) },
  { symbol: 'NIO', name: 'NIO', group: 'EV-first', series: generateSeries(6, 0.04, 0.000) },
  { symbol: 'XPEV', name: 'XPeng', group: 'EV-first', series: generateSeries(10, 0.04, 0.001) },
  { symbol: 'LI', name: 'Li Auto', group: 'EV-first', series: generateSeries(35, 0.03, 0.002) },
  { symbol: 'PSNY', name: 'Polestar', group: 'EV-first', series: generateSeries(2, 0.06, -0.003) },
  // Big Auto
  { symbol: 'F', name: 'Ford', group: 'Big Auto', series: generateSeries(12, 0.015, 0.0005) },
  { symbol: 'GM', name: 'GM', group: 'Big Auto', series: generateSeries(40, 0.015, 0.0005) },
  { symbol: 'TM', name: 'Toyota', group: 'Big Auto', series: generateSeries(240, 0.01, 0.001) },
];
