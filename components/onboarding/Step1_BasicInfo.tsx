import React from 'react';
import { KycFormData } from '../../types';

interface Step1Props {
  formData: KycFormData;
  onUpdate: (data: Partial<KycFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step1_BasicInfo: React.FC<Step1Props> = ({ formData, onUpdate, onNext, onBack }) => {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-4">
             <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" value={formData.name} onChange={(e) => onUpdate({ name: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
            </div>
             <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization (Optional)</label>
                <input type="text" id="organization" value={formData.organization} onChange={(e) => onUpdate({ organization: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
            </div>
            {/* Add region and contact fields here */}
            <div className="flex justify-between pt-4">
                <button type="button" onClick={onBack} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Back to Login</button>
                <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark">Next</button>
            </div>
        </form>
    );
};