import React, { useState } from 'react';
// FIX: Corrected import path for types
import { CompletedCampaignData, FinalReport } from '../types';
// FIX: Corrected import path for icons
import { CheckCircleIcon, ChevronLeftIcon, XMarkIcon } from '../components/icons';
import { MilestoneTimelineItem } from '../components/MilestoneTimelineItem';
import { ImpactReport } from '../components/ImpactReport';
import { DonorList } from '../components/DonorList';
import { NftMintPanel } from '../components/NftMintPanel';
import { EvidenceViewer } from '../components/EvidenceViewer';

interface CampaignCompletionPageProps {
  campaign: CompletedCampaignData;
  onBack: () => void;
}

const ViewFinalReportModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    campaignTitle: string;
    report: FinalReport | null;
}> = ({ isOpen, onClose, campaignTitle, report }) => {
    if (!isOpen || !report) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Submitted Final Campaign Report</h2>
                    <p className="text-sm text-gray-500 mt-1">For "{campaignTitle}"</p>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <h3 className="block text-sm font-medium text-gray-700 mb-1">Report Narrative</h3>
                        <div className="w-full p-3 border border-gray-200 bg-gray-50 rounded-md whitespace-pre-wrap text-sm text-gray-800 min-h-[120px]">
                            {report.narrative}
                        </div>
                    </div>
                    <div>
                        <EvidenceViewer evidence={report.evidence} title="Final Evidence" />
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Close
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale {
                  animation: fade-in-scale 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                }
            `}</style>
        </div>
    );
};


export const CampaignCompletionPage: React.FC<CampaignCompletionPageProps> = ({ campaign, onBack }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="bg-brand-gray-light min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-gray hover:text-brand-gray-dark mb-4">
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
          <div className="bg-brand-green-light border-l-4 border-brand-green-dark text-brand-green-dark p-4 rounded-r-md">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-brand-green-dark">Campaign Completed!</h1>
                <p>All milestones have been verified and funds released.</p>
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-brand-gray-dark mb-4 text-center">{campaign.title}</h2>
            <p className="text-center text-brand-gray mb-6">Organized by {campaign.organizer} • Completed on {campaign.completionDate}</p>
            <div className="text-center">
                <p className="text-4xl font-bold text-brand-blue">₱{campaign.totalRaisedPHP.toLocaleString()}</p>
                <p className="text-sm text-brand-gray">Total Funds Raised ({campaign.totalRaisedETH} ETH)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-brand-gray-dark mb-4">Milestone Summary</h2>
            <div className="relative">
              <div className="absolute left-5 top-0 w-0.5 h-full bg-brand-green-light"></div>
              {campaign.milestones.map((milestone, index) => (
                <MilestoneTimelineItem 
                    key={milestone.id} 
                    milestone={milestone} 
                    isLast={index === campaign.milestones.length - 1} 
                />
              ))}
            </div>
          </section>
          
          <section>
            <ImpactReport report={campaign.finalReport} onViewReportClick={() => setIsReportModalOpen(true)} />
          </section>

          <section>
             <DonorList topDonors={campaign.topDonors} totalDonors={campaign.totalDonors} />
          </section>

          <section>
            <NftMintPanel />
          </section>
        </main>
      </div>
      <ViewFinalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        campaignTitle={campaign.title}
        report={campaign.finalReport}
      />
    </div>
  );
};