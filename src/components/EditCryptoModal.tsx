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
    if (confirm("Êtes-vous sûr de vouloir supprimer cet actif ?")) {
      onAssetDeleted(asset.id);
      onClose();
    }
  };

  const getIcon = () => {
    switch (asset.symbol) {
      case 'BTC':
        return <Bitcoin className="text-[var(--accent)]" size={32} />;
      case 'ETH':
        return <Coins className="text-[#4ECDC4]" size={32} />;
      default:
        return <Coins className="text-[var(--foreground)]/60" size={32} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--foreground)]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--background)] rounded-3xl max-w-md w-full border border-dashed border-[var(--foreground)]/20 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dashed border-[var(--foreground)]/20">
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Modifier {asset.symbol}</h2>
            <p className="text-[var(--foreground)]/60 mt-1">Ajustez votre solde</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Asset Info */}
          <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-dashed border-[var(--foreground)]/20">
            {getIcon()}
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{asset.name}</h3>
              <p className="text-[var(--foreground)]/60 text-sm">Prix actuel: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(asset.currentPrice)}</p>
            </div>
          </div>

          {/* Asset Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-2xl border border-dashed border-[var(--foreground)]/20">
              <span className="text-[var(--foreground)]/60 font-semibold">Quantité possédée:</span>
              <span className="text-[var(--foreground)] font-semibold">
                {asset.symbol === 'BTC' ? asset.amount.toFixed(8) : asset.amount.toFixed(4)} {asset.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-2xl border border-dashed border-[var(--foreground)]/20">
              <span className="text-[var(--foreground)]/60 font-semibold">Valeur totale:</span>
              <span className="text-[var(--foreground)] font-semibold">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(asset.value)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-2xl border border-dashed border-[var(--foreground)]/20">
              <span className="text-[var(--foreground)]/60 font-semibold">Adresse:</span>
              <span className="text-[var(--foreground)] font-mono text-xs">
                {asset.address ? `${asset.address.slice(0, 10)}...${asset.address.slice(-10)}` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-[var(--foreground)] rounded-2xl transition-all duration-300 border border-dashed border-[var(--foreground)]/20 font-semibold"
            >
              Fermer
            </button>
            <button
              onClick={handleDelete}
              className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 