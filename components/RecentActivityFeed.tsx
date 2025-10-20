
import React from 'react';
// FIX: Corrected import path for types
import { AnalyticsRecentActivity } from '../types';
// FIX: Corrected import path for icons
import { ArrowTopRightOnSquareIcon, CubeTransparentIcon } from './icons';

interface RecentActivityFeedProps {
  activity: AnalyticsRecentActivity[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activity }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-brand-gray-dark mb-4">Recent Transactions</h3>
      <ul className="space-y-4">
        {activity.map((item) => (
          <li key={item.id} className="pb-4 border-b border-gray-100 last:border-b-0">
            <p className="text-sm font-semibold text-brand-gray-dark">{item.description}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-brand-gray">{item.timestamp}</p>
              <a 
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center space-x-1 text-xs text-brand-blue hover:underline font-mono"
                title="View on block explorer"
              >
                <CubeTransparentIcon className="w-3 h-3" />
                <span>{item.txHash.slice(0, 6)}...</span>
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};