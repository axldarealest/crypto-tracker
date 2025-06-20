import { CRYPTO_CONSTANTS } from "@/constants";
import { ChartDataPoint } from "@/types";

// Formatting utilities
export const formatEUR = (amount: number): string => 
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

export const formatBTC = (satoshi: number): string => 
  (satoshi / CRYPTO_CONSTANTS.SATOSHI_TO_BTC).toFixed(8);

export const formatDate = (date: Date): string => 
  date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

// Calculation utilities
export const calculateEURValue = (cryptoAmount: number, price: number): number => 
  cryptoAmount * price;

export const getDaysSinceYearStart = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// Chart data generation
export const generateChartData = (
  days: number,
  initialValue: number,
  volatility: number
): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let currentValue = initialValue;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Make weekends less volatile
    const dayOfWeek = date.getDay();
    const dailyVolatility = (dayOfWeek === 0 || dayOfWeek === 6) ? volatility * 0.5 : volatility;
    
    const randomFactor = (Math.random() - 0.5) * dailyVolatility;
    currentValue *= (1 + randomFactor);

    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      value: currentValue
    });
  }
  return data;
};

// Time range conversion
export const timeRangeToDays = (range: string): number => {
  switch(range) {
    case '1J': return 1;
    case '7J': return 7;
    case '1M': return 30;
    case '1A': return 365;
    case 'YTD': return getDaysSinceYearStart();
    case 'TOUT': return 365; // Max days for free CoinGecko API
    default: return 365;
  }
};

// Validation utilities  
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Error handling
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur inattendue est survenue.";
}; 