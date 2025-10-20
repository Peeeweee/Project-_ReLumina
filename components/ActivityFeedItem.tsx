
import React from 'react';
// FIX: Corrected import paths for types and icons.
import { Transaction } from '../types';
import { ClockIcon, CubeTransparentIcon } from './icons';

interface ActivityFeedItemProps {
  transaction: Transaction;
}

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({ transaction }) => {
  return (
    <div className="flex items-center space-x-2 text-xs text-brand-gray">
      <CubeTransparentIcon className="w-4 h-4 flex-shrink-0" />
      <span className="font-mono truncate" title={transaction.hash}>{transaction.hash}</span>
      <span className="text-gray-400">|</span>
      <ClockIcon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-shrink-0">{transaction.timestamp}</span>
    </div>
  );
};