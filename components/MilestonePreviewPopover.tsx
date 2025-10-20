import React from 'react';
import { CampaignDetail, Milestone, MilestoneStatus } from '../types';
import { CheckCircleIcon, LockClosedIcon, ClockIcon, XCircleIcon } from './icons';

interface MilestonePreviewPopoverProps {
  milestone: Milestone;
  campaign: CampaignDetail;
}

const getStatusVisuals = (status: MilestoneStatus) => {
    const baseClasses = "flex items-center space-x-2 text-sm font-semibold";
    switch (status) {
        case 'Locked':
            return <div className={`${baseClasses} text-gray-600`}><LockClosedIcon className="w-4 h-4" /><span>{status}</span></div>;
        case 'Pending Volunteer Verification':
            return <div className={`${baseClasses} text-blue-600`}><ClockIcon className="w-4 h-4" /><span>Awaiting Volunteer</span></div>;
        case 'In Verification':
            return <div className={`${baseClasses} text-yellow-600`}><ClockIcon className="w-4 h-4" /><span>Admin Review</span></div>;
        case 'Verified & Released':
            return <div className={`${baseClasses} text-green-600`}><CheckCircleIcon className="w-4 h-4" /><span>Released</span></div>;
        case 'Rejected':
            return <div className={`${baseClasses} text-red-600`}><XCircleIcon className="w-4 h-4" /><span>{status}</span></div>;
        default:
            return null;
    }
};

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const MilestonePreviewPopover: React.FC<MilestonePreviewPopoverProps> = ({ milestone, campaign }) => {
    return (
        <div className="w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Milestone Details</p>
            <h3 className="font-bold text-xl text-gray-800 mt-2">{milestone.title}</h3>
            <p className="text-sm text-gray-500 mt-1">From campaign: <span className="font-semibold text-gray-600">{campaign.title}</span></p>
            
            <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    {getStatusVisuals(milestone.status)}
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Target Amount</span>
                    <span className="font-bold text-lg text-brand-blue">{formatter.format(milestone.target)}</span>
                </div>
            </div>
        </div>
    );
};
