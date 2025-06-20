// User and Authentication types
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}

export interface Session {
  user: User;
  expires: string;
}

// Crypto data types
export interface BitcoinData {
  address: string;
  chain_stats: {
    funded_txo_sum: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_sum: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  tx_count: number;
}

export interface CryptoPrice {
  eur: number;
  eur_24h_change: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

// Component props types
export interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export interface ToggleProps {
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

// Time range types
export type TimeRange = '1J' | '7J' | '1M' | 'YTD' | '1A' | 'TOUT';

export interface TimeRangeConfig {
  [key: string]: ChartDataPoint[];
} 