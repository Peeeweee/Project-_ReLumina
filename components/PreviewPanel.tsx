import React from 'react';
import { CampaignDetail, Milestone, MilestoneStatus } from '../types';
import { XMarkIcon, LocationPinIcon, CheckCircleIcon, LockClosedIcon, ClockIcon, XCircleIcon as XCircleIconSolid, ArrowTopRightOnSquareIcon } from './icons';
import { ProgressBar } from './ProgressBar';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

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
            return <div className={`${baseClasses} text-red-600`}><XCircleIconSolid className="w-4 h-4" /><span>{status}</span></div>;
        default:
            return null;
    }
};


const CampaignContent: React.FC<{ campaign: CampaignDetail, onViewDetails: (id: string) => void }> = ({ campaign, onViewDetails }) => {
    const progress = (campaign.raised / campaign.goal) * 100;
    return (
        <>
            <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-48 object-cover" />
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-bold text-2xl text-gray-800">{campaign.title}</h3>
                <p className="text-sm text-gray-500 mt-1">by {campaign.organizer}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                    <LocationPinIcon className="w-4 h-4 mr-1.5" />
                    <span>{campaign.location}</span>
                </div>
                <p className="text-base text-gray-700 mt-4 flex-grow">{campaign.description}</p>
                <div className="mt-4">
                    <div className="flex justify-between items-baseline text-sm mb-1">
                        <span className="font-semibold text-brand-blue">{formatter.format(campaign.raised)}</span>
                        <span className="text-gray-500">Goal: {formatter.format(campaign.goal)}</span>
                    </div>
                    <ProgressBar value={progress} />
                </div>
            </div>
            <div className="p-4 bg-gray-50 border-t">
                 <button onClick={() => onViewDetails(campaign.id)} className="w-full flex items-center justify-center space-x-2 bg-brand-blue text-white text-sm font-bold py-2 px-3 rounded-md hover:bg-brand-blue-dark transition-colors">
                    <span>View Full Campaign Details</span>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </button>
            </div>
        </>
    );
};

const MilestoneContent: React.FC<{ milestone: Milestone, campaign: CampaignDetail, onViewDetails: (id: string) => void }> = ({ milestone, campaign, onViewDetails }) => {
    return (
        <div className="p-6 flex flex-col h-full">
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Milestone Details</p>
            <h3 className="font-bold text-3xl text-gray-800 mt-2">{milestone.title}</h3>
            <p className="text-base text-gray-500 mt-1">From campaign: <span className="font-semibold text-gray-600">{campaign.title}</span></p>
            
            <div className="mt-6 pt-6 border-t flex-grow space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-lg">Status</span>
                    {getStatusVisuals(milestone.status)}
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-lg">Target Amount</span>
                    <span className="font-bold text-2xl text-brand-blue">{formatter.format(milestone.target)}</span>
                </div>
                 {milestone.verifier && (
                     <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium text-lg">Verifier</span>
                        <span className="font-semibold text-base text-gray-800">{milestone.verifier}</span>
                    </div>
                 )}
            </div>
             <div className="p-4 bg-gray-50 border-t -m-6 mt-6">
                 <button onClick={() => onViewDetails(campaign.id)} className="w-full flex items-center justify-center space-x-2 bg-brand-blue text-white text-sm font-bold py-2 px-3 rounded-md hover:bg-brand-blue-dark transition-colors">
                    <span>View Campaign</span>
                     <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

interface PreviewPanelProps {
    type: 'campaign' | 'milestone';
    data: any;
    onClose: () => void;
    onViewDetails: (id: string) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ type, data, onClose, onViewDetails }) => {
    const handleViewDetailsAndClose = (id: string) => {
        onViewDetails(id);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 opacity-0 animate-scale-in max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative flex-grow flex flex-col">
                    <button onClick={onClose} className="absolute top-3 right-3 z-10 p-1 bg-gray-800/40 text-white rounded-full hover:bg-gray-800/70">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                    {type === 'campaign' && <CampaignContent campaign={data} onViewDetails={handleViewDetailsAndClose} />}
                    {type === 'milestone' && <MilestoneContent milestone={data.milestone} campaign={data.campaign} onViewDetails={handleViewDetailsAndClose} />}
                </div>
            </div>
        </div>
    );
};