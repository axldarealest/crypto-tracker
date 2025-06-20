"use client";

import React, { useState } from 'react';
import { X, ArrowLeft, Bitcoin, Coins, Shield, Plus } from 'lucide-react';
import { CryptoAsset } from '@/types';

interface AddCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetAdded: (asset: CryptoAsset) => void;
}

interface CryptoOption {
  symbol: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  addressFormat: string;
}

const supportedCryptos: CryptoOption[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: <Bitcoin className="w-8 h-8" />,
    color: 'from-orange-400 to-yellow-500',
    addressFormat: 'bc1... ou 1... ou 3...'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: <Coins className="w-8 h-8" />,
    color: 'from-blue-400 to-purple-500',
    addressFormat: '0x...'
  }
];

type AddMethod = 'sync' | 'manual';

export default function AddCryptoModal({ isOpen, onClose, onAssetAdded }: AddCryptoModalProps) {
  const [step, setStep] = useState<'method' | 'crypto-select' | 'address-input'>('method');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleMethodSelect = (method: AddMethod) => {
    if (method === 'sync') {
      // For now, just show a message that sync is not implemented
      alert('La synchronisation automatique sera bientôt disponible !');
      return;
    }
    setStep('crypto-select');
  };

  const handleCryptoSelect = (crypto: CryptoOption) => {
    setSelectedCrypto(crypto);
    setStep('address-input');
  };

  const handleAddressSubmit = async () => {
    if (!selectedCrypto || !address.trim()) return;

    setLoading(true);
    try {
      // Basic address validation
      if (selectedCrypto.symbol === 'BTC' && !address.match(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/)) {
        throw new Error('Adresse Bitcoin invalide');
      }
      if (selectedCrypto.symbol === 'ETH' && !address.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error('Adresse Ethereum invalide');
      }

      let newAsset: CryptoAsset;

      if (selectedCrypto.symbol === 'ETH') {
        // Fetch real balance for Ethereum addresses automatically
        try {
          const balanceResponse = await fetch(`/api/ethereum/balance?address=${address}`);
          if (balanceResponse.ok) {
            const balanceData = await balanceResponse.json();
            
            newAsset = {
              id: `${selectedCrypto.symbol}-${address}`,
              category: 'crypto',
              name: selectedCrypto.symbol,
              symbol: selectedCrypto.symbol,
              address: address,
              amount: balanceData.balance,
              currentPrice: balanceData.currentPrice,
              value: balanceData.valueInEur,
              lastUpdated: new Date(),
              addedManually: false, // Automatically synced
              performance: {
                change24h: balanceData.change24h,
                changePercent24h: balanceData.change24h
              }
            };
          } else {
            throw new Error('Failed to fetch ETH balance');
          }
        } catch (balanceError) {
          console.warn('Could not fetch ETH balance, creating manual asset:', balanceError);
          // Fallback to manual entry
          newAsset = {
            id: `${selectedCrypto.symbol}-${address}`,
            category: 'crypto',
            name: selectedCrypto.symbol,
            symbol: selectedCrypto.symbol,
            address: address,
            amount: 0,
            currentPrice: 3200,
            value: 0,
            lastUpdated: new Date(),
            addedManually: true,
            performance: {
              change24h: 0,
              changePercent24h: 0
            }
          };
        }
      } else if (selectedCrypto.symbol === 'BTC') {
        // Fetch real balance for Bitcoin addresses automatically
        try {
          const balanceResponse = await fetch(`/api/bitcoin/balance?address=${address}`);
          if (balanceResponse.ok) {
            const balanceData = await balanceResponse.json();
            
            newAsset = {
              id: `${selectedCrypto.symbol}-${address}`,
              category: 'crypto',
              name: selectedCrypto.symbol,
              symbol: selectedCrypto.symbol,
              address: address,
              amount: balanceData.balance,
              currentPrice: balanceData.currentPrice,
              value: balanceData.valueInEur,
              lastUpdated: new Date(),
              addedManually: false, // Automatically synced
              performance: {
                change24h: balanceData.change24h,
                changePercent24h: balanceData.change24h
              }
            };
          } else {
            throw new Error('Failed to fetch BTC balance');
          }
        } catch (balanceError) {
          console.warn('Could not fetch BTC balance, creating manual asset:', balanceError);
          // Fallback to manual entry
          newAsset = {
            id: `${selectedCrypto.symbol}-${address}`,
            category: 'crypto',
            name: selectedCrypto.symbol,
            symbol: selectedCrypto.symbol,
            address: address,
            amount: 0,
            currentPrice: 65000,
            value: 0,
            lastUpdated: new Date(),
            addedManually: true,
            performance: {
              change24h: 0,
              changePercent24h: 0
            }
          };
        }
      } else {
        // For other cryptos, create manual asset
        newAsset = {
          id: `${selectedCrypto.symbol}-${address}`,
          category: 'crypto',
          name: selectedCrypto.symbol,
          symbol: selectedCrypto.symbol,
          address: address,
          amount: 0,
          currentPrice: 3200,
          value: 0,
          lastUpdated: new Date(),
          addedManually: true,
          performance: {
            change24h: 0,
            changePercent24h: 0
          }
        };
      }

      onAssetAdded(newAsset);
      onClose();
      
      // Reset form
      setStep('method');
      setSelectedCrypto(null);
      setAddress('');
      
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'adresse');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'crypto-select') {
      setStep('method');
    } else if (step === 'address-input') {
      setStep('crypto-select');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {step !== 'method' && (
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">Ajouter des cryptomonnaies</h2>
              <p className="text-gray-400 mt-1">
                {step === 'method' && 'Choisissez votre méthode d\'ajout'}
                {step === 'crypto-select' && 'Sélectionnez la cryptomonnaie'}
                {step === 'address-input' && `Entrez votre adresse ${selectedCrypto?.name}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'method' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Automatic Sync */}
              <button
                onClick={() => handleMethodSelect('sync')}
                className="group relative p-6 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-200 text-left border border-gray-700 hover:border-gray-600"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Synchronisation automatique</h3>
                <p className="text-gray-400 text-sm">Connexion sécurisée et mise à jour automatique de vos soldes</p>
                <div className="mt-3 text-xs text-green-400">🔒 100% SÉCURISÉ</div>
              </button>

              {/* Manual Entry */}
              <button
                onClick={() => handleMethodSelect('manual')}
                className="group relative p-6 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-200 text-left border border-gray-700 hover:border-gray-600"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ajout manuel</h3>
                <p className="text-gray-400 text-sm">Ajoutez l'ensemble de vos comptes courants et livrets</p>
              </button>
            </div>
          )}

          {step === 'crypto-select' && (
            <div className="space-y-4">
              {supportedCryptos.map((crypto) => (
                <button
                  key={crypto.symbol}
                  onClick={() => handleCryptoSelect(crypto)}
                  className="w-full group relative p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-200 text-left border border-gray-700 hover:border-gray-600 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${crypto.color} flex items-center justify-center`}>
                    <div className="text-white">
                      {crypto.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{crypto.name}</h3>
                    <p className="text-gray-400 text-sm">Format: {crypto.addressFormat}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'address-input' && selectedCrypto && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedCrypto.color} flex items-center justify-center`}>
                  <div className="text-white">
                    {selectedCrypto.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedCrypto.name}</h3>
                  <p className="text-gray-400 text-sm">Format: {selectedCrypto.addressFormat}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Adresse {selectedCrypto.name}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={`Entrez votre adresse ${selectedCrypto.name}`}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Votre adresse sera utilisée pour synchroniser automatiquement votre solde
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={handleAddressSubmit}
                  disabled={!address.trim() || loading}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Ajout...
                    </>
                  ) : (
                    'Ajouter'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 