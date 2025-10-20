import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types
import { Campaign, CampaignDetail } from '../types';
// FIX: Corrected import path for icons
import { XMarkIcon, VerifiedIcon, WalletIcon, CubeTransparentIcon, ArrowTopRightOnSquareIcon, CheckCircleIcon, QrCodeIcon, BuildingLibraryIcon } from './icons';
import { ProgressBar } from './ProgressBar';
import { FileUpload } from './FileUpload';

interface WalletDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | CampaignDetail | null;
  onConfirmDonation: (campaignId: string, amount: number, isAnonymous: boolean) => void;
}

type DonationStep = 'select_amount' | 'confirm' | 'processing' | 'success';
type DonationMethod = 'crypto' | 'qr' | 'bank';

const donationTiers = [500, 1000, 2500, 5000];

export const WalletDonationModal: React.FC<WalletDonationModalProps> = ({ isOpen, onClose, campaign, onConfirmDonation }) => {
  const [step, setStep] = useState<DonationStep>('select_amount');
  const [method, setMethod] = useState<DonationMethod>('crypto');
  const [amount, setAmount] = useState<number | string>(donationTiers[1]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [txHash, setTxHash] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);


  // Reset state when modal is closed or campaign changes
  useEffect(() => {
    if (isOpen) {
      setStep('select_amount');
      setMethod('crypto');
      setAmount(donationTiers[1]);
      setIsAnonymous(false);
      setProcessingStage(0);
      setTxHash('');
      setProofFile(null);
    }
  }, [isOpen, campaign]);
  
  if (!isOpen || !campaign) return null;

  const progress = (campaign.raised / campaign.goal) * 100;

  const handleCryptoProceed = () => {
      if (Number(amount) > 0) {
        setStep('confirm');
      }
  };

  const handleConfirmCryptoDonation = () => {
    setStep('processing');
    setProcessingStage(1); // Start visualizer immediately
    const randomHash = `0x${[...Array(12)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...${[...Array(12)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setTxHash(randomHash);
    
    // Simulate multi-stage transaction
    setTimeout(() => setProcessingStage(2), 1500); // Submitting
    setTimeout(() => {
        setProcessingStage(3); // Confirmed
        onConfirmDonation(campaign.id, Number(amount), isAnonymous);
        setTimeout(() => setStep('success'), 1000); // Move to success screen
    }, 3000);
  };
  
  const handleOffChainSubmit = () => {
      if(Number(amount) <= 0 || !proofFile) {
          alert("Please enter an amount and upload proof of payment.");
          return;
      }
      onConfirmDonation(campaign.id, Number(amount), false);
      setStep('success'); // Simple success state for off-chain
  }

  const renderCryptoContent = () => {
    switch (step) {
      case 'select_amount':
        return (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {donationTiers.map(tier => (
                  <button key={tier} onClick={() => setAmount(tier)} className={`text-center font-bold py-3 px-2 rounded-md transition-colors duration-200 ${amount === tier ? 'bg-brand-blue text-white ring-2 ring-offset-2 ring-brand-blue' : 'bg-brand-gray-light text-brand-gray-dark hover:bg-gray-200'}`}>
                      ₱{tier.toLocaleString()}
                  </button>
              ))}
            </div>
            <div className="mb-4">
                <label htmlFor="custom-amount" className="block text-sm font-medium text-brand-gray mb-1">Or enter a custom amount</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray">₱</span>
                    <input type="number" id="custom-amount" className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="50" value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
                </div>
            </div>
            <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-600">Donate Anonymously</span>
                <button onClick={() => setIsAnonymous(!isAnonymous)} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue ${isAnonymous ? 'bg-brand-blue' : 'bg-gray-200'}`}>
                    <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}`}/>
                </button>
            </div>
            <button onClick={handleCryptoProceed} disabled={Number(amount) <= 0} className="w-full flex items-center justify-center space-x-2 bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300 disabled:bg-gray-400">
                <WalletIcon className="w-5 h-5" />
                <span>Connect Wallet & Proceed</span>
            </button>
          </>
        );
      case 'confirm':
        return (
            <div className="text-center space-y-4">
                <p className="text-brand-gray">You are donating:</p>
                <p className="text-5xl font-bold text-brand-blue">₱{Number(amount).toLocaleString()}</p>
                <div className="text-sm bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between"><span>Estimated Gas Fee</span><span className="font-mono">~0.002 ETH</span></div>
                    <div className="flex justify-between mt-1 text-gray-500"><span>Network</span><span>Ethereum Mainnet</span></div>
                </div>
                <button onClick={handleConfirmCryptoDonation} className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-md hover:bg-brand-green-dark">
                    Confirm Donation
                </button>
                <button onClick={() => setStep('select_amount')} className="text-sm text-gray-500 hover:underline">Cancel</button>
            </div>
        );
       case 'processing': {
        const processingSteps = [
            'Connecting wallet',
            'Submitting transaction',
            'Donation confirmed',
        ];

        return (
            <div className="text-center py-8 px-4 space-y-6">
                <div className="flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Processing Donation</h3>
                <div className="space-y-3 pt-2 text-left">
                    {processingSteps.map((text, index) => {
                        const isComplete = processingStage > index + 1;
                        const isCurrent = processingStage === index + 1;
                        
                        let icon;
                        if (isComplete) {
                            icon = <CheckCircleIcon className="w-6 h-6 text-brand-green flex-shrink-0" />;
                        } else if (isCurrent) {
                            icon = (
                                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            );
                        } else {
                            icon = (
                                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                                </div>
                            );
                        }

                        const textClass = isComplete || isCurrent ? 'font-semibold text-gray-800' : 'text-gray-500';

                        return (
                            <div key={index} className="flex items-center space-x-3">
                                {icon}
                                <span className={`text-base ${textClass}`}>
                                    {text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
      }
       case 'success':
        return (
            <div className="text-center py-6">
                <CheckCircleIcon className="w-16 h-16 text-brand-green mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-brand-gray-dark">Thank You!</h3>
                <p className="text-brand-gray mt-2 mb-4">
                  {method === 'crypto'
                    ? "Your donation is now visible on-chain and contributes to verified milestones."
                    : "Your proof of payment has been submitted for verification. Thank you for your contribution!"}
                </p>
                {method === 'crypto' && txHash && (
                    <div className="bg-gray-50 p-3 rounded-md text-left">
                        <p className="text-sm text-gray-500">Transaction Hash</p>
                        <a href="#" onClick={e => e.preventDefault()} className="flex items-center space-x-1 text-xs text-brand-blue hover:underline font-mono">
                             <CubeTransparentIcon className="w-4 h-4" />
                            <span className="truncate">{txHash}</span>
                            <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </a>
                    </div>
                )}
                <button onClick={onClose} className="mt-6 w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue-dark">
                    Done
                </button>
            </div>
        );
    }
  };

  const renderQrContent = () => {
    if (step === 'success') return renderCryptoContent();
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="qr-amount" className="block text-sm font-medium text-brand-gray mb-1">Donation Amount</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray">₱</span>
                    <input type="number" id="qr-amount" className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="1000" value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
                </div>
            </div>
             <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">Scan to Pay</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=relumina-donation-mock" alt="Donation QR Code" className="mx-auto my-2 rounded-md border" />
                <p className="text-xs text-gray-500">Use any e-wallet app like GCash or PayMaya.</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-brand-gray mb-1">Upload Proof of Payment</label>
                <FileUpload onFileSelect={setProofFile} />
            </div>
            <button onClick={handleOffChainSubmit} disabled={Number(amount) <= 0 || !proofFile} className="w-full flex items-center justify-center space-x-2 bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300 disabled:bg-gray-400">
                Submit for Verification
            </button>
        </div>
    );
  };

  const renderBankContent = () => {
    if (step === 'success') return renderCryptoContent();
    return (
        <div className="space-y-4">
             <div>
                <label htmlFor="bank-amount" className="block text-sm font-medium text-brand-gray mb-1">Donation Amount</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray">₱</span>
                    <input type="number" id="bank-amount" className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="1000" value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
                </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border text-sm">
                <p className="font-semibold text-gray-700 mb-2">Bank Transfer Details:</p>
                <div className="space-y-1 text-gray-800">
                    <p><strong>Bank:</strong> BPI (Bank of the Philippine Islands)</p>
                    <p><strong>Account Name:</strong> ReLumina Foundation Inc.</p>
                    <p><strong>Account Number:</strong> 1234-5678-90</p>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-brand-gray mb-1">Upload Deposit Slip / Screenshot</label>
                <FileUpload onFileSelect={setProofFile} />
            </div>
            <button onClick={handleOffChainSubmit} disabled={Number(amount) <= 0 || !proofFile} className="w-full flex items-center justify-center space-x-2 bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300 disabled:bg-gray-400">
                Submit for Verification
            </button>
        </div>
    );
  };
  
  const TabButton: React.FC<{
      label: string;
      icon: React.ReactNode;
      isActive: boolean;
      onClick: () => void;
  }> = ({ label, icon, isActive, onClick }) => (
      <button
          onClick={onClick}
          className={`flex-1 flex items-center justify-center space-x-2 p-2 text-sm font-semibold border-b-2 transition-colors ${isActive ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
      >
          {icon}
          <span>{label}</span>
      </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex-shrink-0">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-brand-gray-dark">{campaign.title}</h2>
                    <p className="text-sm text-brand-gray">
                        {('organizer' in campaign && campaign.organizer) ? `by ${campaign.organizer}` : campaign.location}
                    </p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            {campaign.isVerified && <span className="inline-flex items-center space-x-1 mt-2 px-2 py-0.5 bg-brand-green-light text-brand-green-dark text-xs font-semibold rounded-full"><VerifiedIcon className="w-3.5 h-3.5" /><span>Verified</span></span>}
            <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-brand-gray-dark">₱{campaign.raised.toLocaleString()}</span>
                    <span className="text-brand-gray">Goal: ₱{campaign.goal.toLocaleString()}</span>
                </div>
                <ProgressBar value={progress} />
            </div>
        </div>
        
        <div className="overflow-y-auto">
            {step !== 'success' && (
                <div className="flex border-b sticky top-0 bg-white z-10">
                    <TabButton label="Crypto Wallet" icon={<WalletIcon className="w-5 h-5"/>} isActive={method === 'crypto'} onClick={() => setMethod('crypto')} />
                    <TabButton label="E-Wallet / Card" icon={<QrCodeIcon className="w-5 h-5"/>} isActive={method === 'qr'} onClick={() => setMethod('qr')} />
                    <TabButton label="Bank Transfer" icon={<BuildingLibraryIcon className="w-5 h-5"/>} isActive={method === 'bank'} onClick={() => setMethod('bank')} />
                </div>
            )}

            <div className="p-6">
                {method === 'crypto' && renderCryptoContent()}
                {method === 'qr' && renderQrContent()}
                {method === 'bank' && renderBankContent()}
            </div>
        </div>
      </div>
    </div>
  );
};