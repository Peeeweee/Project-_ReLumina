
import React from 'react';
// FIX: Corrected import path for types
import { NftBadge } from '../types';
// FIX: Corrected import path for icons
import { ArrowTopRightOnSquareIcon, CubeTransparentIcon, XMarkIcon } from './icons';

interface NftDetailModalProps {
  badge: NftBadge | null;
  onClose: () => void;
}

const DetailRow: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-sm text-brand-gray">{label}</span>
        <span className="text-sm font-semibold text-brand-gray-dark text-right">{children}</span>
    </div>
);

export const NftDetailModal: React.FC<NftDetailModalProps> = ({ badge, onClose }) => {
  if (!badge) return null;
  
  const truncatedAddress = `${badge.contractAddress.slice(0, 8)}...${badge.contractAddress.slice(-6)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
             <img src={badge.imageUrl} alt={badge.campaignTitle} className="w-full h-56 object-cover" />
             <button
                onClick={onClose}
                className="absolute top-3 right-3 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="p-6">
            <h2 className="text-2xl font-bold text-brand-gray-dark">{badge.campaignTitle}</h2>
            <p className="text-md text-brand-gray mb-4">Impact Badge</p>
            
            <div className="space-y-1 font-mono">
                <DetailRow label="Token ID">{`#${badge.tokenId}`}</DetailRow>
                <DetailRow label="Mint Date">{badge.mintDate}</DetailRow>
                <DetailRow label="Donation Amount">{`₱${badge.donationAmountPHP.toLocaleString()}`}</DetailRow>
                <DetailRow label="Contract Address">
                   <a 
                        href="#" 
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center space-x-1 text-brand-blue hover:underline"
                        title={badge.contractAddress}
                    >
                        <CubeTransparentIcon className="w-4 h-4" />
                        <span>{truncatedAddress}</span>
                        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </a>
                </DetailRow>
            </div>
        </div>
      </div>
    </div>
  );
};