import React from 'react';
// FIX: Corrected import path for types
import { FeedEvent } from '../types';
// FIX: Corrected import path for icons
import {
  CurrencyDollarIcon,
  DocumentCheckIcon,
  LockOpenIcon,
  CubeTransparentIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  SparklesIcon,
} from './icons';

interface FeedEventCardProps {
  event: FeedEvent;
  viewMode: 'compact' | 'detailed';
}

const eventConfig = {
  DONATION: {
    icon: CurrencyDollarIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  VERIFICATION: {
    icon: DocumentCheckIcon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  RELEASE: {
    icon: LockOpenIcon,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  CAMPAIGN_APPROVAL: {
    icon: SparklesIcon,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
};

const renderContent = (event: FeedEvent) => {
  switch (event.type) {
    case 'DONATION':
      return (
        <span>
          <span className="font-bold text-green-600">₱{event.amount?.toLocaleString()}</span> donated by{' '}
          <span className="font-mono text-sm">{event.donor}</span> to{' '}
          <span className="font-semibold text-brand-gray-dark">{event.campaignName}</span>
        </span>
      );
    case 'VERIFICATION':
      return (
        <span>
          <span className="font-semibold text-brand-gray-dark">{event.milestoneTitle}</span> verified by{' '}
          <span className="font-semibold text-blue-600">{event.verifier}</span> for campaign{' '}
          <span className="font-semibold text-brand-gray-dark">{event.campaignName}</span>
        </span>
      );
    case 'RELEASE':
      return (
        <span>
          <span className="font-bold text-purple-600">₱{event.amount?.toLocaleString()}</span> released to{' '}
          <span className="font-semibold">{event.recipient}</span> for campaign{' '}
          <span className="font-semibold text-brand-gray-dark">{event.campaignName}</span> ✅
        </span>
      );
    case 'CAMPAIGN_APPROVAL':
      return (
        <span>
          Campaign <span className="font-semibold text-brand-gray-dark">{event.campaignName}</span> is now live! ✨ Organized by{' '}
          <span className="font-semibold">{event.recipient}</span>.
        </span>
      );
    default:
      return null;
  }
};

export const FeedEventCard: React.FC<FeedEventCardProps> = ({ event, viewMode }) => {
  const config = eventConfig[event.type];
  const Icon = config.icon;

  if (viewMode === 'compact') {
    return (
      <div className="flex items-start space-x-3 py-3 px-2 border-b border-gray-100">
        <div className={`flex-shrink-0 mt-1 ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-sm text-brand-gray">
          {renderContent(event)}
          <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
            <ClockIcon className="w-3 h-3" />
            <span>{event.timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${
        event.type === 'DONATION' ? 'border-green-500' 
        : event.type === 'VERIFICATION' ? 'border-blue-500' 
        : event.type === 'RELEASE' ? 'border-purple-500' 
        : 'border-pink-500'
    } overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 p-2 rounded-full ${config.bgColor} ${config.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-grow">
            <div className="text-md text-brand-gray-dark">
              {renderContent(event)}
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                <div className="flex items-center space-x-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>{event.timestamp}</span>
                </div>
                <a 
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center space-x-1 text-brand-blue hover:underline font-mono"
                    title="View on block explorer"
                >
                    <CubeTransparentIcon className="w-3.5 h-3.5" />
                    <span>{event.txHash.slice(0, 10)}...</span>
                    <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </a>
            </div>
          </div>
        </div>
        {event.type === 'VERIFICATION' && event.mediaUrl && (
          <div className="mt-4 pl-14">
            <img src={event.mediaUrl} alt="Verification evidence" className="rounded-md max-h-48 w-auto border" />
          </div>
        )}
      </div>
    </div>
  );
};