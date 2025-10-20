import React from 'react';
import { KycFormData } from '../../types';

interface Step4Props {
  formData: KycFormData;
  onNext: () => void;
  onBack: () => void;
}

const ReviewRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-semibold text-gray-800 capitalize">{value || 'Not provided'}</span>
    </div>
)

export const Step4_ReviewConfirm: React.FC<Step4Props> = ({ formData, onNext, onBack }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-center text-gray-800">Review Your Information</h3>
            <div className="space-y-2 p-4 border rounded-md bg-gray-50">
                <ReviewRow label="Full Name" value={formData.name} />
                <ReviewRow label="Organization" value={formData.organization} />
                <ReviewRow label="Selected Role" value={formData.role} />
                <ReviewRow label="Identity Document" value={formData.identityDoc?.name} />
            </div>
            <div className="flex justify-between pt-4">
                <button type="button" onClick={onBack} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Back</button>
                <button type="button" onClick={onNext} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark">Submit for Verification</button>
            </div>
        </div>
    );
};