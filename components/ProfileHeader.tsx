
import React from 'react';
// FIX: Corrected import path for types
import { DonorProfile } from '../types';

interface ProfileHeaderProps {
  profile: DonorProfile;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-white rounded-lg p-4 text-center shadow">
    <p className="text-2xl font-bold text-brand-blue">{value}</p>
    <p className="text-sm text-brand-gray">{label}</p>
  </div>
);

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const truncatedAddress = `${profile.walletAddress.slice(0, 6)}...${profile.walletAddress.slice(-4)}`;

  return (
    <header className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={profile.avatarUrl}
          alt={profile.displayName}
          className="w-24 h-24 rounded-full object-cover border-4 border-brand-blue-light"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-brand-gray-dark">{profile.displayName}</h1>
          <p className="text-md text-brand-gray font-mono" title={profile.walletAddress}>{truncatedAddress}</p>
        </div>
      </div>
      <div className="mt-6 border-t pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Donated (PHP)" value={`₱${profile.totalDonatedPHP.toLocaleString()}`} />
        <StatCard label="Total Donated (ETH)" value={profile.totalDonatedETH.toFixed(4)} />
        <StatCard label="Campaigns Supported" value={profile.campaignsSupported} />
        <StatCard label="Verified Impact" value={`${profile.milestonesVerified} Milestones`} />
      </div>
    </header>
  );
};