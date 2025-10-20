import React from 'react';
// FIX: Corrected import path for types
import { PendingCampaign, PendingMilestoneRelease, PendingDeletionRecommendation, PendingFinalReport } from '../types';

interface ApprovalQueueItemProps {
  item: PendingCampaign | PendingMilestoneRelease | PendingDeletionRecommendation | PendingFinalReport;
  isSelected: boolean;
  onSelect: (item: PendingCampaign | PendingMilestoneRelease | PendingDeletionRecommendation | PendingFinalReport) => void;
}

export const ApprovalQueueItem: React.FC<ApprovalQueueItemProps> = ({ item, isSelected, onSelect }) => {
  const isCampaignApproval = 'organizer' in item;
  const isMilestoneRelease = 'milestoneTitle' in item;
  const isDeletionRecommendation = 'recommender' in item;
  const isFinalReport = 'ngoReport' in item;

  let title, subtitle, badgeText, badgeClasses;

  if (isFinalReport) {
    const finalReportItem = item as PendingFinalReport;
    title = `Final Report for "${finalReportItem.campaignTitle}"`;
    subtitle = `Verified by: ${finalReportItem.volunteerId}`;
    badgeText = 'Final Approval';
    badgeClasses = 'bg-blue-100 text-blue-800';
  } else if (isDeletionRecommendation) {
    const deletionItem = item as PendingDeletionRecommendation;
    title = `Recommendation for "${deletionItem.campaign.title}"`;
    subtitle = `by Volunteer: ${deletionItem.recommender.id}`;
    badgeText = 'Deletion Recommendation';
    badgeClasses = 'bg-red-100 text-red-800';
  } else if (isCampaignApproval) {
    const campaignItem = item as PendingCampaign;
    title = campaignItem.title;
    subtitle = `by ${campaignItem.organizer}`;
    badgeText = 'Campaign Approval';
    badgeClasses = 'bg-yellow-100 text-yellow-800';
  } else { // isMilestoneRelease
    const milestoneItem = item as PendingMilestoneRelease;
    title = `Release for ${milestoneItem.milestoneTitle}`;
    subtitle = `Campaign: ${milestoneItem.campaignTitle}`;
    badgeText = 'Milestone Release';
    badgeClasses = 'bg-green-100 text-green-800';
  }

  return (
    <li
      onClick={() => onSelect(item)}
      className={`p-3 rounded-md cursor-pointer transition-all duration-200 ${
        isSelected ? 'bg-brand-blue-light scale-[1.02]' : 'hover:bg-gray-100 hover:scale-[1.02]'
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <span
          className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${badgeClasses}`}
        >
          {badgeText}
        </span>
        <span className="text-xs text-gray-500">{item.submittedDate}</span>
      </div>
      <h4 className="font-semibold text-gray-800 truncate">{title}</h4>
      <p className="text-sm text-gray-600 truncate">{subtitle}</p>
    </li>
  );
};