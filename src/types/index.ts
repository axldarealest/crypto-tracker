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

// Asset categories and types
export type AssetCategory = 'crypto' | 'livrets' | 'actions' | 'comptes-bancaires' | 'metaux-precieux';

export interface AssetBase {
  id: string;
  category: AssetCategory;
  name: string;
  value: number; // Value in EUR
  lastUpdated: Date;
  icon?: string;
  performance?: {
    change24h?: number;
    changePercent24h?: number;
  };
}

export interface CryptoAsset extends AssetBase {
  category: 'crypto';
  symbol: string; // BTC, ETH, etc.
  address?: string;
  amount: number; // Amount of crypto owned
  currentPrice: number; // Current price per unit in EUR
  addedManually: boolean;
}

export interface LivretAsset extends AssetBase {
  category: 'livrets';
  type: 'livret-a' | 'ldds' | 'pel' | 'cel' | 'livret-populaire' | 'livret-jeune' | 'autre';
  interestRate: number; // Interest rate in percentage
  bank?: string;
}

export interface ActionAsset extends AssetBase {
  category: 'actions';
  ticker: string; // Stock ticker symbol
  quantity: number;
  currentPrice: number;
  market: string; // NYSE, NASDAQ, EURONEXT, etc.
}

export interface CompteBancaireAsset extends AssetBase {
  category: 'comptes-bancaires';
  type: 'compte-courant' | 'compte-epargne' | 'pel' | 'pea' | 'assurance-vie' | 'autre';
  bank: string;
  accountNumber?: string; // Masked for security
}

export interface MetauxPrecieuxAsset extends AssetBase {
  category: 'metaux-precieux';
  type: 'or' | 'argent' | 'platine' | 'palladium';
  weight: number; // Weight in grams
  purity?: number; // Purity percentage
  currentPricePerGram: number;
}

export type Asset = CryptoAsset | LivretAsset | ActionAsset | CompteBancaireAsset | MetauxPrecieuxAsset;

export interface Portfolio {
  totalValue: number;
  assets: Asset[];
  breakdown: {
    [K in AssetCategory]: {
      totalValue: number;
      count: number;
      performance?: {
        change24h: number;
        changePercent24h: number;
      };
    };
  };
}

// Modal and UI types
export interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetAdded: (asset: Asset) => void;
  onCategorySelect?: (category: AssetCategory) => void;
}

export interface AssetCategoryCardProps {
  category: AssetCategory;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
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