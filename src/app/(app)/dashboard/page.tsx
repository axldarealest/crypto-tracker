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
      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg border border-dashed border-[var(--foreground)]/20 shadow-sm">
        <p className="label text-sm text-[var(--foreground)] font-medium">{`Le ${label} : ${formatEUR(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const formatEUR = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

const categoryIcons: { [K in AssetCategory]: React.ReactNode } = {
  'crypto': <Bitcoin className="text-[var(--accent)]" size={24} />,
  'livrets': <PiggyBank className="text-[var(--accent)]" size={24} />,
  'actions': <TrendingUp className="text-[var(--accent)]" size={24} />,
  'comptes-bancaires': <CreditCard className="text-[var(--accent)]" size={24} />,
  'metaux-precieux': <Gem className="text-[var(--accent)]" size={24} />
};

const categoryNames: { [K in AssetCategory]: string } = {
  'crypto': 'Cryptomonnaies',
  'livrets': 'Livrets & Épargne',
  'actions': 'Actions & Fonds',
  'comptes-bancaires': 'Comptes bancaires',
  'metaux-precieux': 'Métaux précieux'
};

const categoryColors = ['#FF4F00', '#FF6B35', '#FF8C42', '#FFA559', '#FFBE6F'];

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
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
          <p className="text-lg">Chargement de votre patrimoine...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      {/* Lignes de grille en fond */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full border-r border-dashed border-[var(--foreground)]/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-8 lg:mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 lg:mb-6">
            <div className="flex items-center gap-4">
              <button className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors">
                <ChevronLeft size={20} className="lg:w-6 lg:h-6" />
              </button>
              <h1 className="text-2xl lg:text-3xl font-bold text-[var(--foreground)]">Mon Patrimoine</h1>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <button
                onClick={handleAddAssetClick}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
              >
                <Plus size={16} />
                <span className="hidden xs:inline">Ajouter</span>
              </button>
              <button
                onClick={() => {
                  if (confirm("Êtes-vous sûr de vouloir réinitialiser ?")) {
                    clearLocalStorage();
                  }
                }}
                className="group text-xs font-semibold leading-6 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
                title="Vider le cache (debug)"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="ml-10">
            <p className="text-xs lg:text-sm text-[var(--foreground)]/60">{currentDate}</p>
            <p className="text-4xl lg:text-6xl font-bold text-[var(--foreground)] mt-1 lg:mt-2">
              {formatEUR(portfolio.totalValue)}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            {/* Chart Section */}
            <section className="rounded-lg border border-dashed border-[var(--foreground)]/20 bg-white/20 p-4 lg:p-6 xl:p-8 mb-6 lg:mb-8 shadow-sm backdrop-blur-sm">
              <div className="flex justify-end items-center mb-4 lg:mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 flex items-center space-x-1">
                  {timeRanges.map(range => (
                    <button 
                      key={range} 
                      onClick={() => setActiveTimeRange(range)}
                      className={`px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-full transition-all duration-300 ${
                        activeTimeRange === range 
                          ? 'bg-[var(--accent)] text-white shadow-lg' 
                          : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-white/10'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', height: 300, minHeight: 250 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--foreground)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="var(--foreground)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(value / 1000)} k€`}
                      domain={['dataMin', 'dataMax']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
            
            {/* Assets by Category - Only show if there are assets */}
            {portfolio.assets.length > 0 && (
              <section>
                <h2 className="text-xl lg:text-2xl font-bold text-[var(--foreground)] mb-4 lg:mb-6">Actifs par catégorie</h2>
                <div className="space-y-3 lg:space-y-4">
                  {categoriesWithAssets.length === 0 ? (
                    <div className="text-center py-8 lg:py-12 text-[var(--foreground)]/60 bg-white/20 backdrop-blur-sm rounded-lg border border-dashed border-[var(--foreground)]/20">
                      <p className="text-base lg:text-lg">Aucun actif ajouté pour le moment</p>
                      <p className="text-xs lg:text-sm mt-2 lg:mt-3">Cliquez sur "Ajouter un actif" pour commencer</p>
                    </div>
                  ) : (
                  categoriesWithAssets
                    .map(([category, data]) => {
                    const categoryKey = category as AssetCategory;
                    const isExpanded = expandedCategories.has(categoryKey);
                    const categoryAssets = portfolio.assets.filter(asset => asset.category === categoryKey);
                    
                    return (
                      <div key={category} className="rounded-lg border border-dashed border-[var(--foreground)]/20 bg-white/20 overflow-hidden shadow-sm backdrop-blur-sm">
                        {/* Category Header - Clickable */}
                        <button
                          onClick={() => toggleCategoryExpansion(categoryKey)}
                          className="w-full hover:bg-white/10 transition-all duration-300 p-4 lg:p-6 grid grid-cols-3 items-center gap-3 text-left"
                        >
                          <div className="flex items-center gap-3 col-span-1">
                            {categoryIcons[categoryKey]}
                            <div>
                              <p className="font-semibold text-[var(--foreground)] text-sm">{categoryNames[categoryKey]}</p>
                              <p className="text-xs text-[var(--foreground)]/60">{data.count} actif{data.count > 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[var(--foreground)] text-sm">{formatEUR(data.totalValue)}</p>
                          </div>
                          <div className="text-right flex items-center justify-end gap-2">
                            <div className="text-right">
                              <p className={`font-semibold text-sm ${data.performance && data.performance.changePercent24h >= 0 ? 'text-[var(--accent)]' : 'text-red-500'}`}>
                                {data.performance && (
                                  <>
                                    {data.performance.changePercent24h >= 0 ? '+' : ''}{data.performance.changePercent24h.toFixed(2)}%
                                  </>
                                )}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="text-[var(--foreground)]/60" size={18} />
                            ) : (
                              <ChevronDown className="text-[var(--foreground)]/60" size={18} />
                            )}
                          </div>
                        </button>

                        {/* Expanded Assets */}
                        {isExpanded && categoryAssets.length > 0 && (
                          <div className="border-t border-dashed border-[var(--foreground)]/20">
                            {categoryAssets.map((asset) => (
                              <div
                                key={asset.id}
                                className="bg-white/10 hover:bg-white/20 transition-all duration-300 p-3 lg:p-4 mx-4 my-2 rounded-lg grid grid-cols-3 items-center gap-3 text-xs"
                              >
                                <div className="flex items-center gap-2 col-span-1">
                                  {getAssetIcon(asset)}
                                  <div>
                                    <p className="font-semibold text-[var(--foreground)]">{asset.name}</p>
                                    {asset.category === 'crypto' && (
                                      <p className="text-xs text-[var(--foreground)]/60">
                                        {formatCryptoAmount(asset as CryptoAsset)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-[var(--foreground)]">{formatEUR(asset.value)}</p>
                                </div>
                                <div className="text-right">
                                  <p className={`font-semibold ${asset.performance && asset.performance.changePercent24h && asset.performance.changePercent24h >= 0 ? 'text-[var(--accent)]' : 'text-red-500'}`}>
                                    {asset.performance && asset.performance.changePercent24h ? (
                                      <>
                                        {asset.performance.changePercent24h >= 0 ? '+' : ''}{asset.performance.changePercent24h.toFixed(2)}%
                                      </>
                                    ) : (
                                      '-'
                                    )}
                                  </p>
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
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Performance Panel */}
            <section className="rounded-lg border border-dashed border-[var(--foreground)]/20 bg-white/20 p-4 lg:p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-lg lg:text-xl font-bold text-[var(--foreground)] mb-3 lg:mb-4">Performance</h2>
              <div className="space-y-3 lg:space-y-4">
                <p className="text-xs lg:text-sm text-[var(--foreground)]/60">Performance sur la période "{activeTimeRange}" pour l'ensemble du patrimoine</p>
                <div>
                  <p className={`text-2xl lg:text-3xl font-bold ${performanceData.value >= 0 ? 'text-[var(--accent)]' : 'text-red-500'}`}>
                    {performanceData.value >= 0 ? '+' : ''}{formatEUR(performanceData.value)}
                  </p>
                  <p className={`text-base lg:text-lg font-semibold ${performanceData.percentage >= 0 ? 'text-[var(--accent)]' : 'text-red-500'}`}>
                    {performanceData.percentage >= 0 ? '+' : ''}{performanceData.percentage.toFixed(2)} %
                  </p>
                </div>
              </div>
            </section>

            {/* Portfolio Breakdown */}
            <section className="rounded-lg border border-dashed border-[var(--foreground)]/20 bg-white/20 p-4 lg:p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-lg lg:text-xl font-bold text-[var(--foreground)] mb-3 lg:mb-4">Répartition</h2>
              <div style={{ width: '100%', height: 180 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [formatEUR(value), 'Valeur']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        border: '1px dashed rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(12px)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 lg:space-y-3 mt-4 lg:mt-6">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div 
                        className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs lg:text-sm text-[var(--foreground)] font-semibold">{entry.name}</span>
                    </div>
                    <span className="text-xs lg:text-sm text-[var(--foreground)] font-bold">
                      {((entry.value / portfolio.totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <footer className="text-center mt-12 lg:mt-16 text-[var(--foreground)]/40 text-xs lg:text-sm">
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
