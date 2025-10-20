
import React from 'react';
// FIX: Corrected import path for types
import { TopDonor } from '../types';
// FIX: Corrected import path for icons
import { TrophyIcon, UsersIcon } from './icons';

interface DonorListProps {
  topDonors: TopDonor[];
  totalDonors: number;
}

export const DonorList: React.FC<DonorListProps> = ({ topDonors, totalDonors }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-brand-gray-dark mb-4">Donor Participation</h2>
      <div className="flex items-center space-x-2 text-brand-gray mb-4 pb-4 border-b">
        <UsersIcon className="w-6 h-6"/>
        <span className="font-semibold">{totalDonors.toLocaleString()}</span>
        <span>total contributors</span>
      </div>
      <h3 className="font-semibold text-brand-gray-dark mb-2">Top Donors</h3>
      <ul className="space-y-3">
        {topDonors.map((donor, index) => (
          <li key={donor.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <TrophyIcon className={`w-6 h-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-yellow-600'}`} />
                <span className="font-mono text-sm text-brand-gray-dark">{donor.name}</span>
            </div>
            <span className="font-bold text-brand-blue">₱{donor.amount.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};