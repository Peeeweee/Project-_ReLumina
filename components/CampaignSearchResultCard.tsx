import React from 'react';
import { CampaignDetail, CampaignStatus } from '../types';
import { LocationPinIcon, CheckCircleIcon, ClockIcon, XCircleIcon as XCircleIconSolid } from './icons';

interface CampaignSearchResultCardProps {
  campaign: CampaignDetail;
  onClick: () => void;
}

const getStatusBadge = (status: CampaignStatus) => {
    const styles: { [key in CampaignStatus]: string } = {
        'Live': 'bg-green-100 text-green-800',
        'Awaiting Admin Verification': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-gray-100 text-gray-800',
        'Draft': 'bg-gray-100 text-gray-500',
        'Rejected': 'bg-red-100 text-red-800',
        'Pending Volunteer Verification': 'bg-blue-100 text-blue-800',
        'Completion Pending Volunteer Review': 'bg-blue-100 text-blue-800',
        'Completion Pending Admin Approval': 'bg-yellow-100 text-yellow-800',
        'Pending Final Report': 'bg-purple-100 text-purple-800',
    };
    const icons: { [key in CampaignStatus]?: React.ReactNode } = {
        'Live': <CheckCircleIcon className="w-3 h-3" />,
        'Completed': <CheckCircleIcon className="w-3 h-3" />,
        'Awaiting Admin Verification': <ClockIcon className="w-3 h-3" />,
        'Pending Volunteer Verification': <ClockIcon className="w-3 h-3" />,
        'Completion Pending Volunteer Review': <ClockIcon className="w-3 h-3" />,
        'Completion Pending Admin Approval': <ClockIcon className="w-3 h-3" />,
        'Pending Final Report': <ClockIcon className="w-3 h-3" />,
        'Rejected': <XCircleIconSolid className="w-3 h-3" />,
    };
    return (
        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 text-xs leading-5 font-semibold rounded-full ${styles[status] || styles['Draft']}`}>
            {icons[status]}
            <span>{status}</span>
        </span>
    );
};

export const CampaignSearchResultCard: React.FC<CampaignSearchResultCardProps> = ({ campaign, onClick }) => {
    return (
        <article
            onClick={onClick}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-brand-blue hover:scale-[1.03] cursor-pointer flex h-28"
        >
            <img 
                src={campaign.imageUrl} 
                alt={campaign.title} 
                className="w-28 object-cover flex-shrink-0 bg-gray-100"
            />
            <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
                <div className="min-w-0">
                    <h4 className="font-bold text-gray-800 truncate">{campaign.title}</h4>
                    <p className="text-sm text-gray-500 truncate">by {campaign.organizer}</p>
                </div>
                <div className="flex justify-between items-end">
                    <div className="flex items-center text-xs text-gray-400 mt-1 min-w-0">
                        <LocationPinIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{campaign.location}</span>
                    </div>
                    <div className="flex-shrink-0">
                        {getStatusBadge(campaign.status)}
                    </div>
                </div>
            </div>
        </article>
    );
};