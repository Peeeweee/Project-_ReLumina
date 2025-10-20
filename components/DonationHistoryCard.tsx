
import React from 'react';
// FIX: Corrected import path for types
import { PastDonation } from '../types';
// FIX: Corrected import path for icons
import { ArrowTopRightOnSquareIcon, CheckCircleIcon, ClockIcon, CubeTransparentIcon } from './icons';

interface DonationHistoryCardProps {
  donation: PastDonation;
}

const StatusBadge: React.FC<{ status: 'Verified' | 'Pending Verification' }> = ({ status }) => {
  const isVerified = status === 'Verified';
  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
      isVerified 
        ? 'bg-brand-green-light text-brand-green-dark' 
        : 'bg-yellow-100 text-yellow-800'
    }`}>
      {isVerified ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <ClockIcon className="w-3.5 h-3.5" />}
      <span>{status}</span>
    </div>
  );
};

export const DonationHistoryCard: React.FC<DonationHistoryCardProps> = ({ donation }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-brand-gray-dark">{donation.campaignTitle}</h3>
          <p className="text-sm text-brand-gray">{donation.date}</p>
        </div>
        <StatusBadge status={donation.status} />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div>
            <p className="text-lg font-bold text-brand-blue">₱{donation.amountPHP.toLocaleString()}</p>
            <p className="text-xs text-brand-gray">{donation.amountETH.toFixed(4)} ETH</p>
        </div>
        <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="flex items-center space-x-1 text-xs text-brand-blue hover:underline font-mono"
            title="View on block explorer"
        >
            <CubeTransparentIcon className="w-4 h-4" />
            <span>{`${donation.txHash.slice(0,6)}...${donation.txHash.slice(-4)}`}</span>
            <ArrowTopRightOnSquareIcon className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};