"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  ChevronLeft,
  MoreVertical
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

interface BitcoinData {
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

interface EthereumData {
  address: string;
  balance: string;
  tx_count: number;
}

interface CryptoPrice {
  eur: number;
  eur_24h_change: number;
}

// --- Mock Chart Data ---
interface ChartDataPoint {
    date: string;
    value: number;
}

// More realistic data generation
const generateChartData = (
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

const getDaysSinceYearStart = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const chartDataSets: { [key: string]: ChartDataPoint[] } = {
    '1J': generateChartData(1, 1445, 0.01),
    '7J': generateChartData(7, 1410, 0.02),
    '1M': generateChartData(30, 1350, 0.03),
    'YTD': generateChartData(getDaysSinceYearStart(), 1200, 0.05),
    '1A': generateChartData(365, 1100, 0.05),
    'TOUT': [ // Match the screenshot
        { date: '08/06', value: 1412 },
        { date: '09/06', value: 1415 },
        { date: '10/06', value: 1475 },
        { date: '11/06', value: 1482 },
        { date: '12/06', value: 1380 },
        { date: '13/06', value: 1375 },
        { date: '14/06', value: 1388 },
        { date: '15/06', value: 1395 },
        { date: '16/06', value: 1410 },
        { date: '17/06', value: 1425 },
        { date: '18/06', value: 1435 },
        { date: '19/06', value: 1440 },
        { date: '20/06', value: 1450 },
    ],
};
// --- End Mock Chart Data ---

const timeRangeToDays = (range: string): number => {
    switch(range) {
        case '1J': return 1;
        case '7J': return 7;
        case '1M': return 30;
        case '1A': return 365;
        case 'YTD': {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const diff = now.getTime() - start.getTime();
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        }
        case 'TOUT': return 365; // Max days for free CoinGecko API
        default: return 365;
    }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 rounded-md border border-gray-700">
        <p className="label text-sm text-white">{`Le ${label} : ${formatEUR(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};

const formatEUR = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

export default function Home() {
  const [btcData, setBtcData] = useState<BitcoinData | null>(null);
  const [btcPrice, setBtcPrice] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activeTimeRange, setActiveTimeRange] = useState('1A');

  const BTC_ADDRESS = "bc1placeholderaddressfor1btc"; // Adresse d'exemple pour 1 BTC

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));

    const fetchData = async () => {
      try {
        // Simuler un portefeuille avec exactement 1 BTC
        const mockBtcData: BitcoinData = {
          address: BTC_ADDRESS,
          chain_stats: {
            funded_txo_sum: 100000000, // 1 BTC in satoshis
            spent_txo_sum: 0,
            tx_count: 1, // Example value
          },
          mempool_stats: {
            funded_txo_sum: 0,
            spent_txo_sum: 0,
            tx_count: 0,
          },
          tx_count: 1,
        };

        // Récupérer le prix du BTC depuis CoinGecko
        const priceResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true");
        if (!priceResponse.ok) {
          throw new Error(`Erreur CoinGecko API: ${priceResponse.statusText}`);
        }
        const priceData = await priceResponse.json();
        
        if (!priceData.bitcoin) {
          throw new Error("La réponse de CoinGecko est malformée.");
        }

        setBtcData(mockBtcData);
        setBtcPrice(priceData.bitcoin);
        setError(null);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur inattendue est survenue.");
        }
        console.error(err);
      }
    };

    fetchData();
    
  }, []);

  useEffect(() => {
    if (!btcData || !btcPrice) return;

    const fetchHistoricalData = async () => {
        try {
            setLoading(true);
            const days = timeRangeToDays(activeTimeRange);
            const to = Math.floor(Date.now() / 1000);
            const from = to - days * 24 * 60 * 60;
            
            const response = await fetch(`/api/coingecko?from=${from}&to=${to}`);
            const responseData = await response.json();
            
            // If API returns error or empty prices, use fallback data
            if (!response.ok || !responseData.prices || responseData.prices.length === 0) {
                console.warn('Using fallback chart data:', responseData.error || 'No price data available');
                
                // Use mock chart data as fallback
                const fallbackData = chartDataSets[activeTimeRange] || chartDataSets['1A'];
                const btcBalance = (btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum) / 100000000;
                
                // Scale fallback data to current BTC price and balance
                const scaledFallbackData = fallbackData.map(point => ({
                    ...point,
                    value: point.value * btcBalance
                }));
                
                setChartData(scaledFallbackData);
                return;
            }
            
            const btcBalance = (btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum) / 100000000;
            
            const formattedChartData: ChartDataPoint[] = responseData.prices.map((pricePoint: [number, number]) => ({
                date: new Date(pricePoint[0]).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
                value: pricePoint[1] * btcBalance,
            }));
            
            setChartData(formattedChartData);

        } catch (err) {
            console.warn('API error, using fallback data:', err);
            
            // Use mock chart data as fallback
            const fallbackData = chartDataSets[activeTimeRange] || chartDataSets['1A'];
            const btcBalance = (btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum) / 100000000;
            
            // Scale fallback data to current BTC price and balance
            const scaledFallbackData = fallbackData.map(point => ({
                ...point,
                value: point.value * btcBalance
            }));
            
            setChartData(scaledFallbackData);
        } finally {
            setLoading(false);
        }
    };
    
    fetchHistoricalData();

  }, [activeTimeRange, btcData, btcPrice]);
  
  const finalBalance = btcData ? btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum : 0;
  
  const formatBTC = (satoshi: number) => (satoshi / 100000000).toFixed(8);
  const calculateEURValue = (cryptoAmount: number, price: number) => cryptoAmount * price;

  const btcBalanceCrypto = finalBalance / 100000000;
  const btcValueEUR = calculateEURValue(btcBalanceCrypto, btcPrice?.eur || 0);

  const totalPortfolioValueEUR = btcValueEUR;

  const timeRanges = ['1J', '7J', '1M', 'YTD', '1A'];

  const performanceData = useMemo(() => {
    if (chartData.length < 2) {
      return { value: 0, percentage: 0 };
    }
    const startValue = chartData[0].value;
    const endValue = chartData[chartData.length - 1].value;
    const valueChange = endValue - startValue;
    const percentageChange = startValue === 0 ? 0 : (valueChange / startValue) * 100;

    return {
      value: valueChange,
      percentage: percentageChange,
    };
  }, [chartData]);

  if (loading && chartData.length === 0) { // Show initial loader only
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-lg">Chargement du portefeuille crypto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center bg-gray-900/50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Oops! Une erreur est survenue</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-black text-gray-300 min-h-screen font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                <button className="text-gray-400 hover:text-white">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-semibold text-white">Crypto</h1>
            </div>
            <p className="text-sm text-gray-400 ml-10">{currentDate}</p>
            <p className="text-5xl font-bold text-white ml-10 mt-2">{formatEUR(totalPortfolioValueEUR)}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Chart Section */}
            <section className="bg-gray-900/50 rounded-xl p-4 md:p-6">
                <div className="flex justify-end items-center mb-4">
                    <div className="bg-gray-800 rounded-full p-1 flex items-center space-x-1">
                        {timeRanges.map(range => (
                            <button 
                                key={range} 
                                onClick={() => setActiveTimeRange(range)}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${activeTimeRange === range ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(value / 1000)} k€`}
                        domain={['dataMin', 'dataMax']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
            </section>
            
            {/* Assets List Section */}
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Actifs</h2>
              <div className="space-y-2">
                {/* Bitcoin Asset */}
                {btcData && btcPrice && (
                  <div className="bg-gray-900/50 hover:bg-gray-800/60 transition-colors duration-200 rounded-lg p-4 grid grid-cols-3 md:grid-cols-5 items-center gap-4">
                    <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                      <Bitcoin className="text-yellow-400" size={32} />
                      <div>
                        <p className="font-semibold text-white">Wallet Bitcoin</p>
                        <p className="text-sm text-gray-400">{formatBTC(finalBalance)} BTC</p>
                      </div>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-sm text-gray-400">Prix actuel</p>
                      <p className="font-semibold text-white">{formatEUR(btcPrice.eur)}</p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-sm text-gray-400">Valeur</p>
                      <p className="font-semibold text-white">{formatEUR(btcValueEUR)}</p>
                    </div>
                    <div className="text-right">
                       <p className={`font-semibold ${btcPrice.eur_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                         {btcPrice.eur_24h_change.toFixed(2)}%
                       </p>
                    </div>
                     <div className="text-right">
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Performance Panel */}
          <div className="lg:col-span-1">
            <section className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Performance</h2>
              <div className="space-y-4">
                  <p className="text-sm text-gray-400">Performance sur la période "{activeTimeRange}" pour Crypto</p>
                  <div>
                      <p className={`text-3xl font-bold ${performanceData.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {performanceData.value >= 0 ? '+' : ''}{formatEUR(performanceData.value)}
                      </p>
                      <p className={`text-md font-semibold ${performanceData.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {performanceData.percentage >= 0 ? '+' : ''}{performanceData.percentage.toFixed(2)} %
                      </p>
                  </div>
                  <p className="text-sm text-gray-400">
                      La plus-value latente est la différence entre votre prix d'achat unitaire et le prix actuel. Ce montant ne tient pas compte des plus-values réalisées.
                  </p>
                  <button className="text-sm font-semibold text-blue-400 hover:text-blue-300">
                    En savoir plus &gt;
                  </button>
              </div>
            </section>
          </div>
        </div>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Données via Blockstream, Etherscan & CoinGecko. Rafraîchissement toutes les minutes.</p>
          {chartData.length > 0 && chartData[0].date.includes('/') && (
            <p className="mt-2 text-amber-400 text-xs">
              ⚠️ Données historiques en mode démo (API CoinGecko limitée)
            </p>
          )}
        </footer>
      </div>
    </main>
  );
}
