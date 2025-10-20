import React from 'react';
import { UserRole } from '../../types';
import { CheckCircleIcon } from '../icons';

interface OnboardingSuccessProps {
  role: UserRole;
  onFinish: () => void;
}

export const OnboardingSuccess: React.FC<OnboardingSuccessProps> = ({ role, onFinish }) => {
  return (
    <div className="text-center py-8">
        <CheckCircleIcon className="w-16 h-16 text-brand-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Verification Submitted!</h2>
        <p className="text-gray-600 mt-2">Your profile is now under review. You can now access the platform as a <span className="font-semibold capitalize">{role}</span>.</p>
        <button 
            onClick={onFinish}
            className="mt-6 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark"
        >
            Enter ReLumina
        </button>
    </div>
  );
};