import React, { useState } from 'react';
import { AggregatedDonation } from '../types';
import { ClockIcon, CubeTransparentIcon, UserCircleIcon, XMarkIcon } from './icons';

interface PlatformDonationFeedProps {
  donations: AggregatedDonation[];
}

const DonationDetailModal: React.FC<{ donation: AggregatedDonation | null, onClose: () => void }> = ({ donation, onClose }) => {
    if (!donation) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Donation Detail</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-800 text-lg">
                        A donation of <span className="font-bold text-brand-blue">₱{donation.transaction.amount?.toLocaleString()}</span> was made to "{donation.campaignTitle}".
                    </p>
                    
                    <div className="pt-4 border-t">
                         <h3 className="text-sm font-semibold text-gray-500 mb-2">Transaction Details</h3>
                         <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <CubeTransparentIcon className="w-4 h-4 text-gray-400"/>
                                <span className="font-mono text-gray-700 truncate" title={donation.transaction.hash}>{donation.transaction.hash}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserCircleIcon className="w-4 h-4 text-gray-400"/>
                                <span className={`font-mono ${donation.transaction.donorAddress === 'Anonymous' ? 'italic text-gray-500' : 'text-gray-700'}`}>
                                    {donation.transaction.donorAddress}
                                </span>
                            </div>
                         </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500">Timestamp</p>
                        <div className="flex items-center space-x-1 text-gray-800 font-semibold">
                            <ClockIcon className="w-4 h-4 text-gray-500" />
                            <span>{donation.transaction.timestamp}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PlatformDonationFeed: React.FC<PlatformDonationFeedProps> = ({ donations }) => {
  const [selectedDonation, setSelectedDonation] = useState<AggregatedDonation | null>(null);
  
  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-brand-gray-dark mb-4">Recent Platform Donations</h3>
        <ul className="space-y-1 max-h-[40vh] overflow-y-auto">
          {donations.map((donation, index) => (
            <li key={`${donation.transaction.hash}-${index}`}>
              <button
                onClick={() => setSelectedDonation(donation)}
                className="w-full text-left p-3 rounded-md transition-all duration-200 hover:bg-gray-50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <p className="text-sm text-gray-800">
                  <span className="font-bold text-brand-blue">₱{donation.transaction.amount?.toLocaleString()}</span> donated to <span className="font-semibold">"{donation.campaignTitle}"</span>
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{donation.transaction.timestamp}</span>
                </div>
              </button>
            </li>
          ))}
           {donations.length === 0 && (
            <p className="text-sm text-center text-gray-500 py-4">No donations on the platform yet.</p>
        )}
        </ul>
      </div>
      <DonationDetailModal donation={selectedDonation} onClose={() => setSelectedDonation(null)} />
    </>
  );
};
