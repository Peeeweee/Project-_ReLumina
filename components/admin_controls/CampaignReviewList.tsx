
import React from 'react';
import { PendingCampaign } from '../../types';

interface CampaignReviewListProps {
  campaigns: PendingCampaign[];
}

export const CampaignReviewList: React.FC<CampaignReviewListProps> = ({ campaigns }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">New Campaign Review</h3>
      <ul className="space-y-3">
        {campaigns.map((campaign) => (
          <li key={campaign.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02]">
            <div>
              <p className="font-semibold text-gray-800">{campaign.title}</p>
              <p className="text-xs text-gray-500">{campaign.organizer} • Goal: ₱{campaign.goal.toLocaleString()}</p>
            </div>
            <div className="space-x-3">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-900">Details</button>
                <button className="text-sm font-medium text-green-600 hover:text-green-900">Approve</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
