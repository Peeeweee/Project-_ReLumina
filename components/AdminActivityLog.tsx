import React from 'react';
// FIX: Corrected import path for types
import { AdminActivity } from '../types';
// FIX: Added CheckCircleIcon and XCircleIcon to display action types
import { CheckCircleIcon, XCircleIcon } from './icons';

interface AdminActivityLogProps {
  logs: AdminActivity[];
  onSelectLog: (log: AdminActivity) => void;
}

const getLogVisuals = (action: string) => {
  const lowercasedAction = action.toLowerCase();
  if (lowercasedAction.includes('approved') || lowercasedAction.includes('co-signed')) {
    return {
      Icon: CheckCircleIcon,
      color: 'text-brand-green-dark',
    };
  }
  if (lowercasedAction.includes('rejected')) {
    return {
      Icon: XCircleIcon,
      color: 'text-red-600',
    };
  }
  // Default for older or neutral logs
  return { Icon: null, color: 'text-gray-800' };
};


export const AdminActivityLog: React.FC<AdminActivityLogProps> = ({ logs, onSelectLog }) => {
  return (
    <aside className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-brand-gray-dark mb-4">Activity Log</h3>
      <ul className="space-y-1">
        {logs.map((log) => {
          const { Icon, color } = getLogVisuals(log.action);
          return (
            <li key={log.id}>
              <button
                onClick={() => onSelectLog(log)}
                className="w-full text-left p-2 rounded-md transition-all duration-200 hover:bg-gray-50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-blue flex items-start space-x-3"
              >
                {Icon && <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color}`} />}
                <div className="flex-grow">
                  <p className={`text-sm ${color}`}>{log.action}</p>
                  <p className="text-xs text-gray-500">
                    {log.timestamp} by <span className="font-medium">{log.adminId}</span>
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};