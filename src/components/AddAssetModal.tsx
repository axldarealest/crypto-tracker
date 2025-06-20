"use client";

import React, { useState } from 'react';
import { X, Plus, Coins, PiggyBank, TrendingUp, CreditCard, Gem } from 'lucide-react';
import { AssetCategory, AddAssetModalProps } from '@/types';

interface CategoryOption {
  category: AssetCategory;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const categoryOptions: CategoryOption[] = [
  {
    category: 'crypto',
    title: 'Crypto',
    description: 'Synchronisation des plus grands exchanges, ajout d\'adresses ou manuel',
    icon: <Coins className="w-12 h-12" />,
    color: 'from-[var(--accent)] to-[#FF6B35]'
  },
  {
    category: 'livrets',
    title: 'Livrets',
    description: 'Livret A, LDD, Livret populaire, livrets boostés, comptes à termes',
    icon: <PiggyBank className="w-12 h-12" />,
    color: 'from-[#4ECDC4] to-[#45B7D1]'
  },
  {
    category: 'actions',
    title: 'Actions & Fonds',
    description: 'Synchronisation sécurisée pour PEA, Assurance Vie et Compte-Titres et bien plus',
    icon: <TrendingUp className="w-12 h-12" />,
    color: 'from-[#45B7D1] to-[#4ECDC4]'
  },
  {
    category: 'comptes-bancaires',
    title: 'Comptes bancaires',
    description: 'Synchronisation sécurisée pour plus de 20 000 banques à travers le monde',
    icon: <CreditCard className="w-12 h-12" />,
    color: 'from-[#96CEB4] to-[#4ECDC4]'
  },
  {
    category: 'metaux-precieux',
    title: 'Métaux précieux',
    description: 'Or, argent, palladium sous toutes ses formes avec plus de 1000 références',
    icon: <Gem className="w-12 h-12" />,
    color: 'from-[#FFEAA7] to-[#FF6B35]'
  }
];

export default function AddAssetModal({ isOpen, onClose, onCategorySelect }: AddAssetModalProps) {

  if (!isOpen) return null;

  const handleCategorySelect = (category: AssetCategory) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      // Fallback behavior
      console.log('Selected category:', category);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[var(--foreground)]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--background)] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-dashed border-[var(--foreground)]/20 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dashed border-[var(--foreground)]/20">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Compléter mon patrimoine</h2>
            <p className="text-[var(--foreground)]/60 mt-1">Choisissez la catégorie d'actifs à ajouter</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryOptions.map((option) => (
              <button
                key={option.category}
                onClick={() => handleCategorySelect(option.category)}
                className="group relative p-6 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 text-left border border-dashed border-[var(--foreground)]/20 hover:border-[var(--accent)]/40"
              >
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${option.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-lg`}>
                  <div className="text-white">
                    {option.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">{option.title}</h3>
                <p className="text-[var(--foreground)]/60 text-sm leading-relaxed">{option.description}</p>
                
                {/* Hover arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-5 h-5 text-[var(--accent)]" />
                </div>
              </button>
            ))}
          </div>

          {/* Popular institutions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Établissements les plus populaires</h3>
            <div className="flex flex-wrap gap-3">
              {[
                'BoursoBank', 'Crédit Agricole', 'Crédit Mutuel', 'Fortuneo',
                'Société Générale', 'Trade Republic', 'Binance', 'Bitcoin'
              ].map((institution) => (
                <div
                  key={institution}
                  className="px-4 py-2 bg-white/10 rounded-full text-sm text-[var(--foreground)]/80 border border-dashed border-[var(--foreground)]/20 font-semibold"
                >
                  {institution}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 