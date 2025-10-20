import React from 'react';
import { KycFormData, UserRole } from '../../types';
import { UsersIcon, CubeTransparentIcon, DocumentCheckIcon } from '../icons';

interface Step3Props {
  formData: KycFormData;
  onUpdate: (data: Partial<KycFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const roles: { id: UserRole; name: string; description: string; icon: React.ReactNode }[] = [
    { id: 'donor', name: 'Donor', description: 'Contribute to campaigns and track your impact.', icon: <UsersIcon className="w-8 h-8"/> },
    { id: 'ngo', name: 'NGO / Barangay', description: 'Create and manage fundraising campaigns.', icon: <CubeTransparentIcon className="w-8 h-8"/> },
    { id: 'volunteer', name: 'Volunteer', description: 'Help verify milestones on the ground.', icon: <DocumentCheckIcon className="w-8 h-8"/> },
];

export const Step3_RoleSelection: React.FC<Step3Props> = ({ formData, onUpdate, onNext, onBack }) => {
    return (
         <div className="space-y-6">
            <div className="space-y-4">
                {roles.map(role => (
                    <button 
                        key={role.id}
                        onClick={() => onUpdate({ role: role.id })}
                        className={`w-full p-4 border rounded-lg flex items-center space-x-4 text-left transition-all ${
                            formData.role === role.id ? 'border-brand-blue ring-2 ring-brand-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <div className={`p-2 rounded-lg ${formData.role === role.id ? 'text-brand-blue' : 'text-gray-500'}`}>{role.icon}</div>
                        <div>
                            <p className="font-bold text-gray-800">{role.name}</p>
                            <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                    </button>
                ))}
            </div>
            <div className="flex justify-between pt-4">
                <button type="button" onClick={onBack} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Back</button>
                <button type="button" onClick={onNext} disabled={!formData.role} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark disabled:bg-gray-400">Next</button>
            </div>
        </div>
    );
};