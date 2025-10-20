import React from 'react';
import { CampaignDetail } from '../types';
import { ProgressBar } from './ProgressBar';
import { LocationPinIcon } from './icons';

interface CampaignPreviewPopoverProps {
  campaign: CampaignDetail;
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const CampaignPreviewPopover: React.FC<CampaignPreviewPopoverProps> = ({ campaign }) => {
    const progress = (campaign.raised / campaign.goal) * 100;
    return (
        <div className="w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-32 object-cover" />
            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 truncate">{campaign.title}</h3>
                <p className="text-sm text-gray-500">by {campaign.organizer}</p>
                <div className="flex items-center text-xs text-gray-400 mt-2">
                    <LocationPinIcon className="w-4 h-4 mr-1" />
                    <span>{campaign.location}</span>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between items-baseline text-sm mb-1">
                        <span className="font-semibold text-brand-blue">{formatter.format(campaign.raised)}</span>
                        <span className="text-gray-500">Goal: {formatter.format(campaign.goal)}</span>
                    </div>
                    <ProgressBar value={progress} />
                </div>
            </div>
        </div>
    );
};
