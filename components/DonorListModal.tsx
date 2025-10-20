import React, { useState, useMemo } from 'react';
import { AggregatedDonor } from '../types';
import { XMarkIcon, MagnifyingGlassIcon, UserCircleIcon } from './icons';

interface DonorListModalProps {
  isOpen: boolean;
  onClose: () => void;
  donors: AggregatedDonor[];
  title?: string;
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const DonorListModal: React.FC<DonorListModalProps> = ({ isOpen, onClose, donors, title }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDonors = useMemo(() => {
    if (!searchQuery) return donors;
    return donors.filter(donor => 
        donor.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [donors, searchQuery]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes item-fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-item-fade-in-up {
          animation: item-fade-in-up 0.5s ease-out forwards;
        }
        @keyframes fade-in-scale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
            animation: fade-in-scale 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      `}</style>
      <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" 
          onClick={onClose}
      >
        <div 
          className="bg-gray-50 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 opacity-0 animate-fade-in-scale max-h-[80vh] flex flex-col" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b bg-white flex justify-between items-center flex-shrink-0 sticky top-0 z-10 rounded-t-lg">
              <div>
                  <h2 className="text-xl font-bold text-gray-800">{title || 'Platform Donors'}</h2>
                  <p className="text-sm text-gray-500">{donors.length} unique contributors</p>
              </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="p-4 border-b bg-white flex-shrink-0 sticky top-[77px] z-10">
               <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                      type="text"
                      placeholder="Search by wallet address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-brand-blue focus:border-brand-blue"
                  />
               </div>
          </div>

          {/* Donor List */}
          <div className="overflow-y-auto p-4">
             {filteredDonors.length > 0 ? (
                   <div className="space-y-3">
                      {filteredDonors.map((donor, index) => (
                          <div 
                            key={donor.address} 
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-item-fade-in-up opacity-0"
                            style={{ animationDelay: `${index * 50}ms` }}
                           >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4 min-w-0">
                                    <UserCircleIcon className="w-10 h-10 text-gray-300 flex-shrink-0"/>
                                    <div className="min-w-0">
                                        <p 
                                            className="font-mono text-sm text-gray-800 font-semibold truncate"
                                            title={donor.address}
                                        >
                                            {donor.address === 'Anonymous' ? <span className="italic text-gray-500">Anonymous</span> : donor.address}
                                        </p>
                                        <p className="text-xs text-gray-500">{donor.donationCount} donation(s)</p>
                                   </div>
                                </div>
                                 <div className="text-right flex-shrink-0 ml-4">
                                     <p className="font-bold text-lg text-brand-blue">{formatter.format(donor.totalDonated)}</p>
                                     <p className="text-xs text-gray-500">Total Donated</p>
                                 </div>
                            </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-16 text-gray-500">
                      <h3 className="font-semibold">No Donors Found</h3>
                      <p className="text-sm mt-1">{searchQuery ? "Try adjusting your search query." : "There are no donors to display."}</p>
                  </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};