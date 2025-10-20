import React from 'react';
// FIX: Corrected import path for types
import { AssignedMilestone } from '../types';
// FIX: Corrected import path for icons
import { DocumentTextIcon, CameraIcon } from './icons';

interface VerificationDetailViewProps {
  milestone: AssignedMilestone;
  onSubmit: (report: string, evidence: File) => Promise<void>;
}

export const VerificationDetailView: React.FC<VerificationDetailViewProps> = ({ milestone, onSubmit }) => {
    const [report, setReport] = React.useState('');
    const [image, setImage] = React.useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!report || !image) {
            alert('Please provide a report and upload photographic evidence.');
            return;
        }
        setIsSubmitting(true);
        await onSubmit(report, image);
        // The parent component will handle unmounting or showing a success state,
        // so we don't need to set isSubmitting back to false here.
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
                    <label htmlFor="evidence" className="flex items-center text-lg font-semibold text-brand-gray-dark mb-2">
                       <CameraIcon className="w-5 h-5 mr-2" />
                       Photographic Evidence
                    </label>
                    <input 
                        type="file" 
                        id="evidence" 
                        accept="image/*"
                        className="w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-brand-blue
                            hover:file:bg-blue-100"
                        onChange={handleImageChange}
                    />
                     {image && <img src={URL.createObjectURL(image)} alt="Evidence preview" className="mt-4 rounded-md max-h-64" />}
                </div>
            </div>
            
            <div className="border-t pt-4">
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !report || !image}
                    className="w-full text-center bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Verification Report'}
                </button>
                 <p className="text-xs text-center text-gray-500 mt-2">Your report will be sent to a ReLumina admin for co-signing before funds are released.</p>
            </div>
        </div>
    );
};