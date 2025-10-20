import React from 'react';
import { Campaign } from '../types';
import { CampaignTile } from '../components/CampaignTile';

interface DashboardPageProps {
  campaigns: Campaign[];
  onSelectDetails: (id: string) => void;
  onDonate: (campaign: Campaign) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ campaigns, onSelectDetails, onDonate }) => {
  return (
    <div className="bg-brand-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-brand-gray-dark tracking-tight">Live Campaigns</h1>
          <p className="text-lg text-brand-gray mt-2 max-w-2xl mx-auto">
            Support verified, transparent campaigns with real-time on-chain tracking.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.filter(c => c.status === 'Live' || c.status === 'Pending Final Report').map(campaign => (
            <CampaignTile 
              key={campaign.id} 
              campaign={campaign}
              onSelectDetails={onSelectDetails}
              onDonate={onDonate}
            />
          ))}
        </div>
         <div className="mt-20">
          <header className="mb-10 text-center">
              <h2 className="text-4xl font-bold text-brand-gray-dark">Completed Campaigns</h2>
              <p className="text-lg text-brand-gray mt-2 max-w-2xl mx-auto">
                  See the verified impact of successfully funded projects.
              </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.filter(c => c.status === 'Completed').map(campaign => (
              <CampaignTile 
                  key={campaign.id} 
                  campaign={campaign}
                  onSelectDetails={onSelectDetails}
                  onDonate={onDonate}
              />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};