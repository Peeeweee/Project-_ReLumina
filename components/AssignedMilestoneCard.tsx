import React from 'react';
// FIX: Corrected import path for types
import { AssignedMilestone } from '../types';
// FIX: Corrected import path for icons
import { LocationPinIcon } from './icons';

interface AssignedMilestoneCardProps {
  milestone: AssignedMilestone;
  onSelect: (milestone: AssignedMilestone) => void;
  isSelected: boolean;
}

export const AssignedMilestoneCard: React.FC<AssignedMilestoneCardProps> = ({ milestone, onSelect, isSelected }) => {
  return (
    <article
      onClick={() => onSelect(milestone)}
      className={`bg-white rounded-lg shadow overflow-hidden transition-all duration-300 cursor-pointer flex flex-col group ${
        isSelected ? 'ring-2 ring-brand-blue shadow-lg scale-105' : 'hover:shadow-xl hover:scale-105'
      }`}
      aria-labelledby={`milestone-title-${milestone.id}`}
    >
      <div className="overflow-hidden">
        <img
          src={milestone.imageUrl}
          alt={`Image for ${milestone.campaignTitle}`}
          className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-brand-gray mb-1">{milestone.campaignTitle}</p>
        <h4 id={`milestone-title-${milestone.id}`} className="text-md font-bold text-brand-gray-dark mb-2">
          {milestone.milestoneTitle}
        </h4>
        <div className="mt-auto space-y-2">
           <div className="flex items-center text-xs text-brand-gray">
              <LocationPinIcon className="w-3 h-3 mr-1" />
              <span>{milestone.location}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-brand-blue">₱{milestone.targetAmount.toLocaleString()}</span>
            <span className="text-xs text-brand-gray"> Target</span>
          </div>
        </div>
      </div>
    </article>
  );
};