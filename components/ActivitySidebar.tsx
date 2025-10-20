
import React from 'react';
// FIX: Corrected import paths for types and icons.
import { Transaction } from '../types';
import { CubeTransparentIcon, ClockIcon } from './icons';

interface ActivitySidebarProps {
    activity: Transaction[];
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const ActivitySidebar: React.FC<ActivitySidebarProps> = ({ activity }) => {
  return (
    <aside className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-brand-gray-dark mb-4">On-chain Activity</h3>
      <ul className="space-y-4">
        {activity.map((item, index) => (
          <li key={index} className="pb-4 border-b border-brand-gray-light last:border-b-0">
            <p className="font-semibold text-brand-gray-dark text-sm">{item.description}</p>
            <div className="flex items-center space-x-2 text-xs text-brand-gray mt-1 font-mono">
                <CubeTransparentIcon className="w-3.5 h-3.5" />
                <span className="truncate" title={item.hash}>{item.hash}</span>
            </div>
             <div className="flex items-center space-x-2 text-xs text-brand-gray mt-1">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>{item.timestamp}</span>
            </div>
            {item.amount && item.amount > 0 ? (
                <div className="mt-1 text-right">
                    <span className="text-sm font-bold text-brand-gray-dark">
                        {item.description?.includes('released') ? '-' : '+'}
                        {currencyFormatter.format(item.amount)}
                    </span>
                </div>
            ) : null}
          </li>
        ))}
      </ul>
    </aside>
  );
};