import type { Stock, Timeframe, CalculatedDataPoint } from './types';

// Gets the slice of aligned dates based on the timeframe
export const getDateSliceIndex = (timeframe: Timeframe, totalDays: number): number => {
  switch (timeframe) {
    case '1D': return Math.max(0, totalDays - 2); // Need previous close (last 2 days)
    case '1W': return Math.max(0, totalDays - 5); // 5 trading days
    case '1M': return Math.max(0, totalDays - 21); // ~21 trading days
    case '90D': return Math.max(0, totalDays - 63); // ~63 trading days
    case 'YTD': return Math.max(0, totalDays - 60); // Mock YTD (approx 3 months)
    default: return 0;
  }
};

const getCommonDates = (stocks: Stock[]): string[] => {
  if (stocks.length === 0) return [];
  // Use the dates of the first stock as the baseline
  return stocks[0].series.map(s => s.date);
};

export const calculateChartData = (
  stocks: Stock[],
  timeframe: Timeframe,
): CalculatedDataPoint[] => {
  const dates = getCommonDates(stocks);
  if (!dates.length) return [];

  const startIndex = getDateSliceIndex(timeframe, dates.length);
  const relevantDates = dates.slice(startIndex);
  
  const chartData: CalculatedDataPoint[] = relevantDates.map(date => {
    const point: CalculatedDataPoint = { date };
    
    // Track sums for baskets
    let evSum = 0;
    let evCount = 0;
    let autoSum = 0;
    let autoCount = 0;

    stocks.forEach(stock => {
      // Find the start price for this window
      // The start price is the price at `startIndex`
      const basePoint = stock.series[startIndex];
      const currentPoint = stock.series.find(s => s.date === date);
      
      if (basePoint && currentPoint) {
        const basePrice = basePoint.price;
        const currentPrice = currentPoint.price;
        // Normalized Return = ((Current Price - Start Price) / Start Price) * 100
        const normalizedReturn = ((currentPrice - basePrice) / basePrice) * 100;
        
        point[stock.symbol] = normalizedReturn;
        
        if (stock.group === 'EV-first') {
          evSum += normalizedReturn;
          evCount++;
        } else if (stock.group === 'Big Auto') {
          autoSum += normalizedReturn;
          autoCount++;
        }
      }
    });

    if (evCount > 0) point['EV Basket'] = evSum / evCount;
    if (autoCount > 0) point['Big Auto'] = autoSum / autoCount;

    return point;
  });

  return chartData;
};

// Calculates the final summarized performance of each stock for the rankings table
export interface StockRanking {
  symbol: string;
  name: string;
  group: 'EV-first' | 'Big Auto';
  returnPct: number;
  currentPrice: number;
  isEv: boolean;
  flashDirection?: 'up' | 'down';
}

export const calculateRankings = (
  stocks: Stock[],
  timeframe: Timeframe,
): StockRanking[] => {
  const dates = getCommonDates(stocks);
  if (!dates.length) return [];
  
  const startIndex = getDateSliceIndex(timeframe, dates.length);
  const endIndex = dates.length - 1;

  return stocks.map(stock => {
     const startPoint = stock.series[startIndex];
     const endPoint = stock.series[endIndex];
     
     if (!startPoint || !endPoint) return { symbol: stock.symbol, name: stock.name, group: stock.group, returnPct: 0, currentPrice: 0, isEv: stock.group === 'EV-first' };
     
     const returnPct = ((endPoint.price - startPoint.price) / startPoint.price) * 100;
     return {
       symbol: stock.symbol,
       name: stock.name,
       group: stock.group,
       returnPct,
       currentPrice: endPoint.price,
       isEv: stock.group === 'EV-first',
       flashDirection: stock.flashDirection
     };
  }).sort((a, b) => b.returnPct - a.returnPct);
}

export const getBasketReturns = (
  stocks: Stock[],
  timeframe: Timeframe,
): { 'EV Basket': number, 'Big Auto': number } => {
  const chartData = calculateChartData(stocks, timeframe);
  const lastPoint = chartData[chartData.length - 1];
  
  return {
    'EV Basket': Number(lastPoint?.['EV Basket'] || 0),
    'Big Auto': Number(lastPoint?.['Big Auto'] || 0)
  };
};
