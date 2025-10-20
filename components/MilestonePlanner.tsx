import React from 'react';
// FIX: Corrected import path for icons
import { PlusIcon, TrashIcon } from './icons';
// FIX: Import MilestoneInput from shared types
import { MilestoneInput } from '../types';

interface MilestonePlannerProps {
    milestones: MilestoneInput[];
    onMilestonesChange: (milestones: MilestoneInput[]) => void;
}

export const MilestonePlanner: React.FC<MilestonePlannerProps> = ({ milestones, onMilestonesChange }) => {

    const handleAddMilestone = () => {
        onMilestonesChange([...milestones, { title: '', target: '' }]);
    };

    const handleRemoveMilestone = (index: number) => {
        const newMilestones = milestones.filter((_, i) => i !== index);
        onMilestonesChange(newMilestones);
    };

    const handleMilestoneChange = (index: number, field: keyof MilestoneInput, value: string | number) => {
        const newMilestones = [...milestones];
        newMilestones[index] = { ...newMilestones[index], [field]: value };
        onMilestonesChange(newMilestones);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-brand-gray-dark">Funding Milestones</h3>
            <p className="text-sm text-brand-gray">Define clear goals for how funds will be used. Funds will be held in escrow and released only when a milestone is verified.</p>
            {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md border">
                    <span className="font-bold text-brand-gray-dark mt-2">{index + 1}</span>
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="md:col-span-3">
                             <label htmlFor={`milestone-title-${index}`} className="block text-sm font-medium text-brand-gray mb-1">Milestone Title</label>
                             <input 
                                type="text"
                                id={`milestone-title-${index}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                placeholder={`e.g., Emergency Food Packs`}
                                value={milestone.title}
                                onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                             />
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor={`milestone-target-${index}`} className="block text-sm font-medium text-brand-gray mb-1">Target Amount (PHP)</label>
                             <input 
                                type="number"
                                id={`milestone-target-${index}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                placeholder="10000"
                                value={milestone.target}
                                onChange={(e) => handleMilestoneChange(index, 'target', Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <button onClick={() => handleRemoveMilestone(index)} className="mt-8 p-1 text-gray-400 hover:text-red-600">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddMilestone}
                className="w-full flex justify-center items-center space-x-2 text-sm font-semibold text-brand-blue border-2 border-dashed border-gray-300 rounded-md py-3 hover:border-brand-blue hover:text-brand-blue-dark"
            >
                <PlusIcon className="w-5 h-5" />
                <span>Add Milestone</span>
            </button>
        </div>
    );
};