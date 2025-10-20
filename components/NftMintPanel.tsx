
import React, { useState } from 'react';
// FIX: Corrected import path for icons
import { SparklesIcon, CheckCircleIcon, CubeTransparentIcon } from './icons';

export const NftMintPanel: React.FC = () => {
    const [isMinted, setIsMinted] = useState(false);

    const handleMint = () => {
        // Simulate minting process
        setTimeout(() => setIsMinted(true), 1500);
    };

    return (
        <div className="bg-gradient-to-br from-brand-blue to-blue-700 rounded-lg shadow-xl p-8 text-white text-center">
            <SparklesIcon className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl font-bold">Your Impact, Immortalized</h2>
            <p className="mt-2 mb-6 max-w-md mx-auto">
                As a thank you from the community, you can mint a commemorative NFT Impact Badge to celebrate this campaign's success.
            </p>

            {isMinted ? (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left font-mono text-sm">
                    <div className="flex items-center text-green-300 font-bold mb-2">
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        <span>Badge Minted Successfully!</span>
                    </div>
                    <p><strong>Token ID:</strong> #1024</p>
                    <p className="truncate"><strong>Tx Hash:</strong> 0xmint...hash789</p>
                </div>
            ) : (
                <button 
                    onClick={handleMint}
                    className="bg-white text-brand-blue font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-transform hover:scale-105"
                >
                    Mint My Impact Badge
                </button>
            )}
            <p className="text-xs opacity-70 mt-4">This is a gas-free transaction, covered by ReLumina.</p>
        </div>
    );
};