import React from 'react';
// FIX: Corrected import path for types
import { PendingMilestoneRelease } from '../types';
// FIX: Corrected import path for icons
import { ArrowTopRightOnSquareIcon } from './icons';
import { EvidenceViewer } from './EvidenceViewer';

interface MilestoneReleaseDetailProps {
  item: PendingMilestoneRelease;
  onApproveClick: () => void;
  onRejectClick: () => void;
}

export const MilestoneReleaseDetail: React.FC<MilestoneReleaseDetailProps> = ({ item, onApproveClick, onRejectClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <span className="text-sm font-semibold text-green-600">Milestone Release Request</span>
        <h2 className="text-2xl font-bold text-gray-800">{item.milestoneTitle}</h2>
        <p className="text-gray-600">Campaign: {item.campaignTitle}</p>
        <p className="text-sm text-gray-500">Submitted: {item.submittedDate}</p>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-700">Amount to Release</h3>
        <p className="text-3xl font-bold text-brand-blue">₱{item.amount.toLocaleString()}</p>
      </div>
      <div className="border-t pt-4 space-y-2">
        <h3 className="font-semibold text-gray-700">Verification Details</h3>
        <p className="text-sm text-gray-600">
            <strong>Verifier:</strong> {item.volunteerVerifier}
        </p>
        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md border italic">
          "{item.volunteerNote}"
        </div>
        <div className="mt-2">
            <EvidenceViewer evidence={item.volunteerEvidence} title="Volunteer Evidence" />
        </div>
      </div>
      <div className="border-t pt-6 flex space-x-3">
        <button
          onClick={onApproveClick}
          className="w-full bg-brand-green text-white font-bold py-2 px-4 rounded-md hover:bg-brand-green-dark"
        >
          Approve & Co-Sign Release
        </button>
        <button
          onClick={onRejectClick}
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  );
};