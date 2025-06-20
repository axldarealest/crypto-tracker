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
    color: 'from-[var(--accent)] to-[#FF6B35]',
    addressFormat: 'bc1... ou 1... ou 3...'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: <Coins className="w-8 h-8" />,
    color: 'from-[#4ECDC4] to-[#45B7D1]',
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
    <div className="fixed inset-0 bg-[var(--foreground)]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--background)] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-dashed border-[var(--foreground)]/20 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dashed border-[var(--foreground)]/20">
          <div className="flex items-center gap-3">
            {step !== 'method' && (
              <button
                onClick={handleBack}
                className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors p-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Ajouter des cryptomonnaies</h2>
              <p className="text-[var(--foreground)]/60 mt-1">
                {step === 'method' && 'Choisissez votre méthode d\'ajout'}
                {step === 'crypto-select' && 'Sélectionnez la cryptomonnaie'}
                {step === 'address-input' && `Entrez votre adresse ${selectedCrypto?.name}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors p-2"
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
                className="group relative p-6 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 text-left border border-dashed border-[var(--foreground)]/20 hover:border-[var(--accent)]/40"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#4ECDC4] to-[#45B7D1] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Synchronisation automatique</h3>
                <p className="text-[var(--foreground)]/60 text-sm">Connexion sécurisée et mise à jour automatique de vos soldes</p>
                <div className="mt-3 text-xs text-[var(--accent)] font-semibold">🔒 100% SÉCURISÉ</div>
              </button>

              {/* Manual Entry */}
              <button
                onClick={() => handleMethodSelect('manual')}
                className="group relative p-6 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 text-left border border-dashed border-[var(--foreground)]/20 hover:border-[var(--accent)]/40"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[#FF6B35] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-lg">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Ajout manuel</h3>
                <p className="text-[var(--foreground)]/60 text-sm">Ajoutez l'ensemble de vos comptes courants et livrets</p>
              </button>
            </div>
          )}

          {step === 'crypto-select' && (
            <div className="space-y-4">
              {supportedCryptos.map((crypto) => (
                <button
                  key={crypto.symbol}
                  onClick={() => handleCryptoSelect(crypto)}
                  className="w-full group relative p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 text-left border border-dashed border-[var(--foreground)]/20 hover:border-[var(--accent)]/40 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${crypto.color} flex items-center justify-center shadow-lg`}>
                    <div className="text-white">
                      {crypto.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">{crypto.name}</h3>
                    <p className="text-[var(--foreground)]/60 text-sm">Format: {crypto.addressFormat}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'address-input' && selectedCrypto && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-dashed border-[var(--foreground)]/20">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedCrypto.color} flex items-center justify-center shadow-lg`}>
                  <div className="text-white">
                    {selectedCrypto.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{selectedCrypto.name}</h3>
                  <p className="text-[var(--foreground)]/60 text-sm">Format: {selectedCrypto.addressFormat}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)]/80 mb-2">
                  Adresse {selectedCrypto.name}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={`Entrez votre adresse ${selectedCrypto.name}`}
                  className="w-full px-4 py-3 bg-white/10 border border-dashed border-[var(--foreground)]/20 rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
                />
                <p className="text-xs text-[var(--foreground)]/60 mt-2">
                  Votre adresse sera utilisée pour synchroniser automatiquement votre solde
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-[var(--foreground)] rounded-2xl transition-all duration-300 border border-dashed border-[var(--foreground)]/20 font-semibold"
                >
                  Retour
                </button>
                <button
                  onClick={handleAddressSubmit}
                  disabled={!address.trim() || loading}
                  className="flex-1 py-3 px-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:bg-[var(--foreground)]/20 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg"
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