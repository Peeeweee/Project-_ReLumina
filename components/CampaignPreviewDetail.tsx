import React, { useState } from 'react';
import { CampaignDetail, Milestone, Transaction } from '../types';
import { ProgressBar } from './ProgressBar';
import { ChevronLeftIcon, CheckCircleIcon, LockClosedIcon, ClockIcon, XCircleIcon, CubeTransparentIcon, UserCircleIcon, XMarkIcon } from './icons';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

// Modal Component for Milestone Preview
const MilestonePreviewModal: React.FC<{ milestone: Milestone | null; onClose: () => void; }> = ({ milestone, onClose }) => {
    if (!milestone) return null;
  
    return (
      <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4" 
          aria-modal="true" 
          role="dialog"
          onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale text-center p-8"
          onClick={(e) => e.stopPropagation()}
        >
            <div className="mb-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Milestone Preview</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">{milestone.title}</h2>
            </div>

            <div>
                <p className="text-lg text-gray-600">Target Amount</p>
                <p className="text-5xl font-bold text-brand-blue mt-1">
                    ₱{Number(milestone.target).toLocaleString()}
                </p>
            </div>
            
            <button 
                onClick={onClose} 
                className="mt-8 bg-gray-100 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    );
};

// Modal for Donation Detail
const DonationDetailModal: React.FC<{ transaction: Transaction | null, campaignTitle: string, onClose: () => void }> = ({ transaction, campaignTitle, onClose }) => {
    if (!transaction) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Donation Detail</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-800 text-lg">
                        A donation of <span className="font-bold text-brand-blue">₱{transaction.amount?.toLocaleString()}</span> was made to "{campaignTitle}".
                    </p>
                    
                    <div className="pt-4 border-t">
                         <h3 className="text-sm font-semibold text-gray-500 mb-2">Transaction Details</h3>
                         <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <CubeTransparentIcon className="w-4 h-4 text-gray-400"/>
                                <span className="font-mono text-gray-700 truncate" title={transaction.hash}>{transaction.hash}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserCircleIcon className="w-4 h-4 text-gray-400"/>
                                <span className={`font-mono ${transaction.donorAddress === 'Anonymous' ? 'italic text-gray-500' : 'text-gray-700'}`}>
                                    {transaction.donorAddress}
                                </span>
                            </div>
                         </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500">Timestamp</p>
                        <div className="flex items-center space-x-1 text-gray-800 font-semibold">
                            <ClockIcon className="w-4 h-4 text-gray-500" />
                            <span>{transaction.timestamp}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const getStatusIcon = (status: Milestone['status']) => {
    const baseClasses = "w-4 h-4 mr-2 flex-shrink-0";
    switch (status) {
        case 'Locked':
            return <LockClosedIcon className={`${baseClasses} text-gray-500`} />;
        case 'Pending Volunteer Verification':
        case 'In Verification':
            return <ClockIcon className={`${baseClasses} text-yellow-600`} />;
        case 'Verified & Released':
            return <CheckCircleIcon className={`${baseClasses} text-green-600`} />;
        case 'Rejected':
            return <XCircleIcon className={`${baseClasses} text-red-600`} />;
        default:
            return null;
    }
};

const CampaignDetailView: React.FC<{ 
    campaign: CampaignDetail; 
    onBack: () => void;
    onPreviewMilestone: (m: Milestone) => void;
    onPreviewDonation: (t: Transaction) => void;
}> = ({ campaign, onBack, onPreviewMilestone, onPreviewDonation }) => {
    const progress = (campaign.goal > 0) ? (campaign.raised / campaign.goal) * 100 : 0;
    const donations = campaign.activity.filter(tx => tx.description?.toLowerCase().includes('donation'));

    return (
        <>
        <style>{`
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.5s ease-out forwards;
            }
             @keyframes fade-in-scale {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-scale {
              animation: fade-in-scale 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
            }
        `}</style>
        <div className="flex flex-col h-full">
            <header className="p-4 border-b bg-gray-50/50 sticky top-0 z-10">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-2">
                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                    Back to List
                </button>
                <h3 className="text-lg font-bold text-gray-800">{campaign.title}</h3>
                <p className="text-sm text-gray-500">by {campaign.organizer}</p>
            </header>

            <div className="p-4 space-y-4 overflow-y-auto">
                {/* Funding */}
                <section className="animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-brand-blue text-lg">{formatter.format(campaign.raised)}</span>
                        <span className="text-xs text-gray-500">Goal: {formatter.format(campaign.goal)}</span>
                    </div>
                    <ProgressBar value={progress} />
                </section>
                
                {/* Milestones */}
                <section className="animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
                    <h4 className="font-semibold text-gray-700 mb-2">Milestones</h4>
                    <ul className="space-y-2">
                        {campaign.milestones.map(milestone => (
                            <li key={milestone.id}>
                                <button
                                    onClick={() => onPreviewMilestone(milestone)}
                                    className="w-full text-left p-2 bg-gray-50 rounded-md border flex justify-between items-center text-sm transition-all duration-200 hover:bg-blue-50 hover:shadow-md hover:scale-[1.02] hover:border-blue-300"
                                >
                                    <div className="flex items-center">
                                        {getStatusIcon(milestone.status)}
                                        <span className="font-medium text-gray-800">{milestone.title}</span>
                                    </div>
                                    <span className="font-semibold text-gray-700">{formatter.format(milestone.target)}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Donor Activity */}
                <section className="animate-fade-in-up" style={{ animationDelay: '300ms', opacity: 0 }}>
                    <h4 className="font-semibold text-gray-700 mb-2">Recent Donor Activity</h4>
                    <ul className="space-y-2">
                        {donations.length > 0 ? donations.slice(0, 5).map((tx, index) => (
                             <li key={index}>
                                 <button
                                    onClick={() => onPreviewDonation(tx)}
                                    className="w-full text-left p-2 bg-gray-50 rounded-md border flex justify-between items-center text-sm transition-all duration-200 hover:bg-blue-50 hover:shadow-md hover:scale-[1.02] hover:border-blue-300"
                                >
                                    <div className="flex items-center space-x-2 font-mono text-xs text-gray-600">
                                        <UserCircleIcon className="w-4 h-4 text-gray-400" />
                                        <span title={tx.donorAddress ?? undefined}>
                                            {tx.donorAddress === 'Anonymous' ? 'Anonymous' : `${tx.donorAddress?.slice(0, 6)}...`}
                                        </span>
                                    </div>
                                    <span className="font-semibold text-green-700">+{formatter.format(tx.amount || 0)}</span>
                                </button>
                            </li>
                        )) : <p className="text-sm text-gray-500 text-center py-4">No donations yet.</p>}
                    </ul>
                </section>
            </div>
        </div>
        </>
    );
};


const CampaignListView: React.FC<{ campaigns: CampaignDetail[]; onSelect: (c: CampaignDetail) => void; }> = ({ campaigns, onSelect }) => {
    return (
        <div className="p-4">
            <ul className="space-y-2">
                {campaigns.map(c => (
                    <li key={c.id}>
                        <button 
                            onClick={() => onSelect(c)}
                            className="w-full text-left p-3 bg-gray-50 rounded-md flex justify-between items-center group transition-all duration-200 ease-in-out hover:bg-blue-50 border hover:shadow-lg hover:scale-[1.03] hover:border-brand-blue"
                        >
                            <div>
                                <p className="font-semibold text-gray-800 group-hover:text-brand-blue transition-colors duration-200">{c.title}</p>
                                <p className="text-sm text-gray-500">by {c.organizer}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-brand-blue">{formatter.format(c.raised)}</span>
                                <p className="text-xs text-gray-400">raised</p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface CampaignPreviewDetailProps {
  campaigns: CampaignDetail[];
}

export const CampaignPreviewDetail: React.FC<CampaignPreviewDetailProps> = ({ campaigns }) => {
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignDetail | null>(null);
    const [previewMilestone, setPreviewMilestone] = useState<Milestone | null>(null);
    const [previewDonation, setPreviewDonation] = useState<Transaction | null>(null);

    if (selectedCampaign) {
        return (
            <>
                <CampaignDetailView 
                    campaign={selectedCampaign} 
                    onBack={() => setSelectedCampaign(null)}
                    onPreviewMilestone={setPreviewMilestone}
                    onPreviewDonation={setPreviewDonation}
                />
                <MilestonePreviewModal milestone={previewMilestone} onClose={() => setPreviewMilestone(null)} />
                <DonationDetailModal transaction={previewDonation} campaignTitle={selectedCampaign.title} onClose={() => setPreviewDonation(null)} />
            </>
        );
    }

    return <CampaignListView campaigns={campaigns} onSelect={setSelectedCampaign} />;
};