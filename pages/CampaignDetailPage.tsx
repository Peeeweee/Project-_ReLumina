import React from 'react';
import { CampaignDetail } from '../types';
import { ChevronLeftIcon, VerifiedIcon, LocationPinIcon } from '../components/icons';
import { ProgressBar } from '../components/ProgressBar';
import { MilestoneCard } from '../components/MilestoneCard';
import { ActivitySidebar } from '../components/ActivitySidebar';

interface CampaignDetailPageProps {
  campaign: CampaignDetail;
  onBack: () => void;
  onDonate: (campaign: CampaignDetail) => void;
}

export const CampaignDetailPage: React.FC<CampaignDetailPageProps> = ({ campaign, onBack, onDonate }) => {
  const progress = (campaign.raised / campaign.goal) * 100;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const isDonatable = campaign.status === 'Live';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-gray hover:text-brand-gray-dark mb-4">
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2 space-y-8">
          <article>
            <div className="relative">
              <img src={campaign.imageUrl} alt={`Relief efforts for ${campaign.title}`} className="w-full h-72 object-cover rounded-lg shadow-lg" />
              {campaign.isVerified && (
                <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 bg-white/80 backdrop-blur-sm text-brand-green-dark text-sm font-semibold rounded-full shadow">
                  <VerifiedIcon className="w-4 h-4" />
                  <span>Verified Campaign</span>
                </div>
              )}
            </div>
            
            <header className="mt-6">
                <div className="flex items-center text-sm text-brand-gray mb-2">
                    <LocationPinIcon className="w-4 h-4 mr-1.5" />
                    <span>{campaign.location} by <strong>{campaign.organizer}</strong></span>
                </div>
                <h1 className="text-4xl font-bold text-brand-gray-dark">{campaign.title}</h1>
            </header>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-baseline mb-1 text-sm">
                <span className="font-semibold text-2xl text-brand-gray-dark">
                  {formatter.format(campaign.raised)}
                  <span className="font-normal text-lg text-brand-gray"> raised</span>
                </span>
                <span className="font-normal text-brand-gray">
                  Goal: {formatter.format(campaign.goal)}
                </span>
              </div>
              <ProgressBar value={progress} />
            </div>

            <p className="mt-6 text-base text-brand-gray-dark leading-relaxed">{campaign.description}</p>
          </article>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-gray-dark mb-4">Milestones</h2>
            <div className="space-y-4">
              {campaign.milestones.map((milestone, index) => (
                <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
              ))}
            </div>
          </section>
        </main>
        
        <aside className="lg:col-span-1 space-y-6">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                 <h3 className="text-xl font-bold text-brand-gray-dark mb-4">Support This Campaign</h3>
                <button
                    onClick={() => onDonate(campaign)}
                    disabled={!isDonatable}
                    className="w-full text-center bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isDonatable ? 'Donate Now' : 'Pending Report'}
                </button>
                {!isDonatable && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    This campaign has completed its milestones and is now in the final reporting stage. Donations are no longer being accepted.
                  </p>
                )}
            </div>
            <ActivitySidebar activity={campaign.activity} />
          </div>
        </aside>
      </div>
    </div>
  );
};