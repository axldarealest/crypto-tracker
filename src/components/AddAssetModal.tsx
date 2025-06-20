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
    description: 'Synchronisation des plus grands exchanges, ajout d&apos;adresses ou manuel',
    icon: <Coins className="w-12 h-12" />,
    color: 'from-orange-400 to-yellow-500'
  },
  {
    category: 'livrets',
    title: 'Livrets',
    description: 'Livret A, LDD, Livret populaire, livrets boostés, comptes à termes',
    icon: <PiggyBank className="w-12 h-12" />,
    color: 'from-blue-400 to-cyan-500'
  },
  {
    category: 'actions',
    title: 'Actions & Fonds',
    description: 'Synchronisation sécurisée pour PEA, Assurance Vie et Compte-Titres et bien plus',
    icon: <TrendingUp className="w-12 h-12" />,
    color: 'from-green-400 to-emerald-500'
  },
  {
    category: 'comptes-bancaires',
    title: 'Comptes bancaires',
    description: 'Synchronisation sécurisée pour plus de 20 000 banques à travers le monde',
    icon: <CreditCard className="w-12 h-12" />,
    color: 'from-purple-400 to-pink-500'
  },
  {
    category: 'metaux-precieux',
    title: 'Métaux précieux',
    description: 'Or, argent, palladium sous toutes ses formes avec plus de 1000 références',
    icon: <Gem className="w-12 h-12" />,
    color: 'from-yellow-400 to-amber-500'
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Compléter mon patrimoine</h2>
            <p className="text-gray-400 mt-1">Choisissez la catégorie d'actifs à ajouter</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
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
                className="group relative p-6 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-200 text-left border border-gray-700 hover:border-gray-600"
              >
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <div className="text-white">
                    {option.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2">{option.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{option.description}</p>
                
                {/* Hover arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>

          {/* Popular institutions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Établissements les plus populaires</h3>
            <div className="flex flex-wrap gap-3">
              {[
                'BoursoBank', 'Crédit Agricole', 'Crédit Mutuel', 'Fortuneo',
                'Société Générale', 'Trade Republic', 'Binance', 'Bitcoin'
              ].map((institution) => (
                <div
                  key={institution}
                  className="px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-300 border border-gray-700"
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