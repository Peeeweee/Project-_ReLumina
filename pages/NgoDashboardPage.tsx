import React, { useState, useMemo, useEffect } from 'react';
import { CampaignDetail, NgoActivity, Milestone, AggregatedDonor, EvidenceItem } from '../types';
import { CampaignManagementTable } from '../components/CampaignManagementTable';
import { NgoActivityFeed } from '../components/NgoActivityFeed';
import { CampaignDetailDrawer } from '../components/CampaignDetailDrawer';
import { RequestReleaseModal } from '../components/RequestReleaseModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { EvidenceUploader } from '../components/EvidenceUploader';
// FIX: Added UserCircleIcon to the import list to fix a compilation error.
import { PlusIcon, CurrencyDollarIcon, CubeTransparentIcon, ClockIcon, TrophyIcon, UsersIcon, XMarkIcon, UserCircleIcon } from '../components/icons';
import { CampaignPreviewDetail } from '../components/CampaignPreviewDetail';
import { DonorListModal } from '../components/DonorListModal';
import { DashboardShell, DashboardHeader, StatCard } from '../components/DashboardShell';


// --- Final Report Modal ---
const FinalReportModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    campaign: CampaignDetail | null;
    onSubmit: (report: string, evidence: EvidenceItem[]) => void;
}> = ({ isOpen, onClose, campaign, onSubmit }) => {
    const [report, setReport] = useState('');
    const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setReport('');
            setEvidence([]);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen || !campaign) return null;

    const handleSubmit = () => {
        if (!report.trim() || evidence.length === 0) {
            alert("Please provide a report narrative and upload at least one piece of evidence.");
            return;
        }
        setIsSubmitting(true);
        onSubmit(report, evidence);
        // Parent component will close the modal on success
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">Submit Final Campaign Report</h2>
                    <p className="text-sm text-gray-500 mt-1">For "{campaign.title}"</p>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                    <div>
                        <label htmlFor="final-report-narrative" className="block text-sm font-medium text-gray-700 mb-1">Report Narrative</label>
                        <textarea
                            id="final-report-narrative"
                            value={report}
                            onChange={(e) => setReport(e.target.value)}
                            rows={6}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                            placeholder="Summarize the campaign's overall impact, outcomes, and any final financial details."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Final Evidence</label>
                        <p className="text-xs text-gray-500 mb-2">Upload documents, impact photos, or final receipts. You can also add links.</p>
                        <EvidenceUploader onEvidenceChange={setEvidence} />
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!report.trim() || evidence.length === 0 || isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue-dark disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Reason Modal for Deletion Recommendation ---
const ReasonModal: React.FC<{
    title: string;
    onClose: () => void;
    onSubmit: (reason: string) => void;
}> = ({ title, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(reason);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    <p className="text-sm text-gray-500 mt-1">Please provide a clear reason for your recommendation (e.g., campaign is fraudulent, objectives have changed). This will be sent to an admin for review.</p>
                </div>
                <div className="p-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={5}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="Provide a detailed explanation..."
                    />
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!reason.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400"
                    >
                        Submit Recommendation
                    </button>
                </div>
            </div>
        </div>
    );
};

// Re-usable Detail Modal for Dashboard Cards
const DashboardDetailModal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void; }> = ({ title, children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- Activity Detail Modal ---
const ActivityDetailModal: React.FC<{ activity: NgoActivity | null, onClose: () => void }> = ({ activity, onClose }) => {
    if (!activity) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Notification Detail</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-800 text-lg">{activity.description}</p>
                    
                    {activity.transactionHash && (
                        <div className="pt-4 border-t">
                             <h3 className="text-sm font-semibold text-gray-500 mb-2">Transaction Details</h3>
                             <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <CubeTransparentIcon className="w-4 h-4 text-gray-400"/>
                                    <span className="font-mono text-gray-700 truncate" title={activity.transactionHash}>{activity.transactionHash}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <UserCircleIcon className="w-4 h-4 text-gray-400"/>
                                    <span className={`font-mono ${activity.donorAddress === 'Anonymous' ? 'italic text-gray-500' : 'text-gray-700'}`}>
                                        {activity.donorAddress}
                                    </span>
                                </div>
                             </div>
                        </div>
                    )}
                    
                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500">Timestamp</p>
                        <div className="flex items-center space-x-1 text-gray-800 font-semibold">
                            <ClockIcon className="w-4 h-4 text-gray-500" />
                            <span>{activity.timestamp}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface NgoDashboardPageProps {
  campaigns: CampaignDetail[];
  activities: NgoActivity[];
  aggregatedDonors: AggregatedDonor[];
  fundsInEscrow: number;
  onCreateCampaign: () => void;
  onNgoRequestRelease: (campaignId: string, milestone: Milestone) => void;
  onEditCampaign: (campaign: CampaignDetail) => void;
  onRecommendDeletion: (campaign: CampaignDetail, reason: string) => void;
  onNgoSubmitFinalReport: (campaign: CampaignDetail, report: string, evidence: EvidenceItem[]) => void;
}

export const NgoDashboardPage: React.FC<NgoDashboardPageProps> = ({
  campaigns,
  activities,
  aggregatedDonors,
  fundsInEscrow,
  onCreateCampaign,
  onNgoRequestRelease,
  onEditCampaign,
  onRecommendDeletion,
  onNgoSubmitFinalReport,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignDetail | null>(null);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [milestoneToRelease, setMilestoneToRelease] = useState<Milestone | null>(null);
  const [campaignForRelease, setCampaignForRelease] = useState<CampaignDetail | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<NgoActivity | null>(null);
  const [detailModalContent, setDetailModalContent] = useState<{ title: string; data: React.ReactNode } | null>(null);
  const [campaignToRecommendDelete, setCampaignToRecommendDelete] = useState<CampaignDetail | null>(null);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [campaignForFinalReport, setCampaignForFinalReport] = useState<CampaignDetail | null>(null);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    message: string;
    confirmText: string;
    confirmColor: 'green' | 'red';
    onConfirm: () => void;
  } | null>(null);


  useEffect(() => {
    if (selectedCampaign) {
      const updatedCampaign = campaigns.find(c => c.id === selectedCampaign.id);
      if (updatedCampaign && JSON.stringify(updatedCampaign) !== JSON.stringify(selectedCampaign)) {
        setSelectedCampaign(updatedCampaign);
      }
    }
  }, [campaigns, selectedCampaign]);

  const {
    activeCampaigns,
    totalFundsRaised,
    pendingMilestones,
    completedCampaigns
  } = useMemo(() => {
    const active = campaigns.filter(c => c.status === 'Live');
    const totalRaised = active.reduce((sum, c) => sum + c.raised, 0);
    const pending = campaigns.flatMap(c => c.milestones).filter(m => ['Pending Volunteer Verification', 'In Verification'].includes(m.status));
    const completed = campaigns.filter(c => c.status === 'Completed');
    return {
      activeCampaigns: active,
      totalFundsRaised: totalRaised,
      pendingMilestones: pending,
      completedCampaigns: completed,
    };
  }, [campaigns]);

  const handleViewDetails = (campaign: CampaignDetail) => {
    setSelectedCampaign(campaign);
    setIsDrawerOpen(true);
  };
  
  const handleRequestReleaseClick = (campaign: CampaignDetail) => {
    const nextMilestone = campaign.milestones.find(m => m.status === 'Locked');
    if (nextMilestone) {
        setCampaignForRelease(campaign);
        setMilestoneToRelease(nextMilestone);
        setIsReleaseModalOpen(true);
    }
  };

  const handleConfirmRelease = () => {
    if (campaignForRelease && milestoneToRelease) {
      onNgoRequestRelease(campaignForRelease.id, milestoneToRelease);
      setIsReleaseModalOpen(false);
      setMilestoneToRelease(null);
      setCampaignForRelease(null);
    }
  };
  
  const handleDrawerRequestRelease = (milestone: Milestone) => {
    if (selectedCampaign) {
      setCampaignForRelease(selectedCampaign);
      setMilestoneToRelease(milestone);
      setIsReleaseModalOpen(true);
    }
  };

  const handleEditClick = (campaign: CampaignDetail) => {
    setConfirmation({
        title: 'Edit Campaign?',
        message: `Are you sure you want to edit "${campaign.title}"? This will close the details panel and take you to the campaign editor.`,
        confirmText: 'Proceed to Edit',
        confirmColor: 'green',
        onConfirm: () => {
            setIsDrawerOpen(false);
            onEditCampaign(campaign);
        },
    });
  };

  const handleSubmitRecommendation = (reason: string) => {
    if (campaignToRecommendDelete) {
        const campaign = campaignToRecommendDelete;
        setCampaignToRecommendDelete(null); // Close ReasonModal
        
        setConfirmation({
            title: 'Confirm Deletion Recommendation',
            message: `Are you sure you want to recommend deleting "${campaign.title}"? This action cannot be undone and will send a request for volunteer review.`,
            confirmText: 'Yes, Recommend Deletion',
            confirmColor: 'red',
            onConfirm: () => onRecommendDeletion(campaign, reason),
        });
    }
  };
  
  const handleInitiateCompletion = (campaign: CampaignDetail) => {
    setCampaignForFinalReport(campaign);
  };
  
  const handleFinalReportSubmit = (report: string, evidence: EvidenceItem[]) => {
    if (campaignForFinalReport) {
        onNgoSubmitFinalReport(campaignForFinalReport, report, evidence);
        setCampaignForFinalReport(null);
        setIsDrawerOpen(false);
    }
  };

  const handleShowActive = () => setDetailModalContent({ title: "Active Campaigns Overview", data: <CampaignPreviewDetail campaigns={activeCampaigns} /> });
  const handleShowPending = () => setDetailModalContent({ title: "Pending Milestones", data: <ul className="space-y-3 p-4">{pendingMilestones.map(m => { const parent = campaigns.find(c=>c.milestones.some(cm=>cm.id===m.id)); return (<li key={m.id} className="p-3 bg-gray-50 rounded-md border"><p className="font-semibold">{m.title}</p><p className="text-sm text-gray-500">Campaign: {parent?.title}</p></li>)})}</ul> });
  const handleShowCompleted = () => setDetailModalContent({ title: "Completed Campaigns", data: <ul className="space-y-3 p-4">{completedCampaigns.map(c=>(<li key={c.id} className="p-3 bg-gray-50 rounded-md border flex justify-between items-center"><p className="font-semibold">{c.title}</p><span className="text-sm font-bold text-green-600">₱{c.raised.toLocaleString()}</span></li>))}</ul>});

  const header = (
    <DashboardHeader
      title="My Dashboard"
      subtitle="Manage your campaigns and track your funding progress."
    >
      <button onClick={onCreateCampaign} className="flex items-center space-x-2 bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-brand-blue-dark transition-colors">
        <PlusIcon className="w-5 h-5" />
        <span>Create New Campaign</span>
      </button>
    </DashboardHeader>
  );

  const sidebar = (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Overview</h3>
        <div className="space-y-2">
            <StatCard icon={<CubeTransparentIcon className="w-5 h-5"/>} label="Active Campaigns" value={activeCampaigns.length} onClick={handleShowActive} />
            <StatCard icon={<ClockIcon className="w-5 h-5"/>} label="Pending Milestones" value={pendingMilestones.length} onClick={handleShowPending} />
            <StatCard icon={<TrophyIcon className="w-5 h-5"/>} label="Completed" value={completedCampaigns.length} onClick={handleShowCompleted} />
            <StatCard icon={<UsersIcon className="w-5 h-5"/>} label="Total Donors" value={aggregatedDonors.length} onClick={() => setIsDonorModalOpen(true)} />
        </div>
      </div>
      <NgoActivityFeed activities={activities} onSelectActivity={setSelectedActivity} />
    </div>
  );

  const mainContent = (
    <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
            <h2 className="text-2xl font-bold text-brand-gray-dark mb-4">My Campaigns</h2>
            <CampaignManagementTable
                campaigns={campaigns}
                onViewDetails={handleViewDetails}
                onRequestRelease={handleRequestReleaseClick}
            />
        </div>
    </div>
  );

  return (
    <>
       <style>{`
        @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
      `}</style>
      
      <DashboardShell header={header} sidebar={sidebar} mainContent={mainContent} />

      <CampaignDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        campaign={selectedCampaign}
        onRequestRelease={handleDrawerRequestRelease}
        onEditCampaign={handleEditClick}
        onRecommendDeletion={(campaign) => {
            setIsDrawerOpen(false);
            setTimeout(() => setCampaignToRecommendDelete(campaign), 300);
        }}
        onInitiateCompletion={handleInitiateCompletion}
      />
      <RequestReleaseModal isOpen={isReleaseModalOpen} onClose={() => setIsReleaseModalOpen(false)} onConfirm={handleConfirmRelease} milestone={milestoneToRelease} />
      <ActivityDetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
      {detailModalContent && (<DashboardDetailModal title={detailModalContent.title} onClose={() => setDetailModalContent(null)}>{detailModalContent.data}</DashboardDetailModal>)}
      {campaignToRecommendDelete && (<ReasonModal title={`Recommend Deletion for "${campaignToRecommendDelete.title}"`} onClose={() => setCampaignToRecommendDelete(null)} onSubmit={handleSubmitRecommendation} />)}
      <DonorListModal donors={aggregatedDonors} isOpen={isDonorModalOpen} onClose={() => setIsDonorModalOpen(false)} />
      <FinalReportModal isOpen={!!campaignForFinalReport} onClose={() => setCampaignForFinalReport(null)} campaign={campaignForFinalReport} onSubmit={handleFinalReportSubmit} />
      {confirmation && (<ConfirmationModal isOpen={true} onClose={() => setConfirmation(null)} title={confirmation.title} message={confirmation.message} confirmText={confirmation.confirmText} confirmColor={confirmation.confirmColor} onConfirm={() => { confirmation.onConfirm(); setConfirmation(null); }} />)}
    </>
  );
};
