import React from 'react';
import { PendingCampaign, MilestoneInput } from '../types';
import { ArrowTopRightOnSquareIcon, DocumentTextIcon, ClipboardDocumentCheckIcon, TrashIcon } from './icons';
import { EvidenceViewer } from './EvidenceViewer';

interface CampaignApprovalDetailProps {
  item: PendingCampaign;
  onApproveClick: () => void;
  onRejectClick: () => void;
  onDeleteClick: () => void;
  onSelectMilestone: (milestone: MilestoneInput) => void;
}

export const CampaignApprovalDetail: React.FC<CampaignApprovalDetailProps> = ({ item, onApproveClick, onRejectClick, onDeleteClick, onSelectMilestone }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 relative">
      <div className="absolute top-4 right-4">
          <button
              onClick={onDeleteClick}
              className="p-2 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="Delete campaign"
          >
              <TrashIcon className="w-6 h-6" />
          </button>
      </div>

      <div>
        <span className="text-sm font-semibold text-yellow-600">New Campaign Approval Request</span>
        <h2 className="text-2xl font-bold text-gray-800">{item.title}</h2>
        <p className="text-gray-600">by {item.organizer}</p>
        <p className="text-sm text-gray-500">Location: {item.location}</p>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-700">Funding Goal</h3>
        <p className="text-3xl font-bold text-brand-blue">₱{item.goal.toLocaleString()}</p>
      </div>
      <div className="border-t pt-4 space-y-2">
        <h3 className="font-semibold text-gray-700 flex items-center"><DocumentTextIcon className="w-5 h-5 mr-2" /> Submitted Documents</h3>
        <ul className="list-disc list-inside">
          {item.documents.map((doc) => (
            <li key={doc.name}>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-sm text-brand-blue hover:underline">
                <span>{doc.name}</span>
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>

       {item.milestones && item.milestones.length > 0 && (
          <div className="border-t pt-4 space-y-2">
              <h3 className="font-semibold text-gray-700 flex items-center"><ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" /> Proposed Milestones</h3>
              <div className="space-y-2">
                  {item.milestones.map((milestone, index) => (
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

      <div className="border-t pt-4 space-y-2">
          <h3 className="font-semibold text-gray-700">Volunteer Verification</h3>
          <p className="text-sm text-gray-600"><strong>Verifier:</strong> {item.volunteerVerifier}</p>
          <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md border italic">"{item.volunteerNote}"</div>
          {item.volunteerEvidence && <div className="mt-2"><EvidenceViewer evidence={item.volunteerEvidence} title="Volunteer Evidence"/></div>}
      </div>

      <div className="border-t pt-6 flex space-x-3">
        <button
          onClick={onApproveClick}
          className="w-full bg-brand-green text-white font-bold py-2 px-4 rounded-md hover:bg-brand-green-dark"
        >
          Approve Campaign
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