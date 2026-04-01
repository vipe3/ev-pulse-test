import type { Stock, CalculatedDataPoint } from './types';

const getCommonDates = (stocks: Stock[]): string[] => {
  if (stocks.length === 0) return [];
  // Use the dates of the first stock as the baseline
  return stocks[0].series.map(s => s.date);
};

export const calculateChartData = (
  stocks: Stock[]
): CalculatedDataPoint[] => {
  const dates = getCommonDates(stocks);
  if (!dates.length) return [];

  const startIndex = 0;
  
  const chartData: CalculatedDataPoint[] = dates.map(date => {
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
  stocks: Stock[]
): StockRanking[] => {
  const dates = getCommonDates(stocks);
  if (!dates.length) return [];
  
  const startIndex = 0;
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
  stocks: Stock[]
): { 'EV Basket': number, 'Big Auto': number } => {
  const chartData = calculateChartData(stocks);
  const lastPoint = chartData[chartData.length - 1];
  
  return {
    'EV Basket': Number(lastPoint?.['EV Basket'] || 0),
    'Big Auto': Number(lastPoint?.['Big Auto'] || 0)
  };
};
