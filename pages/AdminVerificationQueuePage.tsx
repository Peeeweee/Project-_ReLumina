import React, { useState, useMemo, useEffect } from 'react';
import { PendingCampaign, PendingMilestoneRelease, AdminActivity, MilestoneInput, CampaignDetail, PendingDeletionRecommendation, AggregatedDonation, AggregatedDonor, PendingFinalReport } from '../types';
import { ChevronLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon, XMarkIcon, ClipboardDocumentCheckIcon, CubeTransparentIcon, CurrencyDollarIcon, UsersIcon, TrophyIcon, TrashIcon, ArrowTopRightOnSquareIcon, DocumentTextIcon } from '../components/icons';
import { ApprovalQueueItem } from '../components/ApprovalQueueItem';
import { CampaignApprovalDetail } from '../components/CampaignApprovalDetail';
import { MilestoneReleaseDetail } from '../components/MilestoneReleaseDetail';
import { AdminActivityLog } from '../components/AdminActivityLog';
import { RejectionModal } from '../components/RejectionModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { AdminStatCard } from '../components/admin_controls/AdminStatCard';
import { PlatformDonationFeed } from '../components/PlatformDonationFeed';
import { CampaignPreviewDetail } from '../components/CampaignPreviewDetail';
import { DonorListModal } from '../components/DonorListModal';
import { EvidenceViewer } from '../components/EvidenceViewer';


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
                    <p className="text-sm text-gray-500 mt-1">Please provide a clear reason for your recommendation. This will be sent to a volunteer for verification.</p>
                </div>
                <div className="p-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={5}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="e.g., Reports from the ground suggest misuse of funds..."
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
                        Send to Volunteer
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Sub-component for Deletion Recommendation Detail View ---
const DeletionRecommendationDetail: React.FC<{
    item: PendingDeletionRecommendation;
    onDeleteClick: () => void;
    onDismissClick: () => void;
}> = ({ item, onDeleteClick, onDismissClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 border-l-4 border-red-500">
            <div>
                <span className="text-sm font-semibold text-red-600">DELETION RECOMMENDATION</span>
                <h2 className="text-2xl font-bold text-gray-800">{item.campaign.title}</h2>
                <p className="text-gray-600">Campaign by: {item.campaign.organizer}</p>
                <p className="text-sm text-gray-500">Submitted: {item.submittedDate}</p>
            </div>

            {item.originalRequest && (
                 <div className="border-t pt-4 space-y-2">
                    <h3 className="font-semibold text-gray-700">Original Request</h3>
                    <p className="text-sm text-gray-600">
                        <strong>Source:</strong> {item.originalRequest.recommenderInfo}
                    </p>
                    <div className="text-sm text-gray-800 p-3 bg-red-50 rounded-md border border-red-200 italic">
                        "{item.originalRequest.reason}"
                    </div>
                </div>
            )}

            <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold text-gray-700">Volunteer's Justification</h3>
                <p className="text-sm text-gray-600">
                    <strong>Verifier:</strong> {item.recommender.id}
                </p>
                <div className="text-sm text-gray-800 p-3 bg-red-50 rounded-md border border-red-200 italic">
                    "{item.recommender.note}"
                </div>
                 <div className="mt-2">
                    <EvidenceViewer evidence={item.recommender.evidence} title="Volunteer Evidence"/>
                </div>
            </div>
            <div className="border-t pt-6 flex space-x-3">
                <button
                    onClick={onDismissClick}
                    className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300"
                >
                    Dismiss Recommendation
                </button>
                 <button
                    onClick={onDeleteClick}
                    className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700"
                >
                    Delete Campaign
                </button>
            </div>
        </div>
    );
};

// --- New component: FinalReportApprovalDetail ---
const FinalReportApprovalDetail: React.FC<{
    item: PendingFinalReport;
    onApproveClick: () => void;
    onRejectClick: () => void;
}> = ({ item, onApproveClick, onRejectClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 border-l-4 border-blue-500">
      <div>
        <span className="text-sm font-semibold text-blue-600">FINAL REPORT APPROVAL</span>
        <h2 className="text-2xl font-bold text-gray-800">{item.campaignTitle}</h2>
        <p className="text-sm text-gray-500">Submitted: {item.submittedDate}</p>
      </div>
      <div className="border-t pt-4 space-y-4">
        <div>
            <h3 className="font-semibold text-gray-700">NGO Final Report</h3>
            <div className="text-sm text-gray-800 p-3 bg-blue-50 rounded-md border border-blue-200 italic mt-1">
                "{item.ngoReport}"
            </div>
             <div className="mt-2">
                <EvidenceViewer evidence={item.ngoEvidence} title="NGO Evidence" />
             </div>
        </div>
         <div>
            <h3 className="font-semibold text-gray-700">Volunteer Verification</h3>
             <p className="text-sm text-gray-600">
                <strong>Verifier:</strong> {item.volunteerId}
            </p>
            <div className="text-sm text-gray-800 p-3 bg-green-50 rounded-md border border-green-200 italic mt-1">
                "{item.volunteerNote}"
            </div>
            <div className="mt-2">
                <EvidenceViewer evidence={item.volunteerEvidence} title="Volunteer Evidence" />
            </div>
        </div>
      </div>
      <div className="border-t pt-6 flex space-x-3">
        <button
          onClick={onApproveClick}
          className="w-full bg-brand-green text-white font-bold py-2 px-4 rounded-md hover:bg-brand-green-dark"
        >
          Approve & Complete Campaign
        </button>
        <button
          onClick={onRejectClick}
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700"
        >
          Reject Report
        </button>
      </div>
    </div>
  );
};


// --- Re-usable Detail Modal for Dashboard Cards ---
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


// Modal Component for Milestone Preview
const MilestonePreviewModal: React.FC<{ milestone: MilestoneInput | null; onClose: () => void; }> = ({ milestone, onClose }) => {
    if (!milestone) return null;
  
    return (
      <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" 
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

// Modal Component for Activity Details
const getLogVisuals = (action: string) => {
  const lowercasedAction = action.toLowerCase();
  if (lowercasedAction.includes('approved') || lowercasedAction.includes('co-signed')) {
    return { Icon: CheckCircleIcon, color: 'text-brand-green-dark' };
  }
  if (lowercasedAction.includes('rejected') || lowercasedAction.includes('deleted')) {
    return { Icon: XCircleIcon, color: 'text-red-600' };
  }
  return { Icon: ClockIcon, color: 'text-yellow-600' };
};

const ActivityDetailModal: React.FC<{ log: AdminActivity | null, onClose: () => void }> = ({ log, onClose }) => {
    if (!log) return null;

    const { Icon, color } = getLogVisuals(log.action);
    const item = log.relatedItem;
    
    let subjectPreview: React.ReactNode = null;
    if (item) {
        if ('organizer' in item) { // PendingCampaign, AssignedCampaign, or CampaignDetail
            subjectPreview = (
                <div className="bg-gray-50 border rounded-md mt-1 p-3 text-sm">
                    <p className="font-bold text-gray-800">{item.title}</p>
                    <p className="text-gray-600">by {item.organizer}</p>
                </div>
            );
        } else if ('milestoneTitle' in item) { // PendingMilestoneRelease
            subjectPreview = (
                <div className="bg-gray-50 border rounded-md mt-1 p-3 text-sm">
                    <p className="font-bold text-gray-800">{item.milestoneTitle}</p>
                    <p className="text-gray-600">Campaign: {item.campaignTitle}</p>
                </div>
            );
        }
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Log Detail</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Action</p>
                        <div className={`flex items-center font-semibold ${color}`}>
                            {Icon && <Icon className="w-5 h-5 mr-2" />}
                            <span>{log.action}</span>
                        </div>
                    </div>

                    {log.rejectionReason && (
                        <div>
                            <p className="text-sm text-gray-500">Reason Provided</p>
                            <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 italic">
                                "{log.rejectionReason}"
                            </div>
                        </div>
                    )}
                    
                    {subjectPreview && (
                        <div>
                            <p className="text-sm text-gray-500">Related Item</p>
                            {subjectPreview}
                        </div>
                    )}

                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500">Timestamp</p>
                        <p className="font-semibold text-gray-800">{log.timestamp} by {log.adminId}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface AdminVerificationQueuePageProps {
  pendingCampaigns: PendingCampaign[];
  pendingReleases: PendingMilestoneRelease[];
  pendingDeletions: PendingDeletionRecommendation[];
  pendingFinalReports: PendingFinalReport[];
  adminLogs: AdminActivity[];
  campaignDetails: CampaignDetail[];
  platformDonations: AggregatedDonation[];
  aggregatedDonors: AggregatedDonor[];
  fundsInEscrow: number;
  onBack: () => void;
  onApproveCampaign: (campaignId: string) => void;
  onRejectCampaign: (campaignId: string, reason: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onDeleteActiveCampaign: (campaignId: string) => void;
  onApproveMilestoneRelease: (releaseId: string) => void;
  onRejectMilestoneRelease: (releaseId: string, reason: string) => void;
  onDismissDeletionRecommendation: (recommendationId: string) => void;
  onAdminRecommendDeletion: (campaign: CampaignDetail, reason: string) => void;
  onAdminApproveFinalReport: (report: PendingFinalReport) => void;
  onAdminRejectFinalReport: (report: PendingFinalReport, reason: string) => void;
}

export const AdminVerificationQueuePage: React.FC<AdminVerificationQueuePageProps> = ({
  pendingCampaigns,
  pendingReleases,
  pendingDeletions,
  pendingFinalReports,
  adminLogs,
  campaignDetails,
  platformDonations,
  aggregatedDonors,
  fundsInEscrow,
  onBack,
  onApproveCampaign,
  onRejectCampaign,
  onDeleteCampaign,
  onDeleteActiveCampaign,
  onApproveMilestoneRelease,
  onRejectMilestoneRelease,
  onDismissDeletionRecommendation,
  onAdminRecommendDeletion,
  onAdminApproveFinalReport,
  onAdminRejectFinalReport,
}) => {
    const combinedQueue = useMemo(() => [...pendingFinalReports, ...pendingDeletions, ...pendingCampaigns, ...pendingReleases], [pendingFinalReports, pendingDeletions, pendingCampaigns, pendingReleases]);
    const [selectedItem, setSelectedItem] = useState<PendingCampaign | PendingMilestoneRelease | PendingDeletionRecommendation | PendingFinalReport | null>(null);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [confirmation, setConfirmation] = useState<{
        title: string;
        message: string;
        confirmText: string;
        confirmColor: 'green' | 'red';
        onConfirm: () => void;
    } | null>(null);
    const [viewingMilestone, setViewingMilestone] = useState<MilestoneInput | null>(null);
    const [viewingLog, setViewingLog] = useState<AdminActivity | null>(null);
    const [detailModalContent, setDetailModalContent] = useState<{ title: string; data: React.ReactNode } | null>(null);
    const [campaignToRecommend, setCampaignToRecommend] = useState<CampaignDetail | null>(null);
    const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);


    // --- Dashboard Stat Calculations ---
    const pendingApprovals = combinedQueue.length;
    const activeCampaigns = campaignDetails.filter(c => c.status === 'Live');
    const verifiedNgos = [...new Set(campaignDetails.filter(c => c.isVerified).map(c => c.organizer))];
    const completedCampaigns = campaignDetails.filter(c => c.status === 'Completed');

    useEffect(() => {
        if (!selectedItem && combinedQueue.length > 0) {
            setSelectedItem(combinedQueue[0]);
        } else if (selectedItem && !combinedQueue.find(item => item.id === selectedItem.id)) {
            setSelectedItem(combinedQueue.length > 0 ? combinedQueue[0] : null);
        }
    }, [combinedQueue, selectedItem]);
    
    const handleConfirmRejection = (reason: string) => {
        if (!selectedItem) return;
        if ('ngoReport' in selectedItem) {
            onAdminRejectFinalReport(selectedItem, reason);
        } else if ('organizer' in selectedItem) {
            onRejectCampaign(selectedItem.id, reason);
        } else if ('milestoneTitle' in selectedItem) {
            onRejectMilestoneRelease(selectedItem.id, reason);
        }
        setIsRejectionModalOpen(false);
    };

    const handleSubmitRecommendation = (reason: string) => {
        if (campaignToRecommend) {
            onAdminRecommendDeletion(campaignToRecommend, reason);
            setCampaignToRecommend(null); // Close reason modal
            setDetailModalContent(null); // Close parent modal
        }
    };

     // --- Click Handlers for Dashboard Cards ---
    const handleShowPending = () => {
        setDetailModalContent({
            title: "Pending Approvals",
            data: (
                <ul className="space-y-3 p-4">
                    {combinedQueue.map(item => (
                         <li key={item.id} className="p-3 bg-gray-50 rounded-md border">
                            <span
                                className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full mb-1 inline-block ${
                                    'ngoReport' in item ? 'bg-blue-100 text-blue-800' :
                                    'recommender' in item ? 'bg-red-100 text-red-800' :
                                    'organizer' in item ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                }`}
                            >
                                {'ngoReport' in item ? 'Final Report' : 'recommender' in item ? 'Deletion' : 'organizer' in item ? 'Campaign' : 'Milestone'}
                            </span>
                            <p className="font-semibold text-gray-800">{'organizer' in item ? item.title : 'milestoneTitle' in item ? item.milestoneTitle : 'campaign' in item ? item.campaign.title : item.campaignTitle}</p>
                         </li>
                    ))}
                </ul>
            ),
        });
    };
    
    const handleShowActive = () => {
         setDetailModalContent({
            title: "Active Campaigns Overview",
            data: <CampaignPreviewDetail campaigns={activeCampaigns} />,
        });
    };
     const handleShowEscrow = () => {
         setDetailModalContent({
            title: "Funds Raised per Campaign",
            data: (
                <ul className="space-y-3 p-4">
                    {activeCampaigns.map(c => (
                        <li key={c.id} className="p-3 bg-gray-50 rounded-md border flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800">{c.title}</p>
                                <p className="text-sm text-gray-500">Goal: ₱{c.goal.toLocaleString()}</p>
                            </div>
                             <span className="text-sm font-bold text-brand-blue">₱{c.raised.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            ),
        });
    };
     const handleShowNgos = () => {
         setDetailModalContent({
            title: "Verified NGOs",
            data: (
                <ul className="space-y-3 p-4">
                    {verifiedNgos.map(ngo => (
                        <li key={ngo} className="p-3 bg-gray-50 rounded-md border font-semibold text-gray-800">
                           {ngo}
                        </li>
                    ))}
                </ul>
            ),
        });
    };
     const handleShowCompleted = () => {
         setDetailModalContent({
            title: "Completed Campaigns",
            data: (
                <ul className="space-y-3 p-4">
                    {completedCampaigns.map(c => (
                         <li key={c.id} className="p-3 bg-gray-50 rounded-md border flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800">{c.title}</p>
                                <p className="text-sm text-gray-500">by {c.organizer}</p>
                            </div>
                            <span className="text-sm font-bold text-brand-green-dark">₱{c.raised.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            ),
        });
    };

    const renderDetailView = () => {
        if (!selectedItem) {
            return (
                <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-lg p-6 text-center">
                    <div>
                        <CheckCircleIcon className="w-12 h-12 text-brand-green mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-brand-gray-dark">Queue Clear!</h3>
                        <p className="text-brand-gray mt-2">All pending items have been reviewed.</p>
                    </div>
                </div>
            );
        }

        if ('ngoReport' in selectedItem) { // Final Report
            return (
                <FinalReportApprovalDetail
                    item={selectedItem}
                    onApproveClick={() => setConfirmation({
                        title: 'Approve Final Report?',
                        message: `This will mark the campaign "${selectedItem.campaignTitle}" as completed. This action is final.`,
                        confirmText: 'Approve & Complete',
                        confirmColor: 'green',
                        onConfirm: () => onAdminApproveFinalReport(selectedItem as PendingFinalReport),
                    })}
                    onRejectClick={() => setIsRejectionModalOpen(true)}
                />
            );
        }
        
        if ('recommender' in selectedItem) { // Deletion Recommendation
            const item = selectedItem as PendingDeletionRecommendation;
            return (
                <DeletionRecommendationDetail 
                    item={item}
                    onDeleteClick={() => setConfirmation({
                        title: 'Confirm Campaign Deletion?',
                        message: `Are you sure you want to permanently delete the active campaign "${item.campaign.title}" based on the volunteer's recommendation? This action is irreversible.`,
                        confirmText: 'Delete Campaign',
                        confirmColor: 'red',
                        onConfirm: () => onDeleteActiveCampaign(item.campaign.id),
                    })}
                    onDismissClick={() => setConfirmation({
                        title: 'Dismiss Deletion Recommendation?',
                        message: `Are you sure you want to dismiss this deletion recommendation for "${item.campaign.title}"? The campaign will remain active.`,
                        confirmText: 'Dismiss',
                        confirmColor: 'green',
                        onConfirm: () => onDismissDeletionRecommendation(item.id),
                    })}
                />
            );
        }

        if ('organizer' in selectedItem) { // Campaign Approval
             const item = selectedItem as PendingCampaign;
            return (
                <CampaignApprovalDetail 
                    item={item} 
                    onApproveClick={() => setConfirmation({
                        title: 'Approve Campaign?',
                        message: `Are you sure you want to approve "${item.title}"? This will make the campaign live and able to receive donations.`,
                        confirmText: 'Approve',
                        confirmColor: 'green',
                        onConfirm: () => onApproveCampaign(item.id),
                    })}
                    onRejectClick={() => setIsRejectionModalOpen(true)}
                    onDeleteClick={() => setConfirmation({
                        title: 'Delete Submission?',
                        message: `Are you sure you want to delete the campaign submission for "${item.title}"? This action is irreversible.`,
                        confirmText: 'Delete',
                        confirmColor: 'red',
                        onConfirm: () => onDeleteCampaign(item.id),
                    })}
                    onSelectMilestone={setViewingMilestone}
                />
            );
        }

        if ('milestoneTitle' in selectedItem) { // Milestone Release
            const item = selectedItem as PendingMilestoneRelease;
             return (
                <MilestoneReleaseDetail 
                    item={item}
                    onApproveClick={() => setConfirmation({
                        title: 'Approve Fund Release?',
                        message: `Are you sure you want to approve the release of ₱${item.amount.toLocaleString()} for the milestone "${item.milestoneTitle}"?`,
                        confirmText: 'Approve & Release',
                        confirmColor: 'green',
                        onConfirm: () => onApproveMilestoneRelease(item.id),
                    })}
                    onRejectClick={() => setIsRejectionModalOpen(true)}
                />
            );
        }
        
        return null;
    };


    return (
        <>
        <style>{`
            @keyframes fade-in-scale {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-scale {
              animation: fade-in-scale 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
            }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-gray hover:text-brand-gray-dark mb-4">
                    <ChevronLeftIcon className="w-5 h-5 mr-1"/>
                    Back to Main Dashboard
                </button>
                <h1 className="text-4xl font-bold text-brand-gray-dark">Admin Dashboard</h1>
                <p className="text-lg text-brand-gray mt-1">Review and approve new campaigns and milestone fund releases.</p>
            </header>

            {/* --- Dashboard Stat Cards --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <AdminStatCard icon={<ClipboardDocumentCheckIcon className="w-6 h-6"/>} label="Pending Approvals" value={pendingApprovals} onClick={handleShowPending} />
                <AdminStatCard icon={<CubeTransparentIcon className="w-6 h-6"/>} label="Active Campaigns" value={activeCampaigns.length} onClick={handleShowActive} />
                <AdminStatCard icon={<CurrencyDollarIcon className="w-6 h-6"/>} label="Funds in Escrow" value={`₱${(fundsInEscrow / 1000).toFixed(0)}k`} onClick={handleShowEscrow} />
                <AdminStatCard icon={<UsersIcon className="w-6 h-6"/>} label="Verified NGOs" value={verifiedNgos.length} onClick={handleShowNgos} />
                <AdminStatCard icon={<TrophyIcon className="w-6 h-6"/>} label="Completed Campaigns" value={completedCampaigns.length} onClick={handleShowCompleted} />
                <AdminStatCard icon={<UsersIcon className="w-6 h-6"/>} label="Total Donors" value={aggregatedDonors.length} onClick={() => setIsDonorModalOpen(true)} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-2xl font-bold text-brand-gray-dark mb-2">Pending Items ({combinedQueue.length})</h2>
                        <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                            {combinedQueue.map(item => (
                                <ApprovalQueueItem
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedItem?.id === item.id}
                                    onSelect={setSelectedItem}
                                />
                            ))}
                        </ul>
                    </div>
                    <AdminActivityLog logs={adminLogs} onSelectLog={setViewingLog} />
                    <PlatformDonationFeed donations={platformDonations} />
                </aside>

                <main className="lg:col-span-2">
                    {renderDetailView()}
                </main>
            </div>
        </div>
        <RejectionModal 
            isOpen={isRejectionModalOpen}
            onClose={() => setIsRejectionModalOpen(false)}
            onConfirm={handleConfirmRejection}
            title={selectedItem && ('organizer' in selectedItem) ? "Reject Campaign" : "Reject Item"}
        />
        {confirmation && (
            <ConfirmationModal
                isOpen={true}
                onClose={() => setConfirmation(null)}
                title={confirmation.title}
                message={confirmation.message}
                confirmText={confirmation.confirmText}
                confirmColor={confirmation.confirmColor}
                onConfirm={() => {
                    confirmation.onConfirm();
                    setConfirmation(null);
                }}
            />
        )}
        {campaignToRecommend && (
            <ReasonModal
                title={`Recommend Deletion for "${campaignToRecommend.title}"`}
                onClose={() => setCampaignToRecommend(null)}
                onSubmit={handleSubmitRecommendation}
            />
        )}
        <MilestonePreviewModal milestone={viewingMilestone} onClose={() => setViewingMilestone(null)} />
        <ActivityDetailModal log={viewingLog} onClose={() => setViewingLog(null)} />
        {detailModalContent && (
            <DashboardDetailModal 
                title={detailModalContent.title}
                onClose={() => setDetailModalContent(null)}
            >
                {detailModalContent.data}
            </DashboardDetailModal>
        )}
        <DonorListModal donors={aggregatedDonors} isOpen={isDonorModalOpen} onClose={() => setIsDonorModalOpen(false)} />
        </>
    );
};