import React, { useState, useEffect, useMemo } from 'react';
import { FileUpload } from '../components/FileUpload';
import { MilestonePlanner } from '../components/MilestonePlanner';
import { ChevronLeftIcon, CheckCircleIcon, XCircleIcon } from '../components/icons';
import { MilestoneInput, CampaignDetail } from '../types';

interface CreateCampaignPageProps {
  onBack: () => void;
  onAddPendingCampaign: (campaignData: { title: string; location: string; goal: number; description: string; imageUrl: string; }, milestones: MilestoneInput[]) => void;
  initialData?: CampaignDetail | null;
  onUpdateCampaign?: (campaignId: string, updatedData: Partial<CampaignDetail>, updatedMilestones: MilestoneInput[]) => void;
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const CreateCampaignPage: React.FC<CreateCampaignPageProps> = ({ 
    onBack, 
    onAddPendingCampaign, 
    initialData, 
    onUpdateCampaign 
}) => {
    const isEditMode = !!initialData;

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState<number | ''>('');
    const [milestones, setMilestones] = useState<MilestoneInput[]>([{ title: '', target: '' }]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    // New state to control when the mismatch error is shown
    const [showGoalMismatchError, setShowGoalMismatchError] = useState(false);

    useEffect(() => {
        if (isEditMode && initialData) {
            setTitle(initialData.title);
            setLocation(initialData.location);
            setDescription(initialData.description);
            setGoal(initialData.goal);
            setMilestones(initialData.milestones.map(m => ({ title: m.title, target: m.target })));
        }
    }, [initialData, isEditMode]);


    const milestoneTotal = useMemo(() => {
        return milestones.reduce((sum, milestone) => sum + (Number(milestone.target) || 0), 0);
    }, [milestones]);

    const goalAmount = Number(goal) || 0;

    // We still calculate this, but only use it on submit
    const isMismatched = goalAmount > 0 && milestoneTotal !== goalAmount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Perform the check only on submit
        if (isMismatched) {
            setShowGoalMismatchError(true);
            return; // Stop submission
        }
        
        // If everything is fine, hide any previous error and proceed
        setShowGoalMismatchError(false);

        if (typeof goal !== 'number') return;
        
        const imageUrl = imageFile ? URL.createObjectURL(imageFile) : (initialData?.imageUrl || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop');

        const validMilestones = milestones.filter(m => m.title && typeof m.target === 'number' && m.target > 0);

        if (isEditMode && onUpdateCampaign && initialData) {
            onUpdateCampaign(initialData.id, { title, location, description, goal, imageUrl }, validMilestones);
        } else {
             onAddPendingCampaign(
                { title, location, goal, description, imageUrl },
                validMilestones
            );
        }
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <CheckCircleIcon className="w-16 h-16 text-brand-green mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-brand-gray-dark">
                    {isEditMode ? 'Campaign Updated Successfully' : 'Campaign Submitted for Verification'}
                </h1>
                <p className="text-lg text-brand-gray mt-2">
                    {isEditMode 
                        ? `Your changes to "${title}" have been saved and are now live.`
                        : `Thank you! Your campaign "${title}" is now in the queue for review.`
                    }
                </p>
                <button 
                    onClick={onBack}
                    className="mt-8 bg-brand-blue text-white font-bold py-2 px-6 rounded-md hover:bg-brand-blue-dark transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>
        )
    }

    return (
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                 <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-gray hover:text-brand-gray-dark mb-4">
                    <ChevronLeftIcon className="w-5 h-5 mr-1"/>
                    Back to Dashboard
                </button>
                <h1 className="text-4xl font-bold text-brand-gray-dark">{isEditMode ? 'Edit Campaign' : 'Create a New Campaign'}</h1>
                <p className="text-lg text-brand-gray mt-1">
                    {isEditMode ? 'Update the details for your ongoing campaign.' : 'Fill in the details below to launch your transparent, milestone-based funding campaign.'}
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow">
                 <div>
                    <label htmlFor="campaign-title" className="block text-xl font-bold text-brand-gray-dark mb-2">Campaign Title</label>
                    <input type="text" id="campaign-title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue text-lg" placeholder="e.g., Typhoon Relief for Bicol" required />
                </div>
                
                <div>
                    <label htmlFor="location" className="block text-xl font-bold text-brand-gray-dark mb-2">Location</label>
                    <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="e.g., Bicol Region, Philippines" required />
                </div>

                <div>
                    <label htmlFor="description" className="block text-xl font-bold text-brand-gray-dark mb-2">Description</label>
                     <p className="text-sm text-brand-gray mb-2">Tell the story of your campaign. Why is it important? Who will it help?</p>
                    <textarea id="description" rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="Describe the purpose of your campaign..." required></textarea>
                </div>
                
                 <div>
                    <label htmlFor="goal" className="block text-xl font-bold text-brand-gray-dark mb-2">Overall Funding Goal (PHP)</label>
                     <input type="number" id="goal" value={goal} onChange={e => setGoal(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="50000" required />
                </div>

                <div>
                    <h3 className="text-xl font-bold text-brand-gray-dark mb-2">Campaign Image</h3>
                    <FileUpload onFileSelect={setImageFile} />
                    {isEditMode && initialData?.imageUrl && !imageFile && (
                        <div className="mt-2 text-sm text-gray-500">
                            <p>Current image:</p>
                            <img src={initialData.imageUrl} alt="Current campaign" className="w-32 h-20 object-cover rounded-md border mt-1" />
                        </div>
                    )}
                </div>

                <div>
                    <MilestonePlanner milestones={milestones} onMilestonesChange={setMilestones} />
                    <div className="mt-4">
                        {showGoalMismatchError && (
                            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-r-md" role="alert">
                                <div className="flex">
                                    <div className="py-1"><XCircleIcon className="h-6 w-6 mr-3" /></div>
                                    <div>
                                        <p className="font-bold">Goal Mismatch</p>
                                        <p className="text-sm">The milestone total does not match the overall goal.</p>
                                        <p className="text-xs mt-1">
                                            Goal: <strong>{formatter.format(goalAmount)}</strong> vs. Milestone Total: <strong>{formatter.format(milestoneTotal)}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <button
                        type="submit"
                        className="w-full text-center bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isEditMode ? 'Update Campaign' : 'Submit for Verification'}
                    </button>
                </div>
            </form>
         </div>
    );
};