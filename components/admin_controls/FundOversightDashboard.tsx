import React from 'react';
import { EscrowDetails } from '../../types';
import { ProgressBar } from '../ProgressBar';

interface FundOversightDashboardProps {
  escrows: EscrowDetails[];
}

export const FundOversightDashboard: React.FC<FundOversightDashboardProps> = ({ escrows }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Active Escrows</h3>
      <div className="space-y-4">
        {escrows.map((escrow) => (
          <div key={escrow.campaignId}>
            <div className="flex justify-between items-baseline mb-1">
                <p className="text-sm font-semibold text-gray-700 truncate">{escrow.campaignTitle}</p>
                <p className="text-sm font-bold text-blue-600">₱{escrow.amountPHP.toLocaleString()}</p>
            </div>
            <ProgressBar value={escrow.progress} />
          </div>
        ))}
      </div>
    </div>
  );
};
