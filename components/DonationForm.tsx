
import React, { useState } from 'react';
// FIX: Corrected import path for icons.
import { CheckCircleIcon, CubeTransparentIcon } from './icons';

const donationTiers = [500, 1000, 2500, 5000];

type DonationStatus = 'idle' | 'connecting' | 'processing' | 'success';

export const DonationForm: React.FC = () => {
  const [amount, setAmount] = useState<number | string>(donationTiers[1]);
  const [status, setStatus] = useState<DonationStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleDonate = () => {
    if (Number(amount) <= 0) return;
    setStatus('connecting');
    const randomHash = `0x${[...Array(10)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...${[...Array(10)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    setTimeout(() => {
        setStatus('processing');
        setTimeout(() => {
            setTxHash(randomHash);
            setStatus('success');
        }, 2000);
    }, 1500);
  };
  
  if (status === 'success') {
    return (
        <div className="bg-brand-green-light border-l-4 border-brand-green-dark text-brand-green-dark p-4 rounded-r-md" role="alert">
            <div className="flex">
                <div className="py-1"><CheckCircleIcon className="h-6 w-6 mr-3" /></div>
                <div>
                    <p className="font-bold">Donation Confirmed!</p>
                    <p className="text-sm">Your contribution has been secured on-chain.</p>
                    <a 
                        href="#" 
                        className="text-xs font-mono mt-1 inline-flex items-center hover:underline"
                        onClick={(e) => e.preventDefault()}
                    >
                        <CubeTransparentIcon className="w-3 h-3 mr-1"/>
                        {txHash}
                    </a>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-brand-gray-dark mb-4">Support This Campaign</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {donationTiers.map(tier => (
                <button
                    key={tier}
                    onClick={() => setAmount(tier)}
                    className={`text-center font-bold py-2 px-2 rounded-md transition-colors duration-200 ${
                        amount === tier 
                        ? 'bg-brand-blue text-white ring-2 ring-offset-2 ring-brand-blue'
                        : 'bg-brand-gray-light text-brand-gray-dark hover:bg-gray-200'
                    }`}
                >
                    ₱{tier.toLocaleString()}
                </button>
            ))}
        </div>
        <div className="mb-4">
            <label htmlFor="custom-amount" className="block text-sm font-medium text-brand-gray mb-1">Or enter a custom amount</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray">₱</span>
                <input 
                    type="number"
                    id="custom-amount"
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="50"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
            </div>
        </div>
        <button
            onClick={handleDonate}
            disabled={status !== 'idle'}
            className="w-full text-center bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {status === 'idle' && 'Donate with Wallet'}
            {status === 'connecting' && 'Connecting to wallet...'}
            {status === 'processing' && 'Processing transaction...'}
        </button>
    </div>
  );
};