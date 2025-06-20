"use client";

import React, { useState } from 'react';
import { X, Bitcoin, Coins } from 'lucide-react';
import { CryptoAsset } from '@/types';

interface EditCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: CryptoAsset | null;
  onAssetUpdated: (updatedAsset: CryptoAsset) => void;
  onAssetDeleted: (assetId: string) => void;
}

export default function EditCryptoModal({ isOpen, onClose, asset, onAssetUpdated, onAssetDeleted }: EditCryptoModalProps) {
  if (!isOpen || !asset) return null;

  const handleDelete = () => {
    if (confirm("T'es sûr ?")) {
      onAssetDeleted(asset.id);
      onClose();
    }
  };

  const getIcon = () => {
    switch (asset.symbol) {
      case 'BTC':
        return <Bitcoin className="text-orange-400" size={32} />;
      case 'ETH':
        return <Coins className="text-blue-400" size={32} />;
      default:
        return <Coins className="text-gray-400" size={32} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Modifier {asset.symbol}</h2>
            <p className="text-gray-400 mt-1">Ajustez votre solde</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Asset Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
            {getIcon()}
            <div>
              <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
              <p className="text-gray-400 text-sm">Prix actuel: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(asset.currentPrice)}</p>
            </div>
          </div>

          {/* Asset Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-800/20 rounded-lg">
              <span className="text-gray-400">Quantité possédée:</span>
              <span className="text-white font-medium">
                {asset.symbol === 'BTC' ? asset.amount.toFixed(8) : asset.amount.toFixed(4)} {asset.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/20 rounded-lg">
              <span className="text-gray-400">Valeur totale:</span>
              <span className="text-white font-medium">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(asset.value)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/20 rounded-lg">
              <span className="text-gray-400">Adresse:</span>
              <span className="text-white font-mono text-xs">
                {asset.address ? `${asset.address.slice(0, 10)}...${asset.address.slice(-10)}` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={handleDelete}
              className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 