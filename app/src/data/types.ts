export type Timeframe = '1D' | '1W' | '1M' | '90D' | 'YTD';
export type Interval = '5m' | '15m' | '1h' | '1d' | '1wk';
export type Comparison = 'EV Basket' | 'Big Auto' | 'None';

export interface RawDataPoint {
  date: string; // ISO 8601 or timestamps depending on interval
  price: number;
}

export interface Stock {
  symbol: string;
  name: string;
  group: 'EV-first' | 'Big Auto';
  series: RawDataPoint[]; // Fetched dynamically to perfectly match the requested timescale/interval
  flashDirection?: 'up' | 'down';
}

export interface CalculatedDataPoint {
  date: string;
  [symbolOrBenchmark: string]: number | string; // Normalized % return
}
