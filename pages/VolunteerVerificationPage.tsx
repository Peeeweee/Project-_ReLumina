import React, { useState, useEffect, useMemo } from 'react';
import { AssignedMilestone, AssignedCampaign, VolunteerActivity, MilestoneInput, VolunteerRelatedItem, PendingMilestoneRelease, CampaignDetail, AggregatedDonation, AssignedDeletionRecommendation, AggregatedDonor, AssignedFinalReport, EvidenceItem } from '../types';
import { ChevronLeftIcon, CheckCircleIcon, LocationPinIcon, DocumentTextIcon, CameraIcon, ArrowTopRightOnSquareIcon, ClipboardDocumentCheckIcon, XMarkIcon, ClockIcon, XCircleIcon, CubeTransparentIcon, CurrencyDollarIcon, TrophyIcon, TrashIcon, UsersIcon } from '../components/icons';
import { AssignedMilestoneCard } from '../components/AssignedMilestoneCard';
import { VolunteerActivityFeed } from '../components/VolunteerActivityFeed';
import { AdminStatCard } from '../components/admin_controls/AdminStatCard';
import { PlatformDonationFeed } from '../components/PlatformDonationFeed';
import { CampaignPreviewDetail } from '../components/CampaignPreviewDetail';
import { DonorListModal } from '../components/DonorListModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { EvidenceUploader } from '../components/EvidenceUploader';
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
                    <p className="text-sm text-gray-500 mt-1">Please provide a clear reason for your recommendation. This will be sent to an admin for review.</p>
                </div>
                <div className="p-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={5}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="e.g., I visited the site and the campaign's claimed activities are not happening..."
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


// --- Sub-component for Campaign Verification Card ---
const AssignedCampaignCard: React.FC<{
  campaign: AssignedCampaign;
  onSelect: (item: AssignedCampaign) => void;
  isSelected: boolean;
}> = ({ campaign, onSelect, isSelected }) => {
  return (
    <article
      onClick={() => onSelect(campaign)}
      className={`bg-white rounded-lg shadow overflow-hidden transition-all duration-300 cursor-pointer flex flex-col group ${
        isSelected ? 'ring-2 ring-brand-blue shadow-lg scale-105' : 'hover:shadow-xl hover:scale-105'
      }`}
      aria-labelledby={`campaign-title-${campaign.id}`}
    >
      <div className="overflow-hidden">
        <img
          src={campaign.imageUrl}
          alt={`Image for ${campaign.title}`}
          className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 self-start mb-2">New Campaign</p>
        <h4 id={`campaign-title-${campaign.id}`} className="text-md font-bold text-brand-gray-dark mb-2">
          {campaign.title}
        </h4>
        <div className="mt-auto space-y-2">
           <div className="flex items-center text-xs text-brand-gray">
              <LocationPinIcon className="w-3 h-3 mr-1" />
              <span>{campaign.location}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-brand-blue">₱{campaign.goal.toLocaleString()}</span>
            <span className="text-xs text-brand-gray"> Goal</span>
          </div>
        </div>
      </div>
    </article>
  );
};

// --- New Component: AssignedDeletionCard ---
const AssignedDeletionCard: React.FC<{
  recommendation: AssignedDeletionRecommendation;
  onSelect: (item: AssignedDeletionRecommendation) => void;
  isSelected: boolean;
}> = ({ recommendation, onSelect, isSelected }) => {
  return (
    <article
      onClick={() => onSelect(recommendation)}
      className={`bg-white rounded-lg shadow overflow-hidden transition-all duration-300 cursor-pointer flex flex-col group ${
        isSelected ? 'ring-2 ring-red-500 shadow-lg scale-105' : 'hover:shadow-xl hover:scale-105'
      }`}
      aria-labelledby={`recommendation-title-${recommendation.id}`}
    >
      <div className="p-4 flex flex-col flex-grow border-l-4 border-red-500">
        <p className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800 self-start mb-2">Deletion Review</p>
        <h4 id={`recommendation-title-${recommendation.id}`} className="text-md font-bold text-brand-gray-dark mb-2">
          {recommendation.campaign.title}
        </h4>
        <div className="mt-auto space-y-2">
           <div className="flex items-center text-xs text-brand-gray">
              <LocationPinIcon className="w-3 h-3 mr-1" />
              <span>{recommendation.campaign.location}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

// --- New Component: AssignedFinalReportCard ---
const AssignedFinalReportCard: React.FC<{
  report: AssignedFinalReport;
  onSelect: (item: AssignedFinalReport) => void;
  isSelected: boolean;
}> = ({ report, onSelect, isSelected }) => {
  return (
    <article
      onClick={() => onSelect(report)}
      className={`bg-white rounded-lg shadow overflow-hidden transition-all duration-300 cursor-pointer flex flex-col group ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg scale-105' : 'hover:shadow-xl hover:scale-105'
      }`}
      aria-labelledby={`report-title-${report.id}`}
    >
      <div className="p-4 flex flex-col flex-grow border-l-4 border-blue-500">
        <p className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 self-start mb-2">Final Report Review</p>
        <h4 id={`report-title-${report.id}`} className="text-md font-bold text-brand-gray-dark mb-2">
          {report.campaignTitle}
        </h4>
        <div className="mt-auto space-y-2">
           <div className="flex items-center text-xs text-brand-gray">
              <LocationPinIcon className="w-3 h-3 mr-1" />
              <span>{report.location}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

const VerificationDetailView: React.FC<{
    milestone: AssignedMilestone;
    onSubmit: (report: string, evidence: EvidenceItem[]) => void;
}> = ({ milestone, onSubmit }) => {
    const [report, setReport] = React.useState('');
    const [evidence, setEvidence] = React.useState<EvidenceItem[]>([]);

    const handleSubmit = () => {
        if (!report || evidence.length === 0) {
            alert('Please provide a report and upload at least one piece of evidence.');
            return;
        }
        onSubmit(report, evidence);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div>
                <p className="text-sm text-brand-gray">{milestone.campaignTitle}</p>
                <h2 className="text-2xl font-bold text-brand-gray-dark">{milestone.milestoneTitle}</h2>
                <p className="text-lg font-semibold text-brand-blue">Target: ₱{milestone.targetAmount.toLocaleString()}</p>
            </div>
             <div className="space-y-4">
                 <div>
                    <label htmlFor="report" className="flex items-center text-lg font-semibold text-brand-gray-dark mb-2">
                        <DocumentTextIcon className="w-5 h-5 mr-2" />
                        Verification Report
                    </label>
                    <textarea 
                        id="report" 
                        rows={6} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" 
                        placeholder="Describe your findings. How were the funds used? Provide specific details to validate the milestone's completion."
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                    />
                </div>
                 <div>
                    <label className="flex items-center text-lg font-semibold text-brand-gray-dark mb-2">
                       <CameraIcon className="w-5 h-5 mr-2" />
                       Evidence
                    </label>
                    <EvidenceUploader onEvidenceChange={setEvidence} />
                </div>
            </div>
            <div className="border-t pt-4">
                <button 
                    onClick={handleSubmit}
                    disabled={!report || evidence.length === 0}
                    className="w-full text-center bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Submit Verification Report
                </button>
                 <p className="text-xs text-center text-gray-500 mt-2">Your report will be sent to a ReLumina admin for co-signing before funds are released.</p>
            </div>
        </div>
    );
};


// --- Sub-component for Campaign Verification Detail View ---
const CampaignVerificationDetailView: React.FC<{
  campaign: AssignedCampaign;
  onSubmit: (report: string, evidence: EvidenceItem[]) => void;
  onSelectMilestone: (milestone: MilestoneInput) => void;
}> = ({ campaign, onSubmit, onSelectMilestone }) => {
    const [report, setReport] = useState('');
    const [evidence, setEvidence] = useState<EvidenceItem[]>([]);

    const handleSubmit = () => {
        if (!report || evidence.length === 0) {
            alert('Please provide a report and upload evidence.');
            return;
        }
        onSubmit(report, evidence);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div>
                <p className="text-sm text-brand-gray">New Campaign Verification</p>
                <h2 className="text-2xl font-bold text-brand-gray-dark">{campaign.title}</h2>
                <p className="text-sm text-gray-500">by {campaign.organizer}</p>
                <p className="text-lg font-semibold text-brand-blue">Goal: ₱{campaign.goal.toLocaleString()}</p>
            </div>
             <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold text-gray-700 flex items-center"><DocumentTextIcon className="w-5 h-5 mr-2" /> Submitted Documents</h3>
                <ul className="list-disc list-inside">
                {campaign.documents.map((doc) => (
                    <li key={doc.name}>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-sm text-brand-blue hover:underline">
                        <span>{doc.name}</span>
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </a>
                    </li>
                ))}
                </ul>
            </div>
            
            {campaign.milestones && campaign.milestones.length > 0 && (
                <div className="border-t pt-4 space-y-2">
                    <h3 className="font-semibold text-gray-700 flex items-center"><ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" /> Proposed Milestones</h3>
                    <div className="space-y-2">
                        {campaign.milestones.map((milestone, index) => (
                            <button 
                                key={index}
                                onClick={() => onSelectMilestone(milestone)}
                                className="w-full flex justify-between items-center p-2 bg-gray-50 rounded-md border text-sm text-left transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-[1.02]"
                            >
                                <span className="font-medium text-gray-800">{milestone.title}</span>
                                <span className="font-bold text-brand-blue">₱{Number(milestone.target).toLocaleString()}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                 <div>
                    <label htmlFor="report" className="flex items-center text-lg font-semibold text-brand-gray-dark mb-2">
                        <DocumentTextIcon className="w-5 h-5 mr-2" />
                        Verification Report
                    </label>
                    <textarea 
                        id="report" 
                        rows={6} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" 
                        placeholder="Verify the legitimacy of the organizer and the campaign's objective. Provide your on-the-ground assessment."
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                    />
                </div>
                 <div>
                    <label className="flex items-center text-lg font-semibold text-brand-gray-dark mb-2">
                       <CameraIcon className="w-5 h-5 mr-2" />
                       Evidence
                    </label>
                     <p className="text-xs text-gray-500 mb-2">Upload a photo of the location, relevant documents, or the team to support your verification.</p>
                     <EvidenceUploader onEvidenceChange={setEvidence} />
                </div>
            </div>
            
            <div className="border-t pt-4">
                <button 
                    onClick={handleSubmit}
                    disabled={!report || evidence.length === 0}
                    className="w-full text-center bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Submit Verification Report
                </button>
                 <p className="text-xs text-center text-gray-500 mt-2">Your report will be sent to a ReLumina admin for approval before the campaign goes live.</p>
            </div>
        </div>
    );
};

// --- New Component: DeletionVerificationDetailView ---
const DeletionVerificationDetailView: React.FC<{
  recommendation: AssignedDeletionRecommendation;
  onSubmit: (volunteerNote: string, evidence: EvidenceItem[]) => void;
}> = ({ recommendation, onSubmit }) => {
    const [volunteerNote, setVolunteerNote] = React.useState('');
    const [evidence, setEvidence] = React.useState<EvidenceItem[]>([]);
    const recommenderType = recommendation.recommenderInfo.startsWith('Admin') ? "Admin's" : "NGO's";

    const handleSubmit = () => {
        if (!volunteerNote) {
            alert('Please provide your assessment before approving.');
            return;
        }
        onSubmit(volunteerNote, evidence);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 border-t-4 border-red-500">
            <div>
                <p className="text-sm font-semibold text-red-600">DELETION VERIFICATION REQUEST</p>
                <h2 className="text-2xl font-bold text-brand-gray-dark">{recommendation.campaign.title}</h2>
                <p className="text-sm text-gray-500">by {recommendation.campaign.organizer}</p>
            </div>
            <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold text-gray-700">{recommenderType} Reason for Deletion</h3>
                <div className="text-sm text-gray-800 p-3 bg-red-50 rounded-md border border-red-200 italic">
                    "{recommendation.reason}"
                </div>
            </div>
            <div>
                <label htmlFor="volunteer-assessment" className="flex items-center text-lg font-semibold text-brand-gray-dark mb-2">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Your Assessment
                </label>
                <textarea 
                    id="volunteer-assessment" 
                    rows={4} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" 
                    placeholder="Provide your assessment. Do you agree with this deletion recommendation based on your on-the-ground knowledge? This will be sent to the admin for final review."
                    value={volunteerNote}
                    onChange={(e) => setVolunteerNote(e.target.value)}
                />
            </div>
             <div>
                <label className="flex items-center text-lg font-semibold text-brand-gray-dark mb-2">
                   <CameraIcon className="w-5 h-5 mr-2" />
                   Add Evidence (Optional)
                </label>
                <EvidenceUploader onEvidenceChange={setEvidence} />
            </div>
            <div className="border-t pt-4">
                <button 
                    onClick={handleSubmit}
                    disabled={!volunteerNote}
                    className="w-full text-center bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Approve Deletion Recommendation
                </button>
                 <p className="text-xs text-center text-gray-500 mt-2">Approving this will forward your assessment to an admin for the final decision to delete the campaign.</p>
            </div>
        </div>
    );
};

// --- New Component: FinalReportVerificationDetailView ---
const FinalReportVerificationDetailView: React.FC<{
  report: AssignedFinalReport;
  onSubmit: (volunteerNote: string, evidence: EvidenceItem[]) => void;
}> = ({ report: assignedReport, onSubmit }) => {
    const [volunteerNote, setVolunteerNote] = useState('');
    const [evidence, setEvidence] = useState<EvidenceItem[]>([]);

    const handleSubmit = async () => {
        if (!volunteerNote || evidence.length === 0) {
            alert('Please provide your assessment of the NGO final report and add evidence.');
            return;
        }
        onSubmit(volunteerNote, evidence);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 border-t-4 border-blue-500">
            <div>
                <p className="text-sm font-semibold text-blue-600">FINAL REPORT VERIFICATION</p>
                <h2 className="text-2xl font-bold text-brand-gray-dark">{assignedReport.campaignTitle}</h2>
            </div>
            <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold text-gray-700">NGO's Final Report</h3>
                <div className="text-sm text-gray-800 p-3 bg-blue-50 rounded-md border border-blue-200 italic">
                    "{assignedReport.ngoReport}"
                </div>
                <EvidenceViewer evidence={assignedReport.ngoEvidence} title="NGO Evidence" />
            </div>
            <div>
                <label htmlFor="volunteer-assessment" className="flex items-center text-lg font-semibold text-brand-gray-dark mb-2">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Your Assessment
                </label>
                <textarea 
                    id="volunteer-assessment" 
                    rows={4} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" 
                    placeholder="Provide your final assessment. Does the NGO's report accurately reflect the campaign's outcome? This will be sent to the admin for final approval."
                    value={volunteerNote}
                    onChange={(e) => setVolunteerNote(e.target.value)}
                />
            </div>
            <div>
                <label className="flex items-center text-lg font-semibold text-brand-gray-dark mb-2">
                   <CameraIcon className="w-5 h-5 mr-2" />
                   Your Verifying Evidence
                </label>
                <EvidenceUploader onEvidenceChange={setEvidence} />
            </div>
            <div className="border-t pt-4">
                <button 
                    onClick={handleSubmit}
                    disabled={!volunteerNote || evidence.length === 0}
                    className="w-full text-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-400"
                >
                    Submit Final Verification
                </button>
                 <p className="text-xs text-center text-gray-500 mt-2">Your assessment will be sent to an admin for the final decision to complete the campaign.</p>
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

const getStatusVisuals = (status: VolunteerActivity['status']) => {
    switch (status) {
      case 'approved':
        return { Icon: CheckCircleIcon, color: 'text-brand-green-dark' };
      case 'rejected':
        return { Icon: XCircleIcon, color: 'text-red-600' };
      case 'pending':
        return { Icon: ClockIcon, color: 'text-yellow-600' };
      default:
        return { Icon: null, color: 'text-gray-800' };
    }
};

// Modal Component for Activity Details
const ActivityDetailModal: React.FC<{ activity: VolunteerActivity | null; onClose: () => void; }> = ({ activity, onClose }) => {
    if (!activity) return null;
  
    const isCampaignRelated = activity.relatedItem && ('organizer' in activity.relatedItem);
    const isMilestoneRelated = activity.relatedItem && ('milestoneTitle' in activity.relatedItem);
    const isDeletionRelated = activity.relatedItem && ('recommenderInfo' in activity.relatedItem);
    const { Icon, color } = getStatusVisuals(activity.status);
    
    let subjectPreview: React.ReactNode = null;

    if (isDeletionRelated) {
        const item = activity.relatedItem as AssignedDeletionRecommendation;
        subjectPreview = (
             <div className="bg-gray-50 border border-gray-200 rounded-md mt-1 overflow-hidden">
                <div className="px-3 py-2 border-b bg-red-50/50">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                        Deletion Verification
                    </span>
                </div>
                <div className="p-3 text-sm space-y-1">
                    <p className="font-bold text-gray-800">{item.campaign.title}</p>
                    <p className="text-gray-600">by {item.campaign.organizer}</p>
                </div>
            </div>
        );
    } else if (isCampaignRelated) {
        const item = activity.relatedItem as AssignedCampaign;
        subjectPreview = (
            <div className="bg-gray-50 border border-gray-200 rounded-md mt-1 overflow-hidden">
                <div className="px-3 py-2 border-b bg-yellow-50/50">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                        Campaign Verification
                    </span>
                </div>
                <div className="p-3 text-sm space-y-1">
                    <p className="font-bold text-gray-800">{item.title}</p>
                    <p className="text-gray-600">by {item.organizer}</p>
                    <p className="font-semibold text-brand-blue pt-1">
                        Goal: ₱{item.goal.toLocaleString()}
                    </p>
                </div>
            </div>
        );
    } else if (isMilestoneRelated) {
        const item = activity.relatedItem as AssignedMilestone | PendingMilestoneRelease;
        const amount = 'targetAmount' in item ? item.targetAmount : item.amount;
        subjectPreview = (
            <div className="bg-gray-50 border border-gray-200 rounded-md mt-1 overflow-hidden">
                <div className="px-3 py-2 border-b bg-green-50/50">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                        Milestone Verification
                    </span>
                </div>
                <div className="p-3 text-sm space-y-1">
                    <p className="font-bold text-gray-800">{item.milestoneTitle}</p>
                    <p className="text-gray-600">Campaign: {item.campaignTitle}</p>
                    <p className="font-semibold text-brand-blue pt-1">
                        Amount: ₱{amount.toLocaleString()}
                    </p>
                </div>
            </div>
        );
    }


    return (
      <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" 
          onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Activity Detail</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                  <XMarkIcon className="w-6 h-6" />
              </button>
          </div>
          <div className="p-6 space-y-4">
              <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className={`flex items-center font-semibold ${color}`}>
                      {Icon && <Icon className="w-5 h-5 mr-2" />}
                      <span className="capitalize">{activity.status}</span>
                  </div>
                  <p className="mt-2 text-gray-800">{activity.description}</p>
              </div>
  
              {activity.rejectionReason && (
                  <div>
                      <p className="text-sm text-gray-500">Admin's Reason</p>
                      <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 italic">
                          "{activity.rejectionReason}"
                      </div>
                  </div>
              )}
  
              {subjectPreview && (
                  <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      {subjectPreview}
                  </div>
              )}
              
              <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Timestamp</p>
                  <p className="font-semibold text-gray-800">{activity.timestamp}</p>
              </div>
          </div>
        </div>
      </div>
    );
};



interface VolunteerVerificationPageProps {
  assignedMilestones: AssignedMilestone[];
  assignedCampaigns: AssignedCampaign[];
  assignedDeletions: AssignedDeletionRecommendation[];
  assignedFinalReports: AssignedFinalReport[];
  volunteerActivities: VolunteerActivity[];
  campaignDetails: CampaignDetail[];
  platformDonations: AggregatedDonation[];
  aggregatedDonors: AggregatedDonor[];
  fundsInEscrow: number;
  onBack: () => void;
  onVolunteerMilestoneSubmit: (assignedMilestone: AssignedMilestone, report: string, evidence: EvidenceItem[]) => Promise<void>;
  onVolunteerCampaignSubmit: (assignedCampaign: AssignedCampaign, report: string, evidence: EvidenceItem[]) => Promise<void>;
  onVolunteerApproveDeletion: (recommendation: AssignedDeletionRecommendation, volunteerNote: string, evidence: EvidenceItem[]) => Promise<void>;
  onVolunteerVerifyFinalReport: (report: AssignedFinalReport, volunteerNote: string, evidence: EvidenceItem[]) => Promise<void>;
  onRecommendDeletion: (campaign: CampaignDetail, reason: string, evidence: EvidenceItem[]) => void;
}

export const VolunteerVerificationPage: React.FC<VolunteerVerificationPageProps> = ({ 
    assignedMilestones, 
    assignedCampaigns,
    assignedDeletions,
    assignedFinalReports,
    volunteerActivities,
    campaignDetails,
    platformDonations,
    aggregatedDonors,
    fundsInEscrow,
    onBack,
    onVolunteerMilestoneSubmit,
    onVolunteerCampaignSubmit,
    onVolunteerApproveDeletion,
    onVolunteerVerifyFinalReport,
    onRecommendDeletion
}) => {
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success'>('idle');
  const combinedQueue = useMemo(() => [...assignedCampaigns, ...assignedDeletions, ...assignedFinalReports, ...assignedMilestones], [assignedCampaigns, assignedDeletions, assignedFinalReports, assignedMilestones]);
  const [selectedItem, setSelectedItem] = useState<AssignedMilestone | AssignedCampaign | AssignedDeletionRecommendation | AssignedFinalReport | null>(null);
  const [viewingMilestone, setViewingMilestone] = useState<MilestoneInput | null>(null);
  const [viewingActivity, setViewingActivity] = useState<VolunteerActivity | null>(null);
  const [detailModalContent, setDetailModalContent] = useState<{ title: string; data: React.ReactNode } | null>(null);
  const [campaignToRecommendDelete, setCampaignToRecommendDelete] = useState<CampaignDetail | null>(null);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    message: string;
    confirmText: string;
    confirmColor: 'green' | 'red';
    onConfirm: () => void;
  } | null>(null);


  useEffect(() => {
    if (!selectedItem && combinedQueue.length > 0) {
      setSelectedItem(combinedQueue[0]);
    } else if (combinedQueue.length === 0) {
      setSelectedItem(null);
    }
  }, [combinedQueue, selectedItem]);

    // --- Dashboard Stat Calculations ---
    const {
        pendingVerifications,
        activeCampaigns,
        completedCampaigns
    } = useMemo(() => {
        const active = campaignDetails.filter(c => c.status === 'Live');
        const completed = campaignDetails.filter(c => c.status === 'Completed');
        return {
            pendingVerifications: combinedQueue.length,
            activeCampaigns: active,
            completedCampaigns: completed,
        }
    }, [campaignDetails, combinedQueue]);


  const handleSelectItem = (item: AssignedMilestone | AssignedCampaign | AssignedDeletionRecommendation | AssignedFinalReport) => {
      setSelectedItem(item);
      setSubmissionStatus('idle'); // Reset status when a new item is selected
  };

    const handleSubmissionClick = (report: string, evidence: EvidenceItem[]) => {
        if (!selectedItem) return;

        const onConfirm = async () => {
            if ('milestoneTitle' in selectedItem) { // Milestone submission
                await onVolunteerMilestoneSubmit(selectedItem as AssignedMilestone, report, evidence);
            } else if ('organizer' in selectedItem) { // Campaign submission
                await onVolunteerCampaignSubmit(selectedItem as AssignedCampaign, report, evidence);
            }
            setSubmissionStatus('success');
        };
        
        const isCampaign = 'organizer' in selectedItem;
        setConfirmation({
            title: isCampaign ? 'Submit Campaign Verification?' : 'Submit Milestone Verification?',
            message: isCampaign 
                ? `Are you sure you want to submit your verification for the campaign "${(selectedItem as AssignedCampaign).title}"? This will be sent to an admin for approval.`
                : `Are you sure you want to submit your verification report for "${(selectedItem as AssignedMilestone).milestoneTitle}"? This will be sent to an admin for final review.`,
            confirmText: 'Submit Report',
            confirmColor: 'green',
            onConfirm: onConfirm,
        });
    };

    const handleDeletionApprovalClick = (volunteerNote: string, evidence: EvidenceItem[]) => {
        if (!selectedItem || !('recommenderInfo' in selectedItem)) return;

        const onConfirm = async () => {
            await onVolunteerApproveDeletion(selectedItem as AssignedDeletionRecommendation, volunteerNote, evidence);
            setSubmissionStatus('success');
        };

        setConfirmation({
            title: 'Approve Deletion Recommendation?',
            message: `This will forward your assessment to an admin for the final decision to delete the campaign "${(selectedItem as AssignedDeletionRecommendation).campaign.title}".`,
            confirmText: 'Approve Deletion',
            confirmColor: 'red',
            onConfirm: onConfirm,
        });
    };

    const handleFinalReportVerificationClick = (volunteerNote: string, evidence: EvidenceItem[]) => {
        if (!selectedItem || !('ngoReport' in selectedItem)) return;

        const onConfirm = async () => {
            await onVolunteerVerifyFinalReport(selectedItem as AssignedFinalReport, volunteerNote, evidence);
            setSubmissionStatus('success');
        };

        setConfirmation({
            title: 'Submit Final Verification?',
            message: `Your assessment will be sent to an admin for the final decision to complete the campaign "${(selectedItem as AssignedFinalReport).campaignTitle}".`,
            confirmText: 'Submit Verification',
            confirmColor: 'green',
            onConfirm: onConfirm,
        });
    };

   const handleSubmitRecommendation = (reason: string) => {
        if (campaignToRecommendDelete) {
            onRecommendDeletion(campaignToRecommendDelete, reason, []); // Evidence is optional for initial recommendation
            setCampaignToRecommendDelete(null); // Close the reason modal
            setDetailModalContent(null); // Close the list modal
        }
    };

  const isCampaign = selectedItem && 'organizer' in selectedItem;
  const isDeletion = selectedItem && 'recommenderInfo' in selectedItem;
  const isFinalReport = selectedItem && 'ngoReport' in selectedItem;

  const successMessage = useMemo(() => {
    if (!selectedItem) return '';
    if (isDeletion) {
        return `Your approval for deleting "${(selectedItem as AssignedDeletionRecommendation).campaign.title}" has been sent to the admin queue for final action.`;
    }
    if (isFinalReport) {
        return `Your verification of the final report for "${(selectedItem as AssignedFinalReport).campaignTitle}" has been submitted to an admin for final approval.`;
    }
    return isCampaign
      ? `Your report for the campaign "${(selectedItem as AssignedCampaign).title}" has been sent to the admin queue for final approval.`
      : `Your report for "${(selectedItem as AssignedMilestone).milestoneTitle}" has been sent to the admin queue for final co-signing.`;
  }, [selectedItem, isCampaign, isDeletion, isFinalReport]);

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
                Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-brand-gray-dark">Volunteer Dashboard</h1>
            <p className="text-lg text-brand-gray mt-1">Verify new campaigns and on-the-ground milestones to ensure transparency. Check your activity feed for updates on your submissions.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <AdminStatCard icon={<ClipboardDocumentCheckIcon className="w-6 h-6"/>} label="Pending Verifications" value={pendingVerifications} />
            <AdminStatCard icon={<CubeTransparentIcon className="w-6 h-6"/>} label="Active Campaigns" value={activeCampaigns.length} onClick={handleShowActive} />
            <AdminStatCard icon={<CurrencyDollarIcon className="w-6 h-6"/>} label="Funds in Escrow" value={`₱${(fundsInEscrow / 1000).toFixed(0)}k`} onClick={handleShowEscrow} />
            <AdminStatCard icon={<TrophyIcon className="w-6 h-6"/>} label="Completed Campaigns" value={completedCampaigns.length} onClick={handleShowCompleted} />
            <AdminStatCard icon={<UsersIcon className="w-6 h-6"/>} label="Total Donors" value={aggregatedDonors.length} onClick={() => setIsDonorModalOpen(true)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-2xl font-bold text-brand-gray-dark mb-2">Assigned to You ({combinedQueue.length})</h2>
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                        {combinedQueue.map(item => {
                            if ('ngoReport' in item) {
                                return <AssignedFinalReportCard key={item.id} report={item} onSelect={() => handleSelectItem(item)} isSelected={selectedItem?.id === item.id} />
                            } else if ('recommenderInfo' in item && 'reason' in item) { // Is AssignedDeletionRecommendation
                                return <AssignedDeletionCard key={item.id} recommendation={item} onSelect={() => handleSelectItem(item)} isSelected={selectedItem?.id === item.id} />
                            } else if ('milestoneTitle' in item) { // Is AssignedMilestone
                                return <AssignedMilestoneCard key={item.id} milestone={item} onSelect={() => handleSelectItem(item)} isSelected={selectedItem?.id === item.id}/>
                            } else { // Is AssignedCampaign
                                return <AssignedCampaignCard key={item.id} campaign={item as AssignedCampaign} onSelect={() => handleSelectItem(item)} isSelected={selectedItem?.id === item.id} />
                            }
                        })}
                    </div>
                </div>
                <VolunteerActivityFeed 
                    activities={volunteerActivities}
                    onSelectActivity={setViewingActivity}
                />
                <PlatformDonationFeed donations={platformDonations} />
            </aside>
            <main className="lg:col-span-2">
                {submissionStatus === 'success' && selectedItem ? (
                    <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-lg p-6 text-center">
                        <CheckCircleIcon className="w-16 h-16 text-brand-green mb-4" />
                        <h3 className="text-2xl font-bold text-brand-gray-dark">Verification Submitted</h3>
                        <p className="text-brand-gray mt-2 max-w-md">
                            {successMessage} Thank you for ensuring transparency and accountability.
                        </p>
                    </div>
                ) : selectedItem ? (
                    isFinalReport ? (
                        <FinalReportVerificationDetailView report={selectedItem as AssignedFinalReport} onSubmit={handleFinalReportVerificationClick} />
                    ) : isDeletion ? (
                        <DeletionVerificationDetailView recommendation={selectedItem as AssignedDeletionRecommendation} onSubmit={handleDeletionApprovalClick} />
                    ) : isCampaign ? (
                         <CampaignVerificationDetailView 
                            campaign={selectedItem as AssignedCampaign} 
                            onSubmit={handleSubmissionClick}
                            onSelectMilestone={setViewingMilestone}
                        />
                    ) : (
                        <VerificationDetailView 
                            milestone={selectedItem as AssignedMilestone} 
                            onSubmit={handleSubmissionClick}
                        />
                    )
                ) : (
                    <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-lg p-6 text-center">
                        <div>
                            <h3 className="text-xl font-semibold text-brand-gray-dark">Queue Clear!</h3>
                            <p className="text-brand-gray mt-2">
                                There are no campaigns or milestones assigned to you for verification. Check your activity feed for updates on past submissions.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    </div>
    <MilestonePreviewModal milestone={viewingMilestone} onClose={() => setViewingMilestone(null)} />
    <ActivityDetailModal activity={viewingActivity} onClose={() => setViewingActivity(null)} />
     {detailModalContent && (
        <DashboardDetailModal 
            title={detailModalContent.title}
            onClose={() => setDetailModalContent(null)}
        >
            {detailModalContent.data}
        </DashboardDetailModal>
    )}
     {campaignToRecommendDelete && (
        <ReasonModal
            title={`Recommend Deletion for "${campaignToRecommendDelete.title}"`}
            onClose={() => setCampaignToRecommendDelete(null)}
            onSubmit={handleSubmitRecommendation}
        />
    )}
    <DonorListModal donors={aggregatedDonors} isOpen={isDonorModalOpen} onClose={() => setIsDonorModalOpen(false)} />
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
    </>
  );
};