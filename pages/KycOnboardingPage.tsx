import React, { useState } from 'react';
import { KycFormData, UserRole } from '../types';
import { StepIndicator } from '../components/onboarding/StepIndicator';
import { Step1_BasicInfo } from '../components/onboarding/Step1_BasicInfo';
import { Step2_IdentityVerification } from '../components/onboarding/Step2_IdentityVerification';
import { Step3_RoleSelection } from '../components/onboarding/Step3_RoleSelection';
import { Step4_ReviewConfirm } from '../components/onboarding/Step4_ReviewConfirm';
import { OnboardingSuccess } from '../components/onboarding/OnboardingSuccess';

interface KycOnboardingPageProps {
  onKycComplete: (formData: KycFormData) => void;
  onBack: () => void;
}

export const KycOnboardingPage: React.FC<KycOnboardingPageProps> = ({ onKycComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<KycFormData>({
    name: '',
    organization: '',
    region: '',
    contact: '',
    identityDoc: null,
    role: null,
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const updateFormData = (data: Partial<KycFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1_BasicInfo formData={formData} onUpdate={updateFormData} onNext={nextStep} onBack={onBack} />;
      case 2:
        return <Step2_IdentityVerification formData={formData} onUpdate={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3_RoleSelection formData={formData} onUpdate={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Step4_ReviewConfirm formData={formData} onNext={() => setStep(5)} onBack={prevStep} />;
      case 5:
        return <OnboardingSuccess role={formData.role || 'donor'} onFinish={() => onKycComplete(formData)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 space-y-8">
        {step < 5 && (
            <header>
                <h1 className="text-2xl font-bold text-center text-gray-800">Complete Your Profile</h1>
                <p className="text-center text-gray-500 mt-1">Verify your identity to join the ReLumina network.</p>
                <StepIndicator currentStep={step} totalSteps={4} />
            </header>
        )}
        <main>
            {renderStep()}
        </main>
      </div>
    </div>
  );
};