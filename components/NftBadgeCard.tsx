
import React from 'react';
// FIX: Corrected import path for types
import { NftBadge } from '../types';
// FIX: Corrected import path for icons
import { SparklesIcon } from './icons';

interface NftBadgeCardProps {
  badge: NftBadge;
  onSelect: () => void;
}

export const NftBadgeCard: React.FC<NftBadgeCardProps> = ({ badge, onSelect }) => {
  return (
    <article
      onClick={onSelect}
      className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      aria-labelledby={`badge-title-${badge.id}`}
    >
      <div className="relative">
        <img
          src={badge.imageUrl}
          alt={`NFT badge for ${badge.campaignTitle}`}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white rounded-full p-1.5">
            <SparklesIcon className="w-4 h-4"/>
        </div>
      </div>
      <div className="p-4">
        <h3 id={`badge-title-${badge.id}`} className="font-bold text-brand-gray-dark truncate">{badge.campaignTitle}</h3>
        <p className="text-sm text-brand-gray">Minted: {badge.mintDate}</p>
      </div>
    </article>
  );
};