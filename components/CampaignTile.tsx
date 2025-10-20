import React from 'react';
// FIX: Corrected import paths for types and icons.
import { Campaign } from '../types';
import { ProgressBar } from './ProgressBar';
import { ActivityFeedItem } from './ActivityFeedItem';
import { VerifiedIcon, LocationPinIcon, CheckCircleIcon } from './icons';

interface CampaignTileProps {
  campaign: Campaign;
  onSelectDetails: (id: string) => void;
  onDonate: (campaign: Campaign) => void;
}

const VerifiedBadge: React.FC = () => (
  <div className="flex items-center space-x-1 px-2 py-0.5 bg-brand-green-light text-brand-green-dark text-xs font-semibold rounded-full">
    <VerifiedIcon className="w-3.5 h-3.5" />
    <span>Verified</span>
  </div>
);

const CompletedBadge: React.FC = () => (
    <div className="flex items-center space-x-1 px-2 py-0.5 bg-gray-200 text-gray-800 text-xs font-semibold rounded-full">
      <CheckCircleIcon className="w-3.5 h-3.5" />
      <span>Completed</span>
    </div>
);


export const CampaignTile: React.FC<CampaignTileProps> = ({ campaign, onSelectDetails, onDonate }) => {
  const progress = (campaign.raised / campaign.goal) * 100;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    // FIX: Corrected `currency('PHP')` to `currency: 'PHP'`
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // FIX: This comparison appears to be unintentional because the types 'CampaignStatus' and '"completed"' have no overlap. Changed to 'Completed'.
  const isCompleted = campaign.status === 'Completed';
  const isDonatable = campaign.status === 'Live';

  const handleCardClick = () => {
    onSelectDetails(campaign.id);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };


  return (
    <article
      className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col cursor-pointer"
      aria-labelledby={`campaign-title-${campaign.id}`}
      onClick={handleCardClick}
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') handleCardClick(); }}
    >
      <div className="relative">
        <img
          src={campaign.imageUrl}
          alt={`Relief efforts for ${campaign.title}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
            {isCompleted ? (
              <CompletedBadge />
            ) : (
              campaign.isVerified && <VerifiedBadge />
            )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <header>
          <div className="flex items-center text-sm text-brand-gray mb-1">
            <LocationPinIcon className="w-4 h-4 mr-1.5" />
            <span>{campaign.location}</span>
          </div>
          <h3 id={`campaign-title-${campaign.id}`} className="text-xl font-bold text-brand-gray-dark mb-1">
            {campaign.title}
          </h3>
          <p className="text-sm text-brand-gray mb-4">{campaign.impact}</p>
        </header>
        
        <div className="space-y-3 mt-auto">
          <div>
            <div className="flex justify-between items-baseline mb-1 text-sm">
              <span className="font-semibold text-brand-gray-dark">
                {formatter.format(campaign.raised)}
                <span className="font-normal text-brand-gray"> raised</span>
              </span>
              <span className="font-normal text-brand-gray">
                Goal: {formatter.format(campaign.goal)}
              </span>
            </div>
            <ProgressBar value={progress} />
          </div>

          <div className="border-t border-brand-gray-light pt-3">
             <ActivityFeedItem transaction={campaign.latestTransaction} />
          </div>
          
          <div className="flex items-center space-x-3 pt-2">
            {isCompleted ? (
                <button
                    className="w-full text-center bg-brand-green text-white font-bold py-2 px-4 rounded-md hover:bg-brand-green-dark transition-colors duration-300"
                    onClick={(e) => handleButtonClick(e, () => onSelectDetails(campaign.id))}
                >
                    View Summary
                </button>
            ) : (
                <>
                    <button
                        className="w-full text-center bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={(e) => handleButtonClick(e, () => onDonate(campaign))}
                        disabled={!isDonatable}
                    >
                        {isDonatable ? 'Donate Now' : 'Pending Report'}
                    </button>
                    <button
                        className="w-full text-center bg-white text-brand-gray-dark border border-gray-300 font-bold py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300"
                        onClick={(e) => handleButtonClick(e, () => onSelectDetails(campaign.id))}
                    >
                        Details
                    </button>
                </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};