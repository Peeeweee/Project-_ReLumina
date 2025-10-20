import React from 'react';
import { VolunteerActivity } from '../types';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from './icons';

interface VolunteerActivityFeedProps {
  activities: VolunteerActivity[];
  onSelectActivity: (activity: VolunteerActivity) => void;
}

const getStatusVisuals = (status: VolunteerActivity['status']) => {
  switch (status) {
    case 'approved':
      return { Icon: CheckCircleIcon, color: 'text-brand-green-dark' };
    case 'rejected':
      return { Icon: XCircleIcon, color: 'text-red-600' };
    case 'pending':
      return { Icon: ClockIcon, color: 'text-yellow-600' };
    default:
      return { Icon: null, color: 'text-gray-800' };
  }
};

export const VolunteerActivityFeed: React.FC<VolunteerActivityFeedProps> = ({ activities, onSelectActivity }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-bold text-brand-gray-dark mb-4">My Activity Feed</h3>
      <ul className="space-y-1 max-h-[40vh] overflow-y-auto">
        {activities.map((activity) => {
          const { Icon, color } = getStatusVisuals(activity.status);
          return (
            <li key={activity.id}>
              <button
                onClick={() => onSelectActivity(activity)}
                className="w-full text-left p-2 rounded-md transition-all duration-200 hover:bg-gray-50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-blue flex items-start space-x-3"
              >
                {Icon && <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color}`} />}
                <div className="flex-grow">
                  <p className={`text-sm text-gray-800`}>{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </button>
            </li>
          );
        })}
        {activities.length === 0 && (
            <p className="text-sm text-center text-gray-500 py-4">No recent activity.</p>
        )}
      </ul>
    </div>
  );
};