import React from 'react';
import { CampaignDetail, Milestone } from '../types';
import { XMarkIcon, PencilIcon, CheckCircleIcon, LockClosedIcon, ClockIcon, XCircleIcon as XCircleIconSolid, TrashIcon } from '../components/icons';
import { ProgressBar } from './ProgressBar';

interface CampaignDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignDetail | null;
  onRequestRelease: (milestone: Milestone) => void;
  onEditCampaign: (campaign: CampaignDetail) => void;
  onRecommendDeletion: (campaign: CampaignDetail) => void;
  onInitiateCompletion: (campaign: CampaignDetail) => void;
}

const getStatusBadge = (status: Milestone['status']) => {
    const baseClasses = "flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-full";
    switch (status) {
        case 'Locked':
            return <div className={`${baseClasses} bg-gray-200 text-gray-800`}><LockClosedIcon className="w-3 h-3" /><span>{status}</span></div>;
        case 'Pending Volunteer Verification':
            return <div className={`${baseClasses} bg-blue-100 text-blue-800`}><ClockIcon className="w-3 h-3" /><span>Awaiting Volunteer</span></div>;
        case 'In Verification':
            return <div className={`${baseClasses} bg-yellow-100 text-yellow-800`}><ClockIcon className="w-3 h-3" /><span>Admin Review</span></div>;
        case 'Verified & Released':
            return <div className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircleIcon className="w-3 h-3" /><span>Released</span></div>;
        case 'Rejected':
            return <div className={`${baseClasses} bg-red-100 text-red-800`}><XCircleIconSolid className="w-3 h-3" /><span>{status}</span></div>;
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


export const CampaignDetailDrawer: React.FC<CampaignDetailDrawerProps> = ({ isOpen, onClose, campaign, onRequestRelease, onEditCampaign, onRecommendDeletion, onInitiateCompletion }) => {
    if (!campaign) return null;
    
    const progress = (campaign.raised / campaign.goal) * 100;

    const spentAmount = campaign.milestones
        .filter(m => m.status === 'Verified & Released')
        .reduce((sum, m) => sum + m.target, 0);

    const availableFunds = campaign.raised - spentAmount;

    const nextLockedMilestoneIndex = campaign.milestones.findIndex(m => m.status === 'Locked');

    const isAnotherMilestonePending = campaign.milestones.some(
        m => m.status === 'Pending Volunteer Verification' || m.status === 'In Verification'
    );
    
    const canInitiateCompletion = campaign.milestones.length > 0 && campaign.milestones.every(m => m.status === 'Verified & Released');


    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b flex justify-between items-start">
                        <div>
                            <h2 id="drawer-title" className="text-2xl font-bold text-brand-gray-dark">{campaign.title}</h2>
                            <p className="text-sm text-brand-gray">{campaign.location}</p>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                           <XMarkIcon className="w-6 h-6" />
                           <span className="sr-only">Close panel</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-6">
                        {/* Funding Progress */}
                        <section>
                             <div className="flex justify-between items-baseline mb-2">
                                <span className="font-bold text-xl text-brand-blue">
                                    {formatter.format(campaign.raised)}
                                </span>
                                <span className="font-normal text-sm text-brand-gray">
                                    Goal: {formatter.format(campaign.goal)}
                                </span>
                            </div>
                            <ProgressBar value={progress} />
                            <div className="flex justify-between text-xs text-brand-gray mt-2">
                                <p>{progress.toFixed(0)}% of goal raised</p>
                                <p>Available: <span className="font-semibold">{formatter.format(availableFunds)}</span></p>
                            </div>
                        </section>

                        {/* Description */}
                        <section>
                            <h3 className="text-lg font-semibold text-brand-gray-dark mb-2">Description</h3>
                            <p className="text-sm text-brand-gray leading-relaxed">{campaign.description}</p>
                        </section>
                        
                        {/* Milestones */}
                        <section>
                             <h3 className="text-lg font-semibold text-brand-gray-dark mb-3">Milestones</h3>
                             <div className="space-y-4">
                                {campaign.milestones.map((milestone, index) => {
                                    const isNextMilestone = nextLockedMilestoneIndex !== -1 && index === nextLockedMilestoneIndex;
                                    const hasSufficientFunds = availableFunds >= milestone.target;
                                    const canRequest = isNextMilestone && hasSufficientFunds && !isAnotherMilestonePending;

                                    let disabledTooltip = '';
                                    if (milestone.status === 'Locked') {
                                        if (isAnotherMilestonePending) {
                                            disabledTooltip = 'Another milestone is currently under review. Please wait for it to be resolved.';
                                        } else if (!isNextMilestone) {
                                            disabledTooltip = 'Previous milestones must be completed first.';
                                        } else if (!hasSufficientFunds) {
                                            disabledTooltip = `Insufficient funds. Needs ${formatter.format(milestone.target - availableFunds)} more.`;
                                        }
                                    }

                                    return (
                                        <div key={milestone.id} className="p-3 bg-gray-50 rounded-md border">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-brand-gray-dark">{milestone.title}</h4>
                                                    <p className="text-sm text-brand-gray">{formatter.format(milestone.target)}</p>
                                                </div>
                                                {getStatusBadge(milestone.status)}
                                            </div>
                                            {milestone.status === 'Locked' && campaign.status === 'Live' && (
                                                <div className="mt-3 pt-3 border-t relative group">
                                                    <button
                                                        onClick={() => onRequestRelease(milestone)}
                                                        disabled={!canRequest}
                                                        className="w-full text-center bg-brand-green text-white text-sm font-bold py-2 px-3 rounded-md hover:bg-brand-green-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        Request Fund Release
                                                    </button>
                                                    {disabledTooltip && (
                                                        <div className="absolute hidden group-hover:block bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10">
                                                            {disabledTooltip}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {milestone.status === 'Rejected' && milestone.rejectionReason && (
                                                <p className="text-xs text-red-700 mt-2 italic">Reason: {milestone.rejectionReason}</p>
                                            )}
                                        </div>
                                    );
                                })}
                             </div>
                        </section>
                    </div>

                     {/* Footer Actions */}
                    <div className="p-6 border-t bg-gray-50 flex-shrink-0 space-y-3">
                        {(campaign.status === 'Live' || campaign.status === 'Pending Final Report') && (
                            <div className="relative" title={!canInitiateCompletion ? 'All milestones must be verified and released before you can submit the final campaign report.' : ''}>
                                <button
                                    onClick={() => onInitiateCompletion(campaign)}
                                    disabled={!canInitiateCompletion}
                                    className="w-full flex items-center justify-center space-x-2 bg-green-50 border border-green-200 text-green-700 font-bold py-2 px-4 rounded-md hover:bg-green-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
                                >
                                    <CheckCircleIcon className="w-5 h-5"/>
                                    <span>Submit Final Report</span>
                                </button>
                            </div>
                        )}
                        {campaign.status === 'Live' && (
                            <button
                                onClick={() => onEditCampaign(campaign)}
                                className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-brand-gray-dark font-bold py-2 px-4 rounded-md hover:bg-gray-100"
                            >
                                <PencilIcon className="w-5 h-5"/>
                                <span>Edit Campaign</span>
                            </button>
                        )}
                         {campaign.status === 'Live' && (
                            <button
                                onClick={() => onRecommendDeletion(campaign)}
                                className="w-full flex items-center justify-center space-x-2 bg-red-50 border border-red-200 text-red-700 font-bold py-2 px-4 rounded-md hover:bg-red-100"
                            >
                                <TrashIcon className="w-5 h-5"/>
                                <span>Recommend for Deletion</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};