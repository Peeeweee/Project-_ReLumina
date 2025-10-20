import React from 'react';
import { CampaignDetail, CampaignStatus } from '../types';

interface CampaignManagementTableProps {
  campaigns: CampaignDetail[];
  onViewDetails: (campaign: CampaignDetail) => void;
  onRequestRelease: (campaign: CampaignDetail) => void;
}

const getStatusBadge = (status: CampaignStatus) => {
    const styles: { [key in CampaignStatus]: string } = {
        'Live': 'bg-green-100 text-green-800',
        'Awaiting Admin Verification': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-gray-100 text-gray-800',
        'Draft': 'bg-gray-100 text-gray-500',
        'Rejected': 'bg-red-100 text-red-800',
        'Pending Volunteer Verification': 'bg-blue-100 text-blue-800',
        'Completion Pending Volunteer Review': 'bg-blue-100 text-blue-800',
        'Completion Pending Admin Approval': 'bg-yellow-100 text-yellow-800',
        'Pending Final Report': 'bg-purple-100 text-purple-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || styles['Draft']}`}>
            {status}
        </span>
    );
};

export const CampaignManagementTable: React.FC<CampaignManagementTableProps> = ({ campaigns, onViewDetails, onRequestRelease }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Milestone</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {campaigns.map((campaign) => {
            const nextMilestoneTitle = campaign.milestones?.find(m => m.status === 'Locked')?.title || null;
            return (
                <tr 
                key={campaign.id} 
                onClick={() => onViewDetails(campaign)} 
                className="hover:bg-gray-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 whitespace-normal">
                    <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                    {campaign.status === 'Rejected' && campaign.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1 italic">Reason: {campaign.rejectionReason}</p>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(campaign.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatter.format(campaign.raised)}</div>
                    <div className="text-xs text-gray-500">of {formatter.format(campaign.goal)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{nextMilestoneTitle || 'N/A'}</td>
                <td 
                    className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={(e) => { e.stopPropagation(); onViewDetails(campaign); }} className="text-indigo-600 hover:text-indigo-900">View</button>
                    {campaign.status === 'Live' && nextMilestoneTitle && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRequestRelease(campaign); }} 
                        className="text-green-600 hover:text-green-900"
                    >
                        Release
                    </button>
                    )}
                </td>
                </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};