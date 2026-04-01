import type { Stock, Timeframe, CalculatedDataPoint } from './types';
import { alignedDates } from './mockData';

// Gets the slice of aligned dates based on the timeframe
export const getDateSliceIndex = (timeframe: Timeframe, totalDays: number): number => {
  switch (timeframe) {
    case '1D': return totalDays - 2; // Need previous close (last 2 days: index totalDays-2 and totalDays-1)
    case '1W': return totalDays - 5; // 5 trading days
    case '1M': return totalDays - 21; // ~21 trading days
    case '90D': return totalDays - 63; // ~63 trading days
    case 'YTD': return totalDays - 60; // Mock YTD (approx 3 months)
    default: return 0;
  }
};

export const calculateChartData = (
  stocks: Stock[],
  timeframe: Timeframe,
  dates: string[] = alignedDates
): CalculatedDataPoint[] => {
  const startIndex = Math.max(0, getDateSliceIndex(timeframe, dates.length));
  
  // Sliced dates for the chart window
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
}

export const calculateRankings = (
  stocks: Stock[],
  timeframe: Timeframe,
  dates: string[] = alignedDates
): StockRanking[] => {
  const startIndex = Math.max(0, getDateSliceIndex(timeframe, dates.length));
  const endIndex = dates.length - 1;

  // We are only ranking EV-first according to the product spec: 
  // "By default, this shows a Ranked Table of the EV-first stocks". 
  // Let's include everything but we can filter in the UI, or just return EV-first.
  // Actually, V1 spec says "Ranked performance table", let's return all and filter in UI if needed.
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
       isEv: stock.group === 'EV-first'
     };
  }).sort((a, b) => b.returnPct - a.returnPct);
}

export const getBasketReturns = (
  stocks: Stock[],
  timeframe: Timeframe,
  dates: string[] = alignedDates
): { 'EV Basket': number, 'Big Auto': number } => {
  const chartData = calculateChartData(stocks, timeframe, dates);
  const lastPoint = chartData[chartData.length - 1];
  
  return {
    'EV Basket': Number(lastPoint?.['EV Basket'] || 0),
    'Big Auto': Number(lastPoint?.['Big Auto'] || 0)
  };
};
