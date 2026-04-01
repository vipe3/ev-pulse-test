/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchStockData = async (symbol: string, range: string, interval: string) => {
  const res = await fetch(`/api/yahoo/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`);
  const data = await res.json();
  const result = data.chart.result?.[0];
  if (!result || !result.timestamp) return [];
  const timestamps = result.timestamp;
  const quote = result.indicators.quote[0];
  
  const series = timestamps.map((ts: number, index: number) => {
    // Keep full ISO string so Chart.tsx can decide how to format (e.g., date vs time)
    const date = new Date(ts * 1000).toISOString();
    return {
      date,
      price: Number(quote.close[index]?.toFixed(2)) || 0
    }
  });
  
  return series.filter((d: any) => d.price > 0);
};
