/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchStockData = async (symbol: string) => {
  const res = await fetch(`/api/yahoo/v8/finance/chart/${symbol}?range=1y&interval=1d`);
  const data = await res.json();
  const result = data.chart.result[0];
  const timestamps = result.timestamp;
  const quote = result.indicators.quote[0];
  
  const series = timestamps.map((ts: number, index: number) => {
    // Convert to YYYY-MM-DD
    const date = new Date(ts * 1000).toISOString().split('T')[0];
    return {
      date,
      price: Number(quote.close[index]?.toFixed(2)) || 0
    }
  });
  
  return series.filter((d: any) => d.price > 0);
};
