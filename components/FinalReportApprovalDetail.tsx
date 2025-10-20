import React from 'react';
import { PendingFinalReport } from '../types';
import { ArrowTopRightOnSquareIcon } from './icons';
import { EvidenceViewer } from './EvidenceViewer';

interface FinalReportApprovalDetailProps {
    item: PendingFinalReport;
    onApproveClick: () => void;
    onRejectClick: () => void;
}

export const FinalReportApprovalDetail: React.FC<FinalReportApprovalDetailProps> = ({ item, onApproveClick, onRejectClick }) => {
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