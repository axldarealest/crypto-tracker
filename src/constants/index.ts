// API URLs
export const API_URLS = {
  COINGECKO_PRICE: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true",
  COINGECKO_HISTORY: "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"
} as const;

// App Routes
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  PORTFOLIO: "/portfolio",
  MARKETS: "/markets"
} as const;

// Time ranges
export const TIME_RANGES = {
  ONE_DAY: "1J",
  SEVEN_DAYS: "7J",
  ONE_MONTH: "1M",
  YEAR_TO_DATE: "YTD",
  ONE_YEAR: "1A",
  ALL_TIME: "TOUT"
} as const;

// Crypto constants
export const CRYPTO_CONSTANTS = {
  SATOSHI_TO_BTC: 100000000,
  MOCK_BTC_ADDRESS: "bc1placeholderaddressfor1btc"
} as const;

// UI Constants
export const UI_CONSTANTS = {
  HEADER_HEIGHT: 64, // 16 * 4 (h-16 in Tailwind)
  LOADING_DELAY: 300,
  ANIMATION_DURATION: 200
} as const;

// Default values
export const DEFAULTS = {
  CHART_INITIAL_VALUE: 1445,
  CHART_VOLATILITY: 0.02,
  LOADING_MESSAGE: "Chargement..."
} as const; 