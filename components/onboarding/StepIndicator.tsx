import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mt-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
        <React.Fragment key={step}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
              step <= currentStep ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div className={`h-1 flex-1 transition-colors ${step < currentStep ? 'bg-brand-blue' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};