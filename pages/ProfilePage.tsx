
import React, { useState } from 'react';
// FIX: Corrected import path for types
import { DonorProfile, PastDonation, NftBadge } from '../types';
import { ProfileHeader } from '../components/ProfileHeader';
import { DonationHistoryCard } from '../components/DonationHistoryCard';
import { NftBadgeCard } from '../components/NftBadgeCard';
import { NftDetailModal } from '../components/NftDetailModal';
// FIX: Corrected import path for icons
import { ChevronLeftIcon } from '../components/icons';

interface ProfilePageProps {
  profile: DonorProfile;
  donations: PastDonation[];
  badges: NftBadge[];
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile, donations, badges, onBack }) => {
  const [selectedBadge, setSelectedBadge] = useState<NftBadge | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-gray hover:text-brand-gray-dark mb-4">
        <ChevronLeftIcon className="w-5 h-5 mr-1"/>
        Back to Dashboard
      </button>

      <ProfileHeader profile={profile} />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold text-brand-gray-dark">My Donations</h2>
          <div className="space-y-4">
            {donations.map((donation) => (
              <DonationHistoryCard key={donation.id} donation={donation} />
            ))}
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-brand-gray-dark mb-6">My Impact Badges</h2>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <NftBadgeCard key={badge.id} badge={badge} onSelect={() => setSelectedBadge(badge)} />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white rounded-lg shadow p-12 border-2 border-dashed">
              <h3 className="text-xl font-semibold text-brand-gray-dark">No badges yet!</h3>
              <p className="text-brand-gray mt-2">Donate to verified campaigns that successfully complete their milestones to earn your first collectible Impact Badge.</p>
            </div>
          )}
        </section>
      </main>
      
      <NftDetailModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
    </div>
  );
};