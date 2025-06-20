"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Bitcoin, 
  TrendingUp, 
  ChevronLeft,
  MoreVertical,
  Plus,
  PiggyBank,
  CreditCard,
  Gem,
  ChevronDown,
  ChevronUp,
  Coins
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import AddAssetModal from '@/components/AddAssetModal';
import AddCryptoModal from '@/components/AddCryptoModal';
import EditCryptoModal from '@/components/EditCryptoModal';
import { Asset, CryptoAsset, Portfolio, AssetCategory } from '@/types';

// --- Portfolio Data Management ---
const generateEmptyPortfolio = (): Portfolio => {
  return {
    totalValue: 0,
    assets: [],
    breakdown: {} as Portfolio['breakdown']
  };
};

const generatePortfolioFromAssets = (assets: Asset[]): Portfolio => {
  const breakdown = assets.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = { totalValue: 0, count: 0, performance: { change24h: 0, changePercent24h: 0 } };
    }
    acc[asset.category].totalValue += asset.value;
    acc[asset.category].count += 1;
    if (asset.performance) {
      acc[asset.category].performance!.change24h += asset.performance.change24h || 0;
    }
    return acc;
  }, {} as Portfolio['breakdown']);

  // Calculate percentage changes for each category
  Object.keys(breakdown).forEach(category => {
    const cat = breakdown[category as AssetCategory];
    if (cat.totalValue > 0) {
      cat.performance!.changePercent24h = (cat.performance!.change24h / (cat.totalValue - cat.performance!.change24h)) * 100;
    }
  });

  return {
    totalValue: assets.reduce((sum, asset) => sum + asset.value, 0),
    assets,
    breakdown
  };
};

// LocalStorage persistence
const PORTFOLIO_STORAGE_KEY = 'crypto-tracker-portfolio';

const savePortfolioToStorage = (portfolio: Portfolio) => {
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify({
      ...portfolio,
      assets: portfolio.assets.map(asset => ({
        ...asset,
        lastUpdated: asset.lastUpdated.toISOString()
      }))
    }));
  } catch (error) {
    console.error('Failed to save portfolio to localStorage:', error);
  }
};

const loadPortfolioFromStorage = (): Portfolio => {
  try {
    const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const portfolio = {
        ...parsed,
        assets: parsed.assets.map((asset: any) => ({
          ...asset,
          lastUpdated: new Date(asset.lastUpdated)
        }))
      };
      // Regenerate portfolio data to ensure consistency
      return generatePortfolioFromAssets(portfolio.assets);
    }
  } catch (error) {
    console.error('Failed to load portfolio from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
  }
  return generateEmptyPortfolio();
};

// --- Chart Data ---
interface ChartDataPoint {
    date: string;
    value: number;
}

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

// Dynamic chart data generation based on portfolio value
const generateChartDataSets = (portfolioValue: number): { [key: string]: ChartDataPoint[] } => {
    if (portfolioValue === 0) {
        // Flat line at 0 for empty portfolio
        return {
            '1J': generateChartData(1, 0, 0),
            '7J': generateChartData(7, 0, 0),
            '1M': generateChartData(30, 0, 0),
            'YTD': generateChartData(365, 0, 0),
            '1A': generateChartData(365, 0, 0),
        };
    }
    
    // Generate realistic chart data based on current portfolio value
    return {
        '1J': generateChartData(1, portfolioValue * 0.99, 0.01),
        '7J': generateChartData(7, portfolioValue * 0.98, 0.02),
        '1M': generateChartData(30, portfolioValue * 0.95, 0.03),
        'YTD': generateChartData(365, portfolioValue * 0.92, 0.05),
        '1A': generateChartData(365, portfolioValue * 0.90, 0.05),
    };
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
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

const categoryIcons: { [K in AssetCategory]: React.ReactNode } = {
  'crypto': <Bitcoin className="text-orange-400" size={32} />,
  'livrets': <PiggyBank className="text-blue-400" size={32} />,
  'actions': <TrendingUp className="text-green-400" size={32} />,
  'comptes-bancaires': <CreditCard className="text-purple-400" size={32} />,
  'metaux-precieux': <Gem className="text-yellow-400" size={32} />
};

const categoryNames: { [K in AssetCategory]: string } = {
  'crypto': 'Cryptomonnaies',
  'livrets': 'Livrets & Épargne',
  'actions': 'Actions & Fonds',
  'comptes-bancaires': 'Comptes bancaires',
  'metaux-precieux': 'Métaux précieux'
};

const categoryColors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#eab308'];

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio>(generateEmptyPortfolio());
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activeTimeRange, setActiveTimeRange] = useState('1A');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCryptoModal, setShowAddCryptoModal] = useState(false);
  const [showEditCryptoModal, setShowEditCryptoModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<CryptoAsset | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<AssetCategory>>(new Set());

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));
    
    // Load portfolio from localStorage (always load, even if empty)
    const savedPortfolio = loadPortfolioFromStorage();
    
    // Clean duplicates automatically
    if (savedPortfolio.assets.length > 0) {
      const uniqueAssets = savedPortfolio.assets.filter((asset, index, self) => {
        if (asset.category === 'crypto') {
          const cryptoAsset = asset as CryptoAsset;
          return index === self.findIndex(a => 
            a.category === 'crypto' && 
            (a as CryptoAsset).address === cryptoAsset.address &&
            (a as CryptoAsset).symbol === cryptoAsset.symbol
          );
        }
        return index === self.findIndex(a => a.id === asset.id);
      });
      
      if (uniqueAssets.length !== savedPortfolio.assets.length) {
        const cleanedPortfolio = generatePortfolioFromAssets(uniqueAssets);
        savePortfolioToStorage(cleanedPortfolio);
        setPortfolio(cleanedPortfolio);
      } else {
        setPortfolio(savedPortfolio);
      }
    } else {
      setPortfolio(savedPortfolio);
    }
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      const chartDataSets = generateChartDataSets(savedPortfolio.totalValue);
      setChartData(chartDataSets[activeTimeRange]);
    }, 1000);
  }, [activeTimeRange]);

  useEffect(() => {
    const chartDataSets = generateChartDataSets(portfolio.totalValue);
    setChartData(chartDataSets[activeTimeRange]);
  }, [activeTimeRange, portfolio.totalValue]);

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

  const pieData = Object.entries(portfolio.breakdown)
    .filter(([, data]) => data.totalValue > 0)
    .map(([category, data], index) => ({
      name: categoryNames[category as AssetCategory],
      value: data.totalValue,
      color: categoryColors[index % categoryColors.length]
    }));

  // Get all categories that have assets (even with 0 value)
  const categoriesWithAssets = Object.entries(portfolio.breakdown)
    .filter(([, data]) => data.count > 0);

  const handleAssetAdded = (asset: Asset) => {
    setPortfolio(prev => {
      // Check for duplicates (same address for crypto assets)
      const isDuplicate = prev.assets.some(existingAsset => {
        if (asset.category === 'crypto' && existingAsset.category === 'crypto') {
          const newCrypto = asset as CryptoAsset;
          const existingCrypto = existingAsset as CryptoAsset;
          return newCrypto.address === existingCrypto.address && newCrypto.symbol === existingCrypto.symbol;
        }
        return existingAsset.id === asset.id;
      });

      if (isDuplicate) {
        alert('Cette adresse a déjà été ajoutée !');
        return prev;
      }

      const newAssets = [...prev.assets, asset];
      const newPortfolio = generatePortfolioFromAssets(newAssets);
      savePortfolioToStorage(newPortfolio);
      return newPortfolio;
    });
  };

  const handleAssetUpdated = (updatedAsset: CryptoAsset) => {
    setPortfolio(prev => {
      const newAssets = prev.assets.map(asset => 
        asset.id === updatedAsset.id ? updatedAsset : asset
      );
      const newPortfolio = generatePortfolioFromAssets(newAssets);
      savePortfolioToStorage(newPortfolio);
      return newPortfolio;
    });
  };

  const handleAssetDeleted = (assetId: string) => {
    setPortfolio(prev => {
      const newAssets = prev.assets.filter(asset => asset.id !== assetId);
      const newPortfolio = generatePortfolioFromAssets(newAssets);
      savePortfolioToStorage(newPortfolio);
      return newPortfolio;
    });
  };

  const handleEditAsset = (asset: Asset) => {
    if (asset.category === 'crypto') {
      setEditingAsset(asset as CryptoAsset);
      setShowEditCryptoModal(true);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
    setPortfolio(generateEmptyPortfolio());
  };





  const handleAddAssetClick = () => {
    setShowAddModal(true);
  };

  const handleCategorySelect = (category: AssetCategory) => {
    switch (category) {
      case 'crypto':
        setShowAddCryptoModal(true);
        break;
      case 'livrets':
      case 'actions':
      case 'comptes-bancaires':
      case 'metaux-precieux':
        // For now, show a message that these categories are coming soon
        alert(`L'ajout de ${categoryNames[category]} sera bientôt disponible !`);
        break;
    }
  };

  const toggleCategoryExpansion = (category: AssetCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getAssetIcon = (asset: Asset) => {
    if (asset.category === 'crypto') {
      const cryptoAsset = asset as CryptoAsset;
      switch (cryptoAsset.symbol) {
        case 'BTC':
          return <Bitcoin className="text-orange-400" size={24} />;
        case 'ETH':
          return <Coins className="text-blue-400" size={24} />;
        default:
          return <Coins className="text-gray-400" size={24} />;
      }
    }
    return categoryIcons[asset.category];
  };

  const formatCryptoAmount = (asset: CryptoAsset) => {
    if (asset.amount === 0) {
      return `0 ${asset.symbol}`;
    }
    if (asset.symbol === 'BTC') {
      return `${asset.amount.toFixed(8)} BTC`;
    }
    return `${asset.amount.toFixed(4)} ${asset.symbol}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-lg">Chargement de votre patrimoine...</p>
        </div>
      </div>
    );
  }



  return (
    <main className="bg-black text-gray-300 min-h-screen font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white">
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-2xl font-semibold text-white">Mon Patrimoine</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddAssetClick}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Ajouter mon patrimoine
              </button>
              <button
                onClick={() => {
                  if (confirm("T'es sûr ?")) {
                    clearLocalStorage();
                  }
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                title="Vider le cache (debug)"
              >
                Reset
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-400 ml-10">{currentDate}</p>
          <p className="text-5xl font-bold text-white ml-10 mt-2">{formatEUR(portfolio.totalValue)}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Chart Section */}
            <section className="bg-gray-900/50 rounded-xl p-4 md:p-6 mb-8">
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
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                      tickFormatter={(value) => `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(value / 1000)} k€`}
                      domain={['dataMin', 'dataMax']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
            
            {/* Assets by Category - Only show if there are assets */}
            {portfolio.assets.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Actifs par catégorie</h2>
                <div className="space-y-2">
                  {categoriesWithAssets.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 bg-gray-900/30 rounded-lg">
                      <p>Aucun actif ajouté pour le moment</p>
                      <p className="text-sm mt-2">Cliquez sur "Ajouter mon patrimoine" pour commencer</p>
                    </div>
                  ) : (
                  categoriesWithAssets
                    .map(([category, data]) => {
                    const categoryKey = category as AssetCategory;
                    const isExpanded = expandedCategories.has(categoryKey);
                    const categoryAssets = portfolio.assets.filter(asset => asset.category === categoryKey);
                    
                    return (
                      <div key={category} className="bg-gray-900/50 rounded-lg overflow-hidden">
                        {/* Category Header - Clickable */}
                        <button
                          onClick={() => toggleCategoryExpansion(categoryKey)}
                          className="w-full hover:bg-gray-800/60 transition-colors duration-200 p-4 grid grid-cols-3 md:grid-cols-6 items-center gap-4 text-left"
                        >
                          <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                            {categoryIcons[categoryKey]}
                            <div>
                              <p className="font-semibold text-white">{categoryNames[categoryKey]}</p>
                              <p className="text-sm text-gray-400">{data.count} actif{data.count > 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="text-right md:text-left">
                            <p className="text-sm text-gray-400">Valeur</p>
                            <p className="font-semibold text-white">{formatEUR(data.totalValue)}</p>
                          </div>
                          <div className="text-right md:text-left">
                            <p className="text-sm text-gray-400">Performance 24h</p>
                            <p className={`font-semibold ${data.performance && data.performance.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {data.performance && (
                                <>
                                  {data.performance.change24h >= 0 ? '+' : ''}{formatEUR(data.performance.change24h)}
                                </>
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${data.performance && data.performance.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {data.performance && (
                                <>
                                  {data.performance.changePercent24h >= 0 ? '+' : ''}{data.performance.changePercent24h.toFixed(2)}%
                                </>
                              )}
                            </p>
                          </div>
                          <div className="text-right flex items-center justify-end gap-2">
                            {isExpanded ? (
                              <ChevronUp className="text-gray-400" size={20} />
                            ) : (
                              <ChevronDown className="text-gray-400" size={20} />
                            )}
                            <MoreVertical className="text-gray-400 hover:text-white" size={20} />
                          </div>
                        </button>

                        {/* Expanded Assets */}
                        {isExpanded && categoryAssets.length > 0 && (
                          <div className="border-t border-gray-700/50">
                            {categoryAssets.map((asset) => (
                              <div
                                key={asset.id}
                                className="bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-200 p-3 ml-4 mr-4 mb-2 mt-2 rounded-lg grid grid-cols-3 md:grid-cols-6 items-center gap-4 text-sm"
                              >
                                <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                                  {getAssetIcon(asset)}
                                  <div>
                                    <p className="font-medium text-white">{asset.name}</p>
                                    {asset.category === 'crypto' && (
                                      <p className="text-xs text-gray-400">
                                        {formatCryptoAmount(asset as CryptoAsset)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="text-right md:text-left">
                                  <p className="text-xs text-gray-400">Valeur</p>
                                  <p className="font-medium text-white">{formatEUR(asset.value)}</p>
                                </div>
                                
                                {asset.category === 'crypto' && (
                                  <div className="text-right md:text-left">
                                    <p className="text-xs text-gray-400">Prix unitaire</p>
                                    <p className="font-medium text-white">
                                      {formatEUR((asset as CryptoAsset).currentPrice)}
                                    </p>
                                  </div>
                                )}
                                
                                {asset.category !== 'crypto' && (
                                  <div className="text-right md:text-left">
                                    <p className="text-xs text-gray-400">Type</p>
                                    <p className="font-medium text-white">-</p>
                                  </div>
                                )}
                                
                                <div className="text-right">
                                  <p className={`font-medium ${asset.performance && asset.performance.changePercent24h && asset.performance.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {asset.performance && asset.performance.changePercent24h ? (
                                      <>
                                        {asset.performance.changePercent24h >= 0 ? '+' : ''}{asset.performance.changePercent24h.toFixed(2)}%
                                      </>
                                    ) : (
                                      '-'
                                    )}
                                  </p>
                                </div>
                                
                                <div className="text-right">
                                  <button 
                                    onClick={() => handleEditAsset(asset)}
                                    className="text-gray-400 hover:text-white opacity-60 hover:opacity-100 transition-opacity"
                                    title="Modifier"
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Performance Panel */}
            <section className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Performance</h2>
              <div className="space-y-4">
                                 <p className="text-sm text-gray-400">Performance sur la période &ldquo;{activeTimeRange}&rdquo; pour l&apos;ensemble du patrimoine</p>
                <div>
                  <p className={`text-3xl font-bold ${performanceData.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {performanceData.value >= 0 ? '+' : ''}{formatEUR(performanceData.value)}
                  </p>
                  <p className={`text-md font-semibold ${performanceData.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {performanceData.percentage >= 0 ? '+' : ''}{performanceData.percentage.toFixed(2)} %
                  </p>
                </div>
              </div>
            </section>

            {/* Portfolio Breakdown */}
            <section className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Répartition</h2>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [formatEUR(value), 'Valeur']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                                 {pieData.map((entry) => (
                   <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-gray-300">{entry.name}</span>
                    </div>
                    <span className="text-sm text-white font-medium">
                      {((entry.value / portfolio.totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Données via diverses sources. Rafraîchissement automatique.</p>
        </footer>
      </div>

      {/* Modals */}
      <AddAssetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAssetAdded={handleAssetAdded}
        onCategorySelect={handleCategorySelect}
      />
      <AddCryptoModal
        isOpen={showAddCryptoModal}
        onClose={() => setShowAddCryptoModal(false)}
        onAssetAdded={handleAssetAdded}
      />
      <EditCryptoModal
        isOpen={showEditCryptoModal}
        onClose={() => {
          setShowEditCryptoModal(false);
          setEditingAsset(null);
        }}
        asset={editingAsset}
        onAssetUpdated={handleAssetUpdated}
        onAssetDeleted={handleAssetDeleted}
      />
    </main>
  );
}
