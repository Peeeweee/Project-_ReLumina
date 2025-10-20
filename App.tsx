import React, { useState, useEffect, useMemo } from 'react';

// Import Pages
import { CampaignDetailPage } from './pages/CampaignDetailPage';
import { VolunteerVerificationPage } from './pages/VolunteerVerificationPage';
import { CreateCampaignPage } from './pages/CreateCampaignPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
import { PublicExplorerPage } from './pages/PublicExplorerPage';
import { CampaignCompletionPage } from './pages/CampaignCompletionPage';
import { NgoDashboardPage } from './pages/NgoDashboardPage';
import { AdminVerificationQueuePage } from './pages/AdminVerificationQueuePage';
import { LoginPage } from './pages/LoginPage';
import { KycOnboardingPage } from './pages/KycOnboardingPage';
import { WalletDonationModal } from './components/WalletDonationModal';
import { 
    MagnifyingGlassIcon, 
    ChartBarIcon, 
    UserCircleIcon, 
    Cog6ToothIcon, 
    ArrowRightOnRectangleIcon 
} from './components/icons';

// Import mock data
import { 
    mockCampaignDetails as initialCampaignDetails, 
    mockAssignedMilestones as initialAssignedMilestones,
    mockAssignedCampaigns as initialAssignedCampaigns,
    mockAssignedDeletions,
    mockProfile,
    mockDonations,
    mockBadges,
    mockAnalyticsData,
    mockCompletedCampaign,
    mockNgoActivities as initialNgoActivities,
    mockPendingCampaigns as initialPendingCampaigns,
    mockPendingReleases as initialPendingReleases,
    mockPendingDeletions as initialPendingDeletions,
    mockAdminLogs as initialAdminLogs,
    mockVolunteerActivities as initialVolunteerActivities,
    mockAssignedFinalReports,
    mockPendingFinalReports,
} from './data/mockData';

// Import types
// FIX: Added 'Transaction' to the import list to resolve the 'Cannot find name' error.
import { Campaign, CampaignDetail, KycFormData, PendingCampaign, UserRole, AssignedMilestone, NgoActivity, AdminActivity, PendingMilestoneRelease, Milestone, AssignedCampaign, VolunteerActivity, MilestoneInput, CampaignStatus, PendingDeletionRecommendation, AggregatedDonation, AssignedDeletionRecommendation, AnalyticsData, AnalyticsSummaryData, ChartDataPoint, AggregatedDonor, AssignedFinalReport, PendingFinalReport, CompletedCampaignData, TopDonor, EvidenceItem, PublicExplorerData, ExplorerStats, FeedEvent, Transaction } from './types';
import { DashboardPage } from './pages/DashboardPage';

// Page state can be a string or an object with an id
type PageState = 
  | 'login'
  | 'kyc'
  | 'dashboard' 
  | 'ngo_dashboard'
  | 'volunteer_dashboard' 
  | 'admin_queue'
  | 'analytics'
  | 'explorer'
  | 'profile'
  | 'create_campaign'
  | 'edit_campaign'
  | { name: 'campaign_detail'; id: string }
  | { name: 'campaign_complete'; id: string };

// New MainLayout Component
const MainLayout: React.FC<{ children: React.ReactNode; currentUserRole: UserRole; onNavigate: (page: PageState) => void; }> = ({ children, currentUserRole, onNavigate }) => {
    
    const handleHomeNavigation = () => {
        switch(currentUserRole) {
            case 'ngo': onNavigate('ngo_dashboard'); break;
            case 'volunteer': onNavigate('volunteer_dashboard'); break;
            case 'admin': onNavigate('admin_queue'); break;
            default: onNavigate('dashboard'); // for donor and guest
        }
    };

    const handleProfileNavigation = () => {
        switch(currentUserRole) {
            case 'ngo': onNavigate('ngo_dashboard'); break;
            case 'volunteer': onNavigate('volunteer_dashboard'); break;
            case 'admin': onNavigate('admin_queue'); break;
            case 'donor':
            default: onNavigate('profile');
        }
    }

    const getProfileButtonText = () => {
        switch(currentUserRole) {
            case 'ngo': return 'My Dashboard';
            case 'volunteer': return 'My Dashboard';
            case 'admin': return 'My Dashboard';
            case 'donor':
            default: return 'My Profile';
        }
    }

    return (
        <div className="bg-brand-gray-light min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-30">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleHomeNavigation}>
                             <svg className="w-8 h-8 text-brand-blue" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 7l9 5 9-5M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span className="font-bold text-xl text-brand-gray-dark">ReLumina</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-4 text-sm font-semibold">
                             <button onClick={() => onNavigate('explorer')} className="flex items-center space-x-2 text-gray-600 hover:text-brand-blue"><MagnifyingGlassIcon className="w-5 h-5" /><span>Explorer</span></button>
                             <button onClick={() => onNavigate('analytics')} className="flex items-center space-x-2 text-gray-600 hover:text-brand-blue"><ChartBarIcon className="w-5 h-5" /><span>Analytics</span></button>
                             <button onClick={handleProfileNavigation} className="flex items-center space-x-2 text-gray-600 hover:text-brand-blue"><UserCircleIcon className="w-5 h-5" /><span>{getProfileButtonText()}</span></button>
                        </div>
                         <div className="flex items-center space-x-4">
                            <button onClick={handleHomeNavigation} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                <UserCircleIcon className="w-6 h-6 text-gray-500" />
                                <span className="font-semibold text-gray-700 capitalize">{currentUserRole}</span>
                            </button>
                            {currentUserRole === 'admin' && (
                                <button onClick={() => onNavigate('admin_queue')} className="p-2 rounded-full hover:bg-gray-100 text-gray-600" title="Admin Queue">
                                    <Cog6ToothIcon className="w-6 h-6" />
                                </button>
                            )}
                            <button onClick={() => onNavigate('login')} className="p-2 rounded-full hover:bg-gray-100 text-gray-600" title="Sign Out">
                                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                            </button>
                         </div>
                    </div>
                </nav>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
};

export const App: React.FC = () => {
    const [page, setPage] = useState<PageState>('login');
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>('guest');
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | CampaignDetail | null>(null);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    
    // Lifted State - Single source of truth for campaigns
    const [campaignDetails, setCampaignDetails] = useState<CampaignDetail[]>(initialCampaignDetails);
    
    // Other state remains the same
    const [pendingCampaigns, setPendingCampaigns] = useState<PendingCampaign[]>(initialPendingCampaigns);
    const [pendingReleases, setPendingReleases] = useState<PendingMilestoneRelease[]>(initialPendingReleases);
    const [pendingDeletions, setPendingDeletions] = useState<PendingDeletionRecommendation[]>(initialPendingDeletions);
    const [adminLogs, setAdminLogs] = useState<AdminActivity[]>(initialAdminLogs);
    const [assignedMilestones, setAssignedMilestones] = useState<AssignedMilestone[]>(initialAssignedMilestones);
    const [assignedCampaigns, setAssignedCampaigns] = useState<AssignedCampaign[]>(initialAssignedCampaigns);
    const [assignedDeletions, setAssignedDeletions] = useState<AssignedDeletionRecommendation[]>(mockAssignedDeletions);
    const [ngoActivities, setNgoActivities] = useState<NgoActivity[]>(initialNgoActivities);
    const [volunteerActivities, setVolunteerActivities] = useState<VolunteerActivity[]>(initialVolunteerActivities);
    const [editingCampaign, setEditingCampaign] = useState<CampaignDetail | null>(null);

    // New state for final report flow
    const [assignedFinalReports, setAssignedFinalReports] = useState<AssignedFinalReport[]>(mockAssignedFinalReports);
    const [pendingFinalReports, setPendingFinalReports] = useState<PendingFinalReport[]>(mockPendingFinalReports);
    

    const navigate = (newPage: PageState) => {
        window.scrollTo(0, 0);
        setPage(newPage);
    };

    const handleLogin = (role: UserRole) => {
        setCurrentUserRole(role);
        // Simplified navigation for demonstration
        switch(role) {
            case 'ngo': navigate('ngo_dashboard'); break;
            case 'volunteer': navigate('volunteer_dashboard'); break;
            case 'admin': navigate('admin_queue'); break;
            default: navigate('dashboard');
        }
    };
    
    const handleKycComplete = (formData: KycFormData) => {
        const role = formData.role || 'donor';
        handleLogin(role);
    };

    const handleSelectDetails = (id: string) => {
        const campaign = campaignDetails.find(c => c.id === id);
        if (campaign?.status === 'Completed') {
            navigate({ name: 'campaign_complete', id });
        } else {
            navigate({ name: 'campaign_detail', id });
        }
    };
    
    const handleDonate = (campaign: Campaign | CampaignDetail) => {
        setSelectedCampaign(campaign);
        setIsDonationModalOpen(true);
    };

    const handleConfirmDonation = (campaignId: string, donationAmount: number, isAnonymous: boolean) => {
        const campaignToUpdate = campaignDetails.find(c => c.id === campaignId);
        if (!campaignToUpdate) return;

        const donorAddress = isAnonymous ? 'Anonymous' : `0x${[...Array(4)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...donor`;
    
        // 1. Update the single source of truth for campaign raised amount
        setCampaignDetails(prev =>
            prev.map(c =>
                c.id === campaignId ? { ...c, raised: c.raised + donationAmount } : c
            )
        );
    
        // 2. Add transaction to the public activity feed
        const newTransaction = {
            hash: `0x${[...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...donation`,
            timestamp: 'Just now',
            description: `Donation from ${donorAddress}`,
            amount: donationAmount,
            donorAddress: donorAddress,
        };

        setCampaignDetails(prev => 
            prev.map(c => c.id === campaignId ? {...c, activity: [newTransaction, ...c.activity]} : c)
        );
        
        // 3. Add notification for NGO with transaction details
        const newActivity: NgoActivity = {
            id: `na${Date.now()}`,
            description: `A donation of ₱${donationAmount.toLocaleString()} was made to "${campaignToUpdate.title}".`,
            timestamp: 'Just now',
            transactionHash: newTransaction.hash,
            donorAddress: donorAddress,
        };
        setNgoActivities(prev => [newActivity, ...prev]);
    };

    const platformDonations = useMemo((): AggregatedDonation[] => {
        return campaignDetails
            .flatMap(campaign => 
                campaign.activity
                    .filter(tx => tx.description?.toLowerCase().includes('donation'))
                    .map(tx => ({
                        campaignTitle: campaign.title,
                        transaction: tx
                    }))
            )
            // A more robust sort would parse the timestamp, but for mock data this is fine
            .sort((a, b) => b.transaction.timestamp.localeCompare(a.transaction.timestamp));
    }, [campaignDetails]);

    const aggregatedDonors = useMemo((): AggregatedDonor[] => {
        const donorMap = new Map<string, { totalDonated: number; donationCount: number }>();
        campaignDetails.forEach(campaign => {
            campaign.activity
                .filter(tx => tx.description?.toLowerCase().includes('donation') && tx.donorAddress)
                .forEach(tx => {
                    const address = tx.donorAddress!;
                    const existing = donorMap.get(address);
                    if (existing) {
                        existing.totalDonated += tx.amount || 0;
                        existing.donationCount += 1;
                    } else {
                        donorMap.set(address, {
                            totalDonated: tx.amount || 0,
                            donationCount: 1
                        });
                    }
                });
        });

        return Array.from(donorMap.entries()).map(([address, data]) => ({
            address,
            ...data
        })).sort((a, b) => b.totalDonated - a.totalDonated);
    }, [campaignDetails]);


    const analyticsData = useMemo((): AnalyticsData => {
        const allMilestones = campaignDetails.flatMap(c => c.milestones);
        const liveCampaigns = campaignDetails.filter(c => c.status === 'Live');

        const totalRaisedInLive = liveCampaigns.reduce((sum, c) => sum + c.raised, 0);
        const totalReleasedFromLive = liveCampaigns
            .flatMap(c => c.milestones)
            .filter(m => m.status === 'Verified & Released')
            .reduce((sum, m) => sum + m.target, 0);

        const fundsInEscrow = totalRaisedInLive - totalReleasedFromLive;

        const summary: AnalyticsSummaryData = {
            totalRaisedPHP: campaignDetails.reduce((sum, c) => sum + c.raised, 0),
            totalRaisedETH: campaignDetails.reduce((sum, c) => sum + c.raised, 0) / 150000, // mock conversion
            activeCampaigns: liveCampaigns.length,
            fundsInEscrowPHP: fundsInEscrow,
            completedCampaigns: campaignDetails.filter(c => c.status === 'Completed').length,
            verifiedMilestones: allMilestones.filter(m => m.status === 'Verified & Released').length,
            volunteerVerifications: volunteerActivities.filter(v => v.status === 'approved').length,
            totalDonors: aggregatedDonors.length,
        };
        
        // Heuristic sorting for recent activity, since timestamps are strings
        const recentPlatformActivity = [...platformDonations]
            .slice(0, 5)
            .map(aggDonation => ({
                id: aggDonation.transaction.hash,
                description: `₱${aggDonation.transaction.amount?.toLocaleString()} donated to "${aggDonation.campaignTitle}"`,
                timestamp: aggDonation.transaction.timestamp,
                txHash: aggDonation.transaction.hash
            }));
        
        // Mocking donations over time based on total raised to show dynamicity
        const donationsOverTime: ChartDataPoint[] = [
            { label: 'Jan', value: summary.totalRaisedPHP * 0.15 },
            { label: 'Feb', value: summary.totalRaisedPHP * 0.20 },
            { label: 'Mar', value: summary.totalRaisedPHP * 0.12 },
            { label: 'Apr', value: summary.totalRaisedPHP * 0.25 },
            { label: 'May', value: summary.totalRaisedPHP * 0.18 },
            { label: 'Jun', value: summary.totalRaisedPHP * 0.10 },
        ].map(d => ({...d, value: Math.max(0, d.value)}));

        // Keep these mocked as they are complex to derive from current data
        const fundsByRegion = mockAnalyticsData.fundsByRegion;
        const milestoneRates = mockAnalyticsData.milestoneRates;

        return {
            summary,
            donationsOverTime,
            fundsByRegion,
            milestoneRates,
            recentActivity: recentPlatformActivity,
        };
    }, [campaignDetails, volunteerActivities, platformDonations, aggregatedDonors]);

    const explorerData = useMemo((): PublicExplorerData => {
        const allDonations = campaignDetails.flatMap(c => c.activity).filter(tx => tx.description?.toLowerCase().includes('donation'));
        const releasedMilestones = campaignDetails.flatMap(c => c.milestones).filter(m => m.status === 'Verified & Released');
        
        const stats: ExplorerStats = {
            totalDonations: allDonations.length,
            fundsReleasedPHP: releasedMilestones.reduce((sum, m) => sum + m.target, 0),
            milestonesVerified: releasedMilestones.length,
            activeCampaigns: campaignDetails.filter(c => c.status === 'Live').length,
        };
    
        const parseTimestamp = (timestamp: string): number => {
            if (timestamp === 'Just now') return Date.now();
            const parts = timestamp.split(' ');
            if (parts.length < 2) return Date.now() - 30 * 24 * 60 * 60 * 1000;
            const value = parseInt(parts[0], 10);
            const unit = parts[1];
            if (isNaN(value)) return Date.now() - 30 * 24 * 60 * 60 * 1000;
    
            let multiplier = 1000;
            if (unit.startsWith('min')) multiplier = 60 * 1000;
            else if (unit.startsWith('hour')) multiplier = 60 * 60 * 1000;
            else if (unit.startsWith('day')) multiplier = 24 * 60 * 60 * 1000;
            else if (unit.startsWith('week')) multiplier = 7 * 24 * 60 * 60 * 1000;
            
            return Date.now() - (value * multiplier);
        };
    
        let allEvents: (FeedEvent & { sortableTimestamp: number })[] = [];
    
        campaignDetails.forEach(campaign => {
            campaign.activity.forEach(tx => {
                const sortableTimestamp = parseTimestamp(tx.timestamp);
                if (tx.description?.toLowerCase().includes('donation')) {
                    allEvents.push({
                        id: `${tx.hash}-donation`, type: 'DONATION', timestamp: tx.timestamp, sortableTimestamp,
                        txHash: tx.hash, campaignName: campaign.title, donor: tx.donorAddress || 'Anonymous', amount: tx.amount || 0,
                    });
                } else if (tx.description?.toLowerCase().includes('funds released for')) {
                    const milestoneTitle = tx.description.match(/"([^"]+)"/)?.[1];
                    allEvents.push({
                        id: `${tx.hash}-release`, type: 'RELEASE', timestamp: tx.timestamp, sortableTimestamp,
                        txHash: tx.hash, campaignName: campaign.title, amount: tx.amount || 0,
                        recipient: campaign.organizer, milestoneTitle: milestoneTitle,
                    });
                } else if (tx.description?.toLowerCase().includes('approved and is now live')) {
                    allEvents.push({
                        id: `${tx.hash}-approval`, type: 'CAMPAIGN_APPROVAL', timestamp: tx.timestamp, sortableTimestamp,
                        txHash: tx.hash, campaignName: campaign.title,
                        recipient: campaign.organizer,
                    });
                }
            });
    
            campaign.milestones.forEach(milestone => {
                if (milestone.status === 'Verified & Released' && milestone.verificationTx) {
                    const releaseTx = campaign.activity.find(tx => tx.description?.includes(`"${milestone.title}"`));
                    const timestamp = releaseTx ? releaseTx.timestamp : 'A while ago';
                    const sortableTimestamp = parseTimestamp(timestamp) - 10000;
    
                    allEvents.push({
                        id: `${milestone.verificationTx}-verification`, type: 'VERIFICATION', timestamp: timestamp, sortableTimestamp,
                        txHash: milestone.verificationTx, campaignName: campaign.title, milestoneTitle: milestone.title,
                        verifier: milestone.verifier || 'Unknown Volunteer', mediaUrl: campaign.imageUrl,
                    });
                }
            });
        });
    
        const sortedFeed = allEvents
            .sort((a, b) => b.sortableTimestamp - a.sortableTimestamp)
            .map(({ sortableTimestamp, ...rest }) => rest);
    
        return { stats, feed: sortedFeed };
    }, [campaignDetails]);


    const handleAddPendingCampaign = (campaignData: { title: string; location: string; goal: number; description: string; imageUrl: string; }, milestones: MilestoneInput[]) => {
        const campaignId = `pc${Date.now()}`;
        
        // 1. Create a task for the volunteer
        const newAssignedCampaign: AssignedCampaign = {
            id: campaignId,
            title: campaignData.title,
            location: campaignData.location,
            goal: campaignData.goal,
            organizer: "My Awesome NGO", // Placeholder for logged-in user
            documents: [{ name: 'verification_docs.pdf', url: '#' }],
            imageUrl: campaignData.imageUrl,
            milestones,
        };
        setAssignedCampaigns(prev => [newAssignedCampaign, ...prev]);
    
        // 2. Add a new campaign record to the single source of truth
        const newCampaignForDashboard: CampaignDetail = {
            id: campaignId,
            title: campaignData.title,
            impact: "This campaign is pending verification by a local volunteer.",
            location: campaignData.location,
            goal: campaignData.goal,
            raised: 0,
            imageUrl: campaignData.imageUrl,
            isVerified: false,
            status: 'Pending Volunteer Verification',
            latestTransaction: { hash: '0x...new', timestamp: 'Just now' },
            organizer: "My Awesome NGO", // Placeholder
            description: "This campaign is pending verification. A full description will be available once approved.",
            milestones: [], // Not live yet
            activity: [],
        };
        setCampaignDetails(prev => [newCampaignForDashboard, ...prev]);
    
        // 3. Add notification for NGO
        const newActivity: NgoActivity = {
            id: `na${Date.now()}`,
            description: `Your campaign "${campaignData.title}" has been submitted and is awaiting volunteer verification.`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newActivity, ...prev]);
    
        navigate('ngo_dashboard');
    };
    
    const handleApproveCampaign = (campaignId: string) => {
        const campaignToApprove = pendingCampaigns.find(c => c.id === campaignId);
        if (!campaignToApprove) return;

        // 1. Remove from admin pending queue
        setPendingCampaigns(prev => prev.filter(c => c.id !== campaignId));
        
        // 2. Create live milestones from the proposal
        const liveMilestones: Milestone[] = campaignToApprove.milestones.map((ms, index) => ({
            id: `${campaignId}-m${index + 1}`,
            title: ms.title,
            target: typeof ms.target === 'number' ? ms.target : 0,
            status: 'Locked',
        }));

        const approvalTransaction: Transaction = {
            hash: `0xapproval...${Date.now().toString(16).slice(-6)}`,
            timestamp: 'Just now',
            description: `Campaign "${campaignToApprove.title}" approved and is now live.`,
        };

        // 3. Update the campaign in the single source of truth list
        setCampaignDetails(prev => prev.map(c => 
            c.id === campaignId 
                ? { 
                    ...c, 
                    status: 'Live',
                    milestones: liveMilestones,
                    isVerified: true,
                    impact: "Newly approved campaign, description pending.",
                    description: "Please update the campaign description.",
                    activity: [approvalTransaction, ...c.activity],
                  } 
                : c
        ));
        
        // 4. Add notification for NGO
        const newActivity: NgoActivity = {
            id: `na${Date.now()}`,
            description: `Congratulations! Your campaign "${campaignToApprove.title}" has been approved and is now live.`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newActivity, ...prev]);
        
        // 5. Update Admin Logs
        const newAdminLog: AdminActivity = {
            id: `log${Date.now()}`,
            action: `Approved campaign '${campaignToApprove.title}'`,
            adminId: 'current_admin',
            timestamp: 'Just now',
            relatedItem: campaignToApprove,
        };
        setAdminLogs(prev => [newAdminLog, ...prev]);

        // 6. Notify Volunteer
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `Your verification for campaign "${campaignToApprove.title}" was approved by the admin. It's now live!`,
            timestamp: 'Just now',
            status: 'approved',
            relatedItemTitle: campaignToApprove.title,
            relatedItem: campaignToApprove,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);
    };

    const handleRejectCampaign = (campaignId: string, reason: string) => {
        const campaignToReject = pendingCampaigns.find(c => c.id === campaignId);
        if (!campaignToReject) return;
        
        // 1. Remove from admin pending queue
        setPendingCampaigns(prev => prev.filter(c => c.id !== campaignId));
        
        // 2. Update campaign status in single source of truth
        setCampaignDetails(prev => prev.map(c => c.id === campaignId ? { ...c, status: 'Rejected', rejectionReason: reason } : c));
        
        // 3. Add notification for NGO
        const newActivity: NgoActivity = {
            id: `na${Date.now()}`,
            description: `Update on "${campaignToReject.title}": Your campaign submission was rejected. Reason: ${reason}`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newActivity, ...prev]);
        
        // 4. Update Admin Logs
        const newAdminLog: AdminActivity = {
            id: `log${Date.now()}`,
            action: `Rejected campaign '${campaignToReject.title}'`,
            adminId: 'current_admin',
            timestamp: 'Just now',
            relatedItem: campaignToReject,
            rejectionReason: reason,
        };
        setAdminLogs(prev => [newAdminLog, ...prev]);

        // 5. Notify Volunteer
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `Your verification for campaign "${campaignToReject.title}" was rejected. Reason: ${reason}`,
            timestamp: 'Just now',
            status: 'rejected',
            relatedItemTitle: campaignToReject.title,
            relatedItem: campaignToReject,
            rejectionReason: reason,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);
    };

    const handleDeleteCampaign = (campaignId: string) => {
        const campaignToDelete = pendingCampaigns.find(c => c.id === campaignId);
        if (!campaignToDelete) return;
    
        // 1. Remove from admin pending queue
        setPendingCampaigns(prev => prev.filter(c => c.id !== campaignId));
    
        // 2. Remove from the single source of truth
        setCampaignDetails(prev => prev.filter(c => c.id !== campaignId));
    
        // 3. Add notification for NGO
        const newNgoActivity: NgoActivity = {
            id: `na${Date.now()}`,
            description: `Your campaign submission "${campaignToDelete.title}" was removed by an administrator.`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newNgoActivity, ...prev]);
    
        // 4. Update Admin Logs
        const newAdminLog: AdminActivity = {
            id: `log${Date.now()}`,
            action: `Deleted campaign '${campaignToDelete.title}'`,
            adminId: 'current_admin',
            timestamp: 'Just now',
            relatedItem: campaignToDelete
        };
        setAdminLogs(prev => [newAdminLog, ...prev]);
    };

    const handleDeleteActiveCampaign = (campaignId: string) => {
        const campaignToDelete = campaignDetails.find(c => c.id === campaignId);
        if (!campaignToDelete) return;
    
        // 1. Remove from the single source of truth (all dashboards)
        setCampaignDetails(prev => prev.filter(c => c.id !== campaignId));
    
        // 2. Notify Admin
        const newAdminLog: AdminActivity = {
            id: `log${Date.now()}`,
            action: `Deleted active campaign '${campaignToDelete.title}'`,
            adminId: 'current_admin',
            timestamp: 'Just now',
            relatedItem: campaignToDelete
        };
        setAdminLogs(prev => [newAdminLog, ...prev]);
    
        // 3. Notify NGO
        const newNgoActivity: NgoActivity = {
            id: `na${Date.now()}`,
            description: `Your active campaign "${campaignToDelete.title}" was removed by an administrator.`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newNgoActivity, ...prev]);
    
        // 4. Notify Volunteers
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `The active campaign "${campaignToDelete.title}" has been removed from the platform by an admin.`,
            timestamp: 'Just now',
            status: 'rejected', // Using 'rejected' status for a red icon
            relatedItemTitle: campaignToDelete.title,
            relatedItem: campaignToDelete,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);
    };
    
    const handleApproveMilestoneRelease = (releaseId: string) => {
        const releaseToApprove = pendingReleases.find(r => r.id === releaseId);
        if (!releaseToApprove) return;

        // 1. Update Campaign Details (single source of truth)
        setCampaignDetails(prevDetails => 
            prevDetails.map(campaign => {
                if (campaign.title === releaseToApprove.campaignTitle) {
                     const updatedMilestones = campaign.milestones.map(milestone => {
                        if (milestone.title === releaseToApprove.milestoneTitle) {
                            return {
                                ...milestone,
                                status: 'Verified & Released' as const,
                                verificationTx: `0x${[...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...approved`,
                            };
                        }
                        return milestone;
                    });

                    const allMilestonesReleased = updatedMilestones.length > 0 && updatedMilestones.every(m => m.status === 'Verified & Released');
                    const newStatus = allMilestonesReleased ? 'Pending Final Report' : campaign.status;

                    return {
                        ...campaign,
                        status: newStatus,
                        milestones: updatedMilestones,
                        activity: [
                            { 
                                hash: `0x...release${Date.now()}`,
                                timestamp: 'Just now', 
                                description: `Funds released for "${releaseToApprove.milestoneTitle}"`, 
                                amount: releaseToApprove.amount 
                            },
                            ...campaign.activity,
                        ]
                    };
                }
                return campaign;
            })
        );
        
        // 2. Add NGO Activity Notification for release
        const newNgoActivity: NgoActivity = {
            id: `na${Date.now()}`,
            description: `Funds for milestone "${releaseToApprove.milestoneTitle}" have been approved and released to your wallet.`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newNgoActivity, ...prev]);

        // 3. Update Admin Logs
        const newAdminLog: AdminActivity = {
            id: `log${Date.now()}`,
            action: `Approved release of ₱${releaseToApprove.amount.toLocaleString()} for "${releaseToApprove.milestoneTitle}"`,
            adminId: 'current_admin',
            timestamp: 'Just now',
            relatedItem: releaseToApprove,
        };
        setAdminLogs(prev => [newAdminLog, ...prev]);

        // 4. Remove from Volunteer's assigned queue
        setAssignedMilestones(prev => 
            prev.filter(m => !(m.campaignTitle === releaseToApprove.campaignTitle && m.milestoneTitle === releaseToApprove.milestoneTitle))
        );

        // 5. Remove from Admin's Pending Releases Queue
        setPendingReleases(prev => prev.filter(r => r.id !== releaseId));

        // 6. Notify Volunteer
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `Your report for "${releaseToApprove.milestoneTitle}" was approved!`,
            timestamp: 'Just now',
            status: 'approved',
            relatedItemTitle: releaseToApprove.milestoneTitle,
            relatedItem: releaseToApprove,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);
    };

    const handleRejectMilestoneRelease = (releaseId: string, reason: string) => {
        const releaseToReject = pendingReleases.find(r => r.id === releaseId);
        if (!releaseToReject) return;

        // 1. Update Campaign Details (Single Source of Truth)
        setCampaignDetails(prev =>
            prev.map(c =>
                c.title === releaseToReject.campaignTitle
                    ? { ...c, milestones: c.milestones.map(m =>
                            m.title === releaseToReject.milestoneTitle
                                ? { ...m, status: 'Rejected' as const, rejectionReason: reason }
                                : m
                        )}
                    : c
            )
        );

        // 2. Add NGO Activity Notification
        const newNgoActivity: NgoActivity = {
            id: `na${Date.now()}`,
            description: `Your fund release request for "${releaseToReject.milestoneTitle}" was rejected. Reason: ${reason}`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newNgoActivity, ...prev]);
        
        // 3. Update Admin Logs
        const newAdminLog: AdminActivity = {
            id: `log${Date.now()}`,
            action: `Rejected release for "${releaseToReject.milestoneTitle}"`,
            adminId: 'current_admin',
            timestamp: 'Just now',
            relatedItem: releaseToReject,
            rejectionReason: reason,
        };
        setAdminLogs(prev => [newAdminLog, ...prev]);

        // 4. Remove from Pending Releases Queue
        setPendingReleases(prev => prev.filter(r => r.id !== releaseId));

        // 5. Notify Volunteer
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `Your report for "${releaseToReject.milestoneTitle}" was rejected. Reason: ${reason}`,
            timestamp: 'Just now',
            status: 'rejected',
            relatedItemTitle: releaseToReject.milestoneTitle,
            relatedItem: releaseToReject,
            rejectionReason: reason,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);
    };

    const handleNgoRequestRelease = (campaignId: string, milestone: Milestone) => {
        const campaign = campaignDetails.find(c => c.id === campaignId);
        if (!campaign) return;

        // 1. Create a new task for the volunteer
        const newAssignedMilestone: AssignedMilestone = {
            id: `am-${Date.now()}`,
            campaignId: campaign.id,
            milestoneId: milestone.id,
            campaignTitle: campaign.title,
            milestoneTitle: milestone.title,
            location: campaign.location,
            targetAmount: milestone.target,
            imageUrl: campaign.imageUrl,
            ngoEvidence: [],
        };
        setAssignedMilestones(prev => [newAssignedMilestone, ...prev]);

        // 2. Update milestone status to 'Pending Volunteer Verification'
        setCampaignDetails(prev => prev.map(c => c.id === campaignId ? { ...c, milestones: c.milestones.map(m => m.id === milestone.id ? { ...m, status: 'Pending Volunteer Verification' as const } : m) } : c));
        
        // 3. Notify NGO
        const newNgoActivity: NgoActivity = {
            id: `na-${Date.now()}`,
            description: `Your release request for "${milestone.title}" has been sent to a volunteer for verification.`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newNgoActivity, ...prev]);
    };

    const handleVolunteerMilestoneSubmission = async (assignedMilestone: AssignedMilestone, report: string, evidence: EvidenceItem[]) => {
        
        // 1. Create a new PendingMilestoneRelease for the admin
        const newPendingRelease: PendingMilestoneRelease = {
            id: `pr-${Date.now()}`,
            campaignTitle: assignedMilestone.campaignTitle,
            milestoneTitle: assignedMilestone.milestoneTitle,
            amount: assignedMilestone.targetAmount,
            volunteerVerifier: 'current_volunteer (0x...v0l)',
            volunteerNote: report,
            volunteerEvidence: evidence,
            submittedDate: new Date().toISOString().split('T')[0],
        };
        setPendingReleases(prev => [newPendingRelease, ...prev]);

        // 2. Update milestone status to 'In Verification'
        // FIX: Only update the milestone status, not the entire campaign's status.
        setCampaignDetails(prev => prev.map(c => c.id === assignedMilestone.campaignId ? { ...c, milestones: c.milestones.map(m => m.id === assignedMilestone.milestoneId ? { ...m, status: 'In Verification' as const } : m) } : c));

        // 3. Notify NGO
        const newNgoActivity: NgoActivity = {
            id: `na-${Date.now()}`,
            description: `Volunteer report for "${assignedMilestone.milestoneTitle}" submitted. Awaiting admin co-signing.`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newNgoActivity, ...prev]);

        // 4. Remove from volunteer's queue
        setAssignedMilestones(prev => prev.filter(m => m.id !== assignedMilestone.id));

        // 5. Notify Volunteer
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `You submitted your report for "${assignedMilestone.milestoneTitle}". It's now pending admin review.`,
            timestamp: 'Just now',
            status: 'pending',
            relatedItemTitle: assignedMilestone.milestoneTitle,
            relatedItem: assignedMilestone,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);

        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const handleVolunteerCampaignSubmission = async (assignedCampaign: AssignedCampaign, report: string, evidence: EvidenceItem[]) => {
        // 1. Remove from volunteer's queue
        setAssignedCampaigns(prev => prev.filter(c => c.id !== assignedCampaign.id));
    
        // 2. Create a pending item for the admin queue
        const newPendingCampaign: PendingCampaign = {
            id: assignedCampaign.id,
            title: assignedCampaign.title,
            organizer: assignedCampaign.organizer,
            location: assignedCampaign.location,
            goal: assignedCampaign.goal,
            imageUrl: assignedCampaign.imageUrl,
            documents: assignedCampaign.documents,
            submittedDate: new Date().toISOString().split('T')[0],
            milestones: assignedCampaign.milestones,
            volunteerVerifier: 'current_volunteer (0x...v0l)',
            volunteerNote: report,
            volunteerEvidence: evidence,
        };
        setPendingCampaigns(prev => [newPendingCampaign, ...prev]);
    
        // 3. Update the campaign's status in the single source of truth
        setCampaignDetails(prev => prev.map(c => c.id === assignedCampaign.id ? { ...c, status: 'Awaiting Admin Verification' } : c));
    
        // 4. Notify NGO
        const newNgoActivity: NgoActivity = {
            id: `na-${Date.now()}`,
            description: `Volunteer report for campaign "${assignedCampaign.title}" has been submitted and is now awaiting admin approval.`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newNgoActivity, ...prev]);
        
        // 5. Notify Volunteer
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `You submitted the initial verification for campaign "${assignedCampaign.title}". It's now pending admin review.`,
            timestamp: 'Just now',
            status: 'pending',
            relatedItemTitle: assignedCampaign.title,
            relatedItem: assignedCampaign,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);

        await new Promise(resolve => setTimeout(resolve, 1000));
    };

     const handleRecommendDeletion = (campaign: CampaignDetail, reason: string, evidence: EvidenceItem[]) => {
        // 1. Create a new task for the admin
        const newDeletionRecommendation: PendingDeletionRecommendation = {
            id: `pdel-${Date.now()}`,
            campaign: campaign,
            submittedDate: new Date().toISOString().split('T')[0],
            recommender: {
                id: 'current_volunteer (0x...v0l)',
                note: reason,
                evidence: evidence,
            }
        };
        setPendingDeletions(prev => [newDeletionRecommendation, ...prev]);

        // 2. Notify Volunteer
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `You recommended the deletion of campaign "${campaign.title}". This is now pending admin review.`,
            timestamp: 'Just now',
            status: 'pending',
            relatedItemTitle: campaign.title,
            relatedItem: campaign,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);
    };

    const handleNgoRecommendDeletion = (campaign: CampaignDetail, reason: string) => {
        // 1. Create a new task for the VOLUNTEER
        const newAssignedDeletion: AssignedDeletionRecommendation = {
            id: `adel-${Date.now()}`,
            campaign,
            recommenderInfo: `NGO: ${campaign.organizer}`, // Identify the source
            reason,
            assignedDate: new Date().toISOString().split('T')[0],
        };
        setAssignedDeletions(prev => [newAssignedDeletion, ...prev]);

        // 2. Notify NGO of their own action
        const newNgoActivity: NgoActivity = {
            id: `na-${Date.now()}`,
            description: `You recommended deletion for "${campaign.title}". It is now pending VOLUNTEER review.`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newNgoActivity, ...prev]);

        // 3. Notify Volunteers that a campaign is under review and a new task is available
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `New deletion verification for "${campaign.title}" was assigned, initiated by the organizing NGO.`,
            timestamp: 'Just now',
            status: 'pending',
            relatedItemTitle: campaign.title,
            relatedItem: newAssignedDeletion,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);
    };

    const handleAdminRecommendDeletion = (campaign: CampaignDetail, reason: string) => {
        // 1. Create a task for the volunteer
        const newAssignedDeletion: AssignedDeletionRecommendation = {
            id: `adel-${Date.now()}`,
            campaign,
            recommenderInfo: 'Admin: current_admin',
            reason,
            assignedDate: new Date().toISOString().split('T')[0],
        };
        setAssignedDeletions(prev => [newAssignedDeletion, ...prev]);

        // 2. Add admin log
        const newAdminLog: AdminActivity = {
            id: `log${Date.now()}`,
            action: `Recommended deletion for '${campaign.title}'`,
            adminId: 'current_admin',
            timestamp: 'Just now',
            relatedItem: campaign
        };
        setAdminLogs(prev => [newAdminLog, ...prev]);

        // 3. Notify volunteer
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `New deletion verification assigned for "${campaign.title}". Please review the admin's request.`,
            timestamp: 'Just now',
            status: 'pending',
            relatedItemTitle: campaign.title,
            relatedItem: newAssignedDeletion,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);
    };

    const handleVolunteerApproveDeletion = async (recommendation: AssignedDeletionRecommendation, volunteerNote: string, evidence: EvidenceItem[]) => {
        // 1. Remove from volunteer's queue
        setAssignedDeletions(prev => prev.filter(d => d.id !== recommendation.id));
        
        // 2. Create a new pending item for the admin queue
        const newPendingDeletion: PendingDeletionRecommendation = {
            id: `pdel-${Date.now()}`,
            campaign: recommendation.campaign,
            submittedDate: new Date().toISOString().split('T')[0],
            recommender: {
                id: 'current_volunteer (0x...v0l)',
                note: volunteerNote,
                evidence: evidence,
            },
            originalRequest: {
                recommenderInfo: recommendation.recommenderInfo,
                reason: recommendation.reason,
            }
        };
        setPendingDeletions(prev => [newPendingDeletion, ...prev]);

        // 3. Notify volunteer of their action
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `You approved the deletion recommendation for "${recommendation.campaign.title}". It's now pending final admin action.`,
            timestamp: 'Just now',
            status: 'approved',
            relatedItemTitle: recommendation.campaign.title,
            relatedItem: recommendation,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);

        // 4. Update Admin Logs
        const newAdminLog: AdminActivity = {
            id: `log${Date.now()}`,
            action: `Volunteer approved deletion for '${recommendation.campaign.title}'. Awaiting final confirmation.`,
            adminId: 'system', // or volunteerId
            timestamp: 'Just now',
            relatedItem: recommendation.campaign,
        };
        setAdminLogs(prev => [newAdminLog, ...prev]);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const handleDismissDeletionRecommendation = (recommendationId: string) => {
        const recommendation = pendingDeletions.find(d => d.id === recommendationId);
        if (!recommendation) return;

        // 1. Remove from admin queue
        setPendingDeletions(prev => prev.filter(d => d.id !== recommendationId));

        // 2. Notify Admin
        const newAdminLog: AdminActivity = {
            id: `log${Date.now()}`,
            action: `Dismissed deletion recommendation for '${recommendation.campaign.title}'`,
            adminId: 'current_admin',
            timestamp: 'Just now',
            relatedItem: recommendation
        };
        setAdminLogs(prev => [newAdminLog, ...prev]);
        
        // 3. Notify Volunteer
        const newVolunteerActivity: VolunteerActivity = {
            id: `va-${Date.now()}`,
            description: `Your deletion recommendation for "${recommendation.campaign.title}" was reviewed and dismissed by the admin.`,
            timestamp: 'Just now',
            status: 'approved', // Green icon to indicate resolution
            relatedItemTitle: recommendation.campaign.title,
            relatedItem: recommendation.campaign,
        };
        setVolunteerActivities(prev => [newVolunteerActivity, ...prev]);
    };

    const handleEditCampaign = (campaign: CampaignDetail) => {
        setEditingCampaign(campaign);
        navigate('edit_campaign');
    };

    const handleUpdateCampaign = (campaignId: string, updatedData: Partial<CampaignDetail>, updatedMilestones: MilestoneInput[]) => {
        setCampaignDetails(prev => 
            prev.map(c => {
                if (c.id === campaignId) {
                    const newMilestones = updatedMilestones.map((ms, index) => {
                        const existing = c.milestones.find(m => m.title === ms.title);
                        return existing || {
                            id: `${c.id}-m${c.milestones.length + index + 1}`,
                            title: ms.title,
                            target: typeof ms.target === 'number' ? ms.target : 0,
                            // FIX: Explicitly cast 'Locked' as const to prevent type widening and ensure it matches MilestoneStatus.
                            status: 'Locked' as const
                        };
                    });
                    
                    return { ...c, ...updatedData, milestones: newMilestones };
                }
                return c;
            })
        );
        const updatedCampaign = campaignDetails.find(c => c.id === campaignId);

        const newNgoActivity: NgoActivity = {
            id: `na${Date.now()}`,
            description: `Your campaign "${updatedCampaign?.title}" has been updated.`,
            timestamp: 'Just now'
        };
        setNgoActivities(prev => [newNgoActivity, ...prev]);

        setEditingCampaign(null);
        navigate('ngo_dashboard');
    };

    // --- NEW FINAL REPORT HANDLERS ---
    const handleNgoSubmitFinalReport = (campaign: CampaignDetail, report: string, evidence: EvidenceItem[]) => {
        // 1. Update campaign status
        setCampaignDetails(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'Completion Pending Volunteer Review' } : c));
        
        // 2. Create volunteer task
        const newAssignedReport: AssignedFinalReport = {
            id: campaign.id,
            campaignTitle: campaign.title,
            location: campaign.location,
            imageUrl: campaign.imageUrl,
            ngoReport: report,
            ngoEvidence: evidence,
            submittedDate: new Date().toISOString().split('T')[0],
        };
        setAssignedFinalReports(prev => [newAssignedReport, ...prev]);

        // 3. Notify NGO & Volunteer
        setNgoActivities(prev => [{id: `na-fr-${Date.now()}`, description: `Your final report for "${campaign.title}" has been sent for volunteer verification.`, timestamp: 'Just now'}, ...prev]);
        setVolunteerActivities(prev => [{id: `va-fr-${Date.now()}`, description: `A new final report for "${campaign.title}" is ready for your review.`, status: 'pending', relatedItemTitle: campaign.title, relatedItem: newAssignedReport, timestamp: 'Just now'}, ...prev]);
    };

    // FIX: Converted to async function to match prop type expectation.
    const handleVolunteerVerifyFinalReport = async (assignedReport: AssignedFinalReport, volunteerNote: string, evidence: EvidenceItem[]) => {
        // 1. Remove from volunteer queue
        setAssignedFinalReports(prev => prev.filter(r => r.id !== assignedReport.id));

        // 2. Update campaign status
        setCampaignDetails(prev => prev.map(c => c.id === assignedReport.id ? { ...c, status: 'Completion Pending Admin Approval' } : c));

        // 3. Create admin task
        const newPendingReport: PendingFinalReport = {
            id: `pfr-${Date.now()}`,
            campaignId: assignedReport.id,
            campaignTitle: assignedReport.campaignTitle,
            ngoReport: assignedReport.ngoReport,
            ngoEvidence: assignedReport.ngoEvidence,
            volunteerId: 'current_volunteer (0x..v0l)',
            volunteerNote: volunteerNote,
            volunteerEvidence: evidence,
            submittedDate: new Date().toISOString().split('T')[0],
        };
        setPendingFinalReports(prev => [newPendingReport, ...prev]);

        // 4. Notify all
        setNgoActivities(prev => [{id: `na-frv-${Date.now()}`, description: `Volunteer approved final report for "${assignedReport.campaignTitle}". Awaiting admin approval.`, timestamp: 'Just now'}, ...prev]);
        setVolunteerActivities(prev => [{id: `va-frv-${Date.now()}`, description: `You approved the final report for "${assignedReport.campaignTitle}".`, status: 'approved', relatedItemTitle: assignedReport.campaignTitle, relatedItem: assignedReport, timestamp: 'Just now'}, ...prev]);
    
        await new Promise(resolve => setTimeout(resolve, 1000));
    };
    
    const handleAdminApproveFinalReport = (report: PendingFinalReport) => {
        // 1. Remove from admin queue
        setPendingFinalReports(prev => prev.filter(r => r.id !== report.id));

        // 2. Update campaign status to Completed and add final report
        setCampaignDetails(prev => prev.map(c => c.id === report.campaignId ? { 
            ...c, 
            status: 'Completed',
            finalReport: {
                narrative: report.ngoReport,
                evidence: report.ngoEvidence,
            }
        } : c));
        
        // 3. Notify all parties
        const finalCampaign = campaignDetails.find(c => c.id === report.campaignId);
        setAdminLogs(prev => [{id: `log-frc-${Date.now()}`, action: `Approved final report and completed campaign '${report.campaignTitle}'`, adminId: 'current_admin', timestamp: 'Just now', relatedItem: report}, ...prev]);
        setNgoActivities(prev => [{id: `na-frc-${Date.now()}`, description: `Congratulations! Your campaign "${report.campaignTitle}" is now officially completed.`, timestamp: 'Just now'}, ...prev]);
        setVolunteerActivities(prev => [{id: `va-frc-${Date.now()}`, description: `The final report for "${report.campaignTitle}" was approved by the admin.`, status: 'approved', relatedItemTitle: report.campaignTitle, relatedItem: finalCampaign, timestamp: 'Just now'}, ...prev]);
    };

    const handleAdminRejectFinalReport = (report: PendingFinalReport, reason: string) => {
        // 1. Remove from admin queue
        setPendingFinalReports(prev => prev.filter(r => r.id !== report.id));

        // 2. Revert campaign status to Live
        setCampaignDetails(prev => prev.map(c => c.id === report.campaignId ? { ...c, status: 'Live' } : c));

        // 3. Notify all parties
        setAdminLogs(prev => [{id: `log-frr-${Date.now()}`, action: `Rejected final report for '${report.campaignTitle}'`, adminId: 'current_admin', timestamp: 'Just now', relatedItem: report, rejectionReason: reason}, ...prev]);
        setNgoActivities(prev => [{id: `na-frr-${Date.now()}`, description: `Your final report for "${report.campaignTitle}" was rejected. Reason: ${reason}`, timestamp: 'Just now'}, ...prev]);
        setVolunteerActivities(prev => [...prev, {id: `va-frr-${Date.now()}`, description: `The final report for "${report.campaignTitle}" you reviewed was rejected by the admin.`, status: 'rejected', relatedItemTitle: report.campaignTitle, relatedItem: report, rejectionReason: reason, timestamp: 'Just now'}]);
    };



    const renderPage = () => {
        const pageName = typeof page === 'string' ? page : page.name;
        const pageId = typeof page === 'object' ? page.id : undefined;
        
        const pageContent = () => {
            switch (pageName) {
                case 'login':
                    return <LoginPage onLogin={handleLogin} onGuestLogin={() => navigate('dashboard')} />;
                case 'kyc':
                    return <KycOnboardingPage onKycComplete={handleKycComplete} onBack={() => navigate('login')} />;
                case 'dashboard':
                    return <DashboardPage campaigns={campaignDetails} onSelectDetails={handleSelectDetails} onDonate={handleDonate} />;
                case 'campaign_detail':
                    const campaign = campaignDetails.find(c => c.id === pageId);
                    if (!campaign) return <div>Campaign not found.</div>;
                    return <CampaignDetailPage campaign={campaign} onBack={() => navigate('dashboard')} onDonate={handleDonate} />;
                case 'campaign_complete': {
                    const campaign = campaignDetails.find(c => c.id === pageId);
                    if (!campaign) return <div>Campaign not found.</div>;

                    const donorMap = new Map<string, number>();
                    campaign.activity
                        .filter(tx => tx.description?.toLowerCase().includes('donation') && tx.donorAddress)
                        .forEach(tx => {
                            if (tx.donorAddress) {
                                const currentAmount = donorMap.get(tx.donorAddress) || 0;
                                donorMap.set(tx.donorAddress, currentAmount + (tx.amount || 0));
                            }
                        });

                    const campaignDonors = Array.from(donorMap.entries())
                        .map(([address, amount]) => ({ address, amount }))
                        .sort((a, b) => b.amount - a.amount);
                    
                    const topDonors: TopDonor[] = campaignDonors.slice(0, 3).map(d => ({
                        id: d.address,
                        name: d.address,
                        amount: d.amount
                    }));

                    const totalDonors = campaignDonors.length;
                    
                    const completedCampaignData: CompletedCampaignData = {
                        id: campaign.id,
                        title: campaign.title,
                        organizer: campaign.organizer,
                        completionDate: mockCompletedCampaign.completionDate,
                        totalRaisedPHP: campaign.raised,
                        totalRaisedETH: campaign.raised / 150000, // mock conversion
                        milestones: campaign.milestones,
                        finalReport: campaign.finalReport || mockCompletedCampaign.finalReport,
                        topDonors,
                        totalDonors,
                    };

                    return <CampaignCompletionPage campaign={completedCampaignData} onBack={() => navigate('dashboard')} />;
                }
                case 'create_campaign':
                    return <CreateCampaignPage onBack={() => navigate('ngo_dashboard')} onAddPendingCampaign={handleAddPendingCampaign} />;
                case 'edit_campaign':
                    return <CreateCampaignPage 
                                onBack={() => navigate('ngo_dashboard')} 
                                onAddPendingCampaign={() => {}} // Not used in edit mode
                                initialData={editingCampaign}
                                onUpdateCampaign={handleUpdateCampaign}
                           />;
                case 'volunteer_dashboard':
                    return <VolunteerVerificationPage 
                        assignedMilestones={assignedMilestones}
                        assignedCampaigns={assignedCampaigns}
                        assignedDeletions={assignedDeletions}
                        assignedFinalReports={assignedFinalReports}
                        volunteerActivities={volunteerActivities}
                        campaignDetails={campaignDetails}
                        platformDonations={platformDonations}
                        aggregatedDonors={aggregatedDonors}
                        fundsInEscrow={analyticsData.summary.fundsInEscrowPHP}
                        onBack={() => navigate('dashboard')} 
                        onVolunteerMilestoneSubmit={handleVolunteerMilestoneSubmission}
                        onVolunteerCampaignSubmit={handleVolunteerCampaignSubmission}
                        onRecommendDeletion={handleRecommendDeletion}
                        onVolunteerApproveDeletion={handleVolunteerApproveDeletion}
                        onVolunteerVerifyFinalReport={handleVolunteerVerifyFinalReport}
                    />;
                case 'profile':
                    return <ProfilePage profile={mockProfile} donations={mockDonations} badges={mockBadges} onBack={() => navigate('dashboard')} />;
                case 'analytics':
                     return <AnalyticsDashboardPage data={analyticsData} campaigns={campaignDetails} volunteerActivities={volunteerActivities} aggregatedDonors={aggregatedDonors} />;
                case 'explorer':
                    return <PublicExplorerPage data={explorerData} campaigns={campaignDetails} onSelectDetails={handleSelectDetails} />;
                case 'ngo_dashboard':
                    const myNgoCampaigns = campaignDetails.filter(c => ['Bayanihan Foundation', 'Manila Aid Network', 'My Awesome NGO', 'EduKa Foundation', 'Kusina PH', 'GreenTondo Org', 'Palawan Green Initiative'].includes(c.organizer));
                    return <NgoDashboardPage 
                        campaigns={myNgoCampaigns} 
                        activities={ngoActivities}
                        aggregatedDonors={aggregatedDonors}
                        fundsInEscrow={analyticsData.summary.fundsInEscrowPHP}
                        onCreateCampaign={() => navigate('create_campaign')} 
                        onNgoRequestRelease={handleNgoRequestRelease} 
                        onEditCampaign={handleEditCampaign}
                        onRecommendDeletion={handleNgoRecommendDeletion}
                        onNgoSubmitFinalReport={handleNgoSubmitFinalReport}
                    />;
                 case 'admin_queue':
                    return <AdminVerificationQueuePage 
                        pendingCampaigns={pendingCampaigns} 
                        pendingReleases={pendingReleases}
                        pendingDeletions={pendingDeletions} 
                        pendingFinalReports={pendingFinalReports}
                        adminLogs={adminLogs} 
                        campaignDetails={campaignDetails}
                        platformDonations={platformDonations}
                        aggregatedDonors={aggregatedDonors}
                        fundsInEscrow={analyticsData.summary.fundsInEscrowPHP}
                        onBack={() => navigate('dashboard')} 
                        onApproveCampaign={handleApproveCampaign} 
                        onRejectCampaign={handleRejectCampaign}
                        onDeleteCampaign={handleDeleteCampaign}
                        onApproveMilestoneRelease={handleApproveMilestoneRelease}
                        onRejectMilestoneRelease={handleRejectMilestoneRelease}
                        onDeleteActiveCampaign={handleDeleteActiveCampaign}
                        onDismissDeletionRecommendation={handleDismissDeletionRecommendation}
                        onAdminRecommendDeletion={handleAdminRecommendDeletion}
                        onAdminApproveFinalReport={handleAdminApproveFinalReport}
                        onAdminRejectFinalReport={handleAdminRejectFinalReport}
                    />;
                default:
                    return <DashboardPage campaigns={campaignDetails} onSelectDetails={handleSelectDetails} onDonate={handleDonate} />;
            }
        };

        const content = pageContent();

        if (pageName === 'login' || pageName === 'kyc') {
            return content; // Render without the MainLayout
        }

        return (
            <MainLayout currentUserRole={currentUserRole} onNavigate={navigate}>
                {content}
            </MainLayout>
        );
    };
    
    return (
        <>
            {renderPage()}
            <WalletDonationModal 
                isOpen={isDonationModalOpen} 
                onClose={() => setIsDonationModalOpen(false)} 
                campaign={selectedCampaign} 
                onConfirmDonation={handleConfirmDonation}
            />
        </>
    );
};

export default App;