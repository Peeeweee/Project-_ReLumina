import React from 'react';
import { NgoActivity } from '../types';
import { ClockIcon } from './icons';

interface NgoActivityFeedProps {
  activities: NgoActivity[];
  onSelectActivity: (activity: NgoActivity) => void;
}

export const NgoActivityFeed: React.FC<NgoActivityFeedProps> = ({ activities, onSelectActivity }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-brand-gray-dark mb-4">Notifications</h3>
      <ul className="space-y-1">
        {activities.map((activity) => (
          <li key={activity.id}>
            <button
              onClick={() => onSelectActivity(activity)}
              className="w-full text-left p-3 rounded-md transition-all duration-200 hover:bg-gray-50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <p className="text-sm text-gray-800">{activity.description}</p>
              <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                <ClockIcon className="w-3 h-3" />
                <span>{activity.timestamp}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
