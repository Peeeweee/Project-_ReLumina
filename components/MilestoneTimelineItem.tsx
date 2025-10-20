
import React from 'react';
// FIX: Corrected import path for types
import { Milestone } from '../types';
// FIX: Corrected import path for icons
import { CheckCircleIcon, CubeTransparentIcon, ArrowTopRightOnSquareIcon } from './icons';

interface MilestoneTimelineItemProps {
  milestone: Milestone;
  isLast: boolean;
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const MilestoneTimelineItem: React.FC<MilestoneTimelineItemProps> = ({ milestone, isLast }) => {
  return (
    <div className="relative flex items-start">
      <div className="flex-shrink-0 w-10 flex flex-col items-center">
        <div className="bg-brand-green rounded-full p-1.5 z-10">
          <CheckCircleIcon className="w-7 h-7 text-white" />
        </div>
        {!isLast && <div className="w-0.5 h-full bg-brand-green-light mt-1"></div>}
      </div>
      <div className="ml-4 pb-12 w-full">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-brand-gray-dark">{milestone.title}</h3>
                    <p className="text-sm text-brand-gray">Verified by: <span className="font-semibold">{milestone.verifier}</span></p>
                </div>
                <p className="text-lg font-bold text-brand-green-dark">{formatter.format(milestone.target)}</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
                <a 
                    href="#" 
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center space-x-1 text-xs text-brand-blue hover:underline font-mono"
                    title="View transaction on block explorer"
                >
                    <CubeTransparentIcon className="w-4 h-4" />
                    <span className="truncate">{milestone.verificationTx}</span>
                    <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};