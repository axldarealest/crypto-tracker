"use client";

import React, { useState, useEffect } from "react";
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, Activity, Zap } from "lucide-react";

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
}

interface EthereumData {
  address: string;
  balance: string;
  tx_count: number;
}

interface CryptoPrice {
  usd: number;
  usd_24h_change: number;
}

export default function Home() {
  const [btcData, setBtcData] = useState<BitcoinData | null>(null);
  const [ethData, setEthData] = useState<EthereumData | null>(null);
  const [btcPrice, setBtcPrice] = useState<CryptoPrice | null>(null);
  const [ethPrice, setEthPrice] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BTC_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"; // Adresse d'exemple
  const ETH_ADDRESS = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"; // Adresse d'exemple

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Récupérer les données de l'adresse BTC depuis Blockstream
        const addressResponse = await fetch(`https://blockstream.info/api/address/${BTC_ADDRESS}`);
        if (!addressResponse.ok) {
          throw new Error(`Erreur Blockstream API: ${addressResponse.statusText}`);
        }
        const addressData: BitcoinData = await addressResponse.json();

        // 2. Récupérer les données de l'adresse ETH depuis Etherscan
        const ethResponse = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${ETH_ADDRESS}&tag=latest&apikey=YourApiKeyToken`);
        if (!ethResponse.ok) {
          throw new Error(`Erreur Etherscan API: ${ethResponse.statusText}`);
        }
        const ethData = await ethResponse.json();
        
        // Pour l'instant, on utilise des données simulées pour l'ETH
        const mockEthData: EthereumData = {
          address: ETH_ADDRESS,
          balance: "1000000000000000000", // 1 ETH en wei
          tx_count: 15
        };

        // 3. Récupérer les prix depuis CoinGecko
        const priceResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true");
        if (!priceResponse.ok) {
          throw new Error(`Erreur CoinGecko API: ${priceResponse.statusText}`);
        }
        const priceData = await priceResponse.json();
        
        if (!priceData.bitcoin || !priceData.ethereum) {
          throw new Error("La réponse de CoinGecko est malformée.");
        }

        setBtcData(addressData);
        setEthData(mockEthData);
        setBtcPrice(priceData.bitcoin);
        setEthPrice(priceData.ethereum);
        setError(null);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur inattendue est survenue.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Rafraîchir toutes les minutes
    return () => clearInterval(interval);
  }, []);
  
  const finalBalance = btcData ? btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum : 0;
  const totalReceived = btcData ? btcData.chain_stats.funded_txo_sum : 0;
  const totalSent = btcData ? btcData.chain_stats.spent_txo_sum : 0;
  const txCount = btcData ? btcData.chain_stats.tx_count : 0;
  
  const ethBalance = ethData ? parseFloat(ethData.balance) / Math.pow(10, 18) : 0;
  const ethTxCount = ethData ? ethData.tx_count : 0;
  
  const formatBTC = (satoshi: number) => (satoshi / 100000000).toFixed(8);
  const formatETH = (wei: number) => (wei / Math.pow(10, 18)).toFixed(6);
  const formatUSD = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const calculateUSDValue = (cryptoAmount: number, price: number) => cryptoAmount * price;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-lg">Chargement du portefeuille crypto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center text-white">
        <div className="text-center bg-white/10 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Oops! Une erreur est survenue</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 font-sans text-white">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Zap className="text-yellow-400" size={40} />
            Crypto Tracker
          </h1>
          <p className="text-gray-300">Portefeuille Bitcoin & Ethereum en temps réel</p>
        </header>

        {/* Prix des cryptos */}
        <section className="grid md:grid-cols-2 gap-6 mb-6">
          {btcPrice && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bitcoin className="text-yellow-400" size={32} />
                  <div>
                    <h2 className="text-2xl font-bold">Bitcoin (BTC)</h2>
                    <p className="text-gray-300">Prix actuel</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{formatUSD(btcPrice.usd)}</p>
                  <div className={`flex items-center justify-end gap-1 font-semibold ${btcPrice.usd_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {btcPrice.usd_24h_change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{btcPrice.usd_24h_change.toFixed(2)}% (24h)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {ethPrice && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Ξ</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Ethereum (ETH)</h2>
                    <p className="text-gray-300">Prix actuel</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{formatUSD(ethPrice.usd)}</p>
                  <div className={`flex items-center justify-end gap-1 font-semibold ${ethPrice.usd_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {ethPrice.usd_24h_change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{ethPrice.usd_24h_change.toFixed(2)}% (24h)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Adresses */}
        <section className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-blue-400" size={24} />
              <h3 className="text-xl font-semibold">Adresse Bitcoin</h3>
            </div>
            <p className="font-mono text-sm break-all text-gray-300">{BTC_ADDRESS}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-blue-400" size={24} />
              <h3 className="text-xl font-semibold">Adresse Ethereum</h3>
            </div>
            <p className="font-mono text-sm break-all text-gray-300">{ETH_ADDRESS}</p>
          </div>
        </section>

        {/* Soldes */}
        <section className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-green-400" size={24} />
              <h3 className="text-xl font-semibold">Solde Bitcoin</h3>
            </div>
            <p className="text-2xl font-bold mb-1">{formatBTC(finalBalance)} BTC</p>
            <p className="text-gray-300">{formatUSD(calculateUSDValue(finalBalance / 100000000, btcPrice?.usd || 0))}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-green-400" size={24} />
              <h3 className="text-xl font-semibold">Solde Ethereum</h3>
            </div>
            <p className="text-2xl font-bold mb-1">{formatETH(ethBalance * Math.pow(10, 18))} ETH</p>
            <p className="text-gray-300">{formatUSD(calculateUSDValue(ethBalance, ethPrice?.usd || 0))}</p>
          </div>
        </section>
        
        {/* Statistiques */}
        {btcData && ethData && (
          <section className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Transactions BTC</h3>
              <p className="text-4xl font-bold text-blue-400">{txCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Transactions ETH</h3>
              <p className="text-4xl font-bold text-purple-400">{ethTxCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Total Reçu BTC</h3>
              <p className="text-2xl font-bold text-green-400">{formatBTC(totalReceived)} BTC</p>
              <p className="text-sm text-gray-400">{formatUSD(calculateUSDValue(totalReceived / 100000000, btcPrice?.usd || 0))}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Total Envoyé BTC</h3>
              <p className="text-2xl font-bold text-red-400">{formatBTC(totalSent)} BTC</p>
              <p className="text-sm text-gray-400">{formatUSD(calculateUSDValue(totalSent / 100000000, btcPrice?.usd || 0))}</p>
            </div>
          </section>
        )}

        <footer className="text-center mt-8 text-gray-400 text-sm">
          <p>Données via Blockstream, Etherscan & CoinGecko. Rafraîchissement toutes les minutes.</p>
        </footer>
      </div>
    </div>
  );
}
