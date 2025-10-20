import React from 'react';
import { KycFormData } from '../../types';
import { FileUpload } from '../FileUpload';

interface Step2Props {
  formData: KycFormData;
  onUpdate: (data: Partial<KycFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2_IdentityVerification: React.FC<Step2Props> = ({ formData, onUpdate, onNext, onBack }) => {
    return (
        <div className="space-y-6">
            <p className="text-center text-gray-600">Please upload a valid ID (e.g., Driver's License) or an official document for your organization (e.g., Barangay Certificate).</p>
            <FileUpload onFileSelect={(file) => onUpdate({ identityDoc: file })}/>
            <div className="flex justify-between pt-4">
                <button type="button" onClick={onBack} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Back</button>
                <button type="button" onClick={onNext} disabled={!formData.identityDoc} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark disabled:bg-gray-400">Next</button>
            </div>
        </div>
    );
};