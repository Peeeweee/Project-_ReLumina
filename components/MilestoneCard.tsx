import React from 'react';
// FIX: Corrected import paths for types and icons.
import type { Milestone, MilestoneStatus } from '../types';
import { CheckCircleIcon, CubeTransparentIcon, LockClosedIcon, MagnifyingGlassIcon, XCircleIcon, ClockIcon } from './icons';

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
  onClick?: (milestone: Milestone) => void;
}

const statusConfig: { [key in MilestoneStatus]: { icon: React.ReactNode; bgColor: string; textColor: string; borderColor: string } } = {
  'Locked': {
    icon: <LockClosedIcon className="w-5 h-5 mr-2" />,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
  },
  'Pending Volunteer Verification': {
    icon: <ClockIcon className="w-5 h-5 mr-2" />,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
  },
  'In Verification': {
    icon: <MagnifyingGlassIcon className="w-5 h-5 mr-2" />,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  'Verified & Released': {
    icon: <CheckCircleIcon className="w-5 h-5 mr-2" />,
    bgColor: 'bg-brand-green-light',
    textColor: 'text-brand-green-dark',
    borderColor: 'border-brand-green',
  },
  'Rejected': {
    icon: <XCircleIcon className="w-5 h-5 mr-2" />,
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
  },
};

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, index, onClick }) => {
  const config = statusConfig[milestone.status];
  const isClickable = milestone.status === 'Verified & Released' && !!onClick;

  return (
    <button
      onClick={() => isClickable && onClick(milestone)}
      disabled={!isClickable}
      className={`w-full text-left border-l-4 ${config.borderColor} ${config.bgColor} rounded-r-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between transition-all duration-200 ${isClickable ? 'cursor-pointer hover:shadow-md hover:scale-[1.01] hover:border-l-brand-blue' : 'cursor-default'}`}
    >
      <div>
        <div className="flex items-center">
            <span className={`font-bold ${config.textColor}`}>{config.icon}</span>
            <span className={`text-sm font-bold uppercase tracking-wider ${config.textColor}`}>{milestone.status}</span>
        </div>
        <h4 className="text-lg font-semibold text-brand-gray-dark mt-1">Milestone {index + 1}: {milestone.title}</h4>
        <div className="text-sm text-brand-gray mt-2">
            {milestone.status === 'In Verification' && `Verifier: ${milestone.verifier}`}
            {milestone.status === 'Verified & Released' && (
                <div className="flex items-center space-x-2">
                    <CubeTransparentIcon className="w-4 h-4" />
                    <span className="font-mono truncate" title={milestone.verificationTx}>
                        {milestone.verificationTx}
                    </span>
                </div>
            )}
             {milestone.status === 'Rejected' && milestone.rejectionReason && (
                <p className="text-xs text-red-700 mt-1 italic">Reason: {milestone.rejectionReason}</p>
            )}
        </div>
      </div>
      <div className="mt-3 sm:mt-0 sm:text-right flex-shrink-0">
        <span className="text-xl font-bold text-brand-gray-dark">{formatter.format(milestone.target)}</span>
        <p className="text-sm text-brand-gray">Target Amount</p>
      </div>
    </button>
  );
};
