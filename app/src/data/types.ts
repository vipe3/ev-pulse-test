export type Timeframe = '1D' | '1W' | '1M' | '90D' | 'YTD';
export type Comparison = 'EV Basket' | 'Big Auto' | 'None';

export interface RawDataPoint {
  date: string; // ISO 8601 (aligned trading days)
  price: number;
}

export interface Stock {
  symbol: string;
  name: string;
  group: 'EV-first' | 'Big Auto';
  series: RawDataPoint[]; // One chronological time series
}

export interface CalculatedDataPoint {
  date: string;
  [symbolOrBenchmark: string]: number | string; // Normalized % return
}
