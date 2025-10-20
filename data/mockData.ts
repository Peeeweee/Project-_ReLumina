import {
    CampaignDetail,
    AssignedMilestone,
    AssignedCampaign,
    DonorProfile,
    PastDonation,
    NftBadge,
    AnalyticsData,
    PublicExplorerData,
    CompletedCampaignData,
    NgoActivity,
    PendingCampaign,
    PendingMilestoneRelease,
    PendingDeletionRecommendation,
    AdminActivity,
    VolunteerActivity,
    AdminControlStats,
    PendingUserVerification,
    EscrowDetails,
    MilestoneInput,
    AssignedDeletionRecommendation,
    AssignedFinalReport,
    PendingFinalReport,
} from '../types';

// Let's create mock data for campaigns first.
const mockMilestones1: CampaignDetail['milestones'] = [
    { id: 'c1-m1', title: 'Emergency Food Packs', target: 50000, status: 'Verified & Released', verifier: 'Volunteer A', verificationTx: '0xabc...123' },
    { id: 'c1-m2', title: 'Medical Supplies', target: 75000, status: 'In Verification', verifier: 'Volunteer B' },
    { id: 'c1-m3', title: 'Temporary Shelter Kits', target: 125000, status: 'Locked' },
];

const mockMilestones2: CampaignDetail['milestones'] = [
    { id: 'c2-m1', title: 'School Supplies Kits', target: 30000, status: 'Verified & Released', verifier: 'Volunteer C', verificationTx: '0xdef...456' },
    { id: 'c2-m2', title: 'Classroom Repair Materials', target: 40000, status: 'Pending Volunteer Verification' },
    { id: 'c2-m3', title: 'Teacher Training Workshop', target: 20000, status: 'Locked' },
];

const mockMilestones3: CampaignDetail['milestones'] = [
    { id: 'c3-m1', title: 'Phase 1: Debris Clearing', target: 100000, status: 'Verified & Released', verifier: 'Volunteer D', verificationTx: '0xghi...789' },
    { id: 'c3-m2', title: 'Phase 2: Housing Materials', target: 250000, status: 'Verified & Released', verifier: 'Volunteer E', verificationTx: '0xjkl...012' },
    { id: 'c3-m3', title: 'Phase 3: Community Rebuilding', target: 150000, status: 'Verified & Released', verifier: 'Volunteer F', verificationTx: '0xmno...345' },
];

const mockMilestones4: CampaignDetail['milestones'] = [
    { id: 'c4-m1', title: 'Daily Meal Preparation', target: 60000, status: 'Verified & Released', verifier: 'Volunteer G', verificationTx: '0xpqr...678' },
    { id: 'c4-m2', title: 'Nutritional Program Launch', target: 40000, status: 'Rejected', rejectionReason: "Vendor receipts were incomplete." },
    { id: 'c4-m3', title: 'Cooking Equipment', target: 50000, status: 'Locked' },
];


export const mockCampaignDetails: CampaignDetail[] = [
    {
        id: 'c1',
        title: 'Typhoon Relief for Bicol',
        impact: 'Providing immediate aid to families affected by the recent typhoon.',
        location: 'Bicol Region, Philippines',
        goal: 250000,
        raised: 135000,
        imageUrl: 'https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1974&auto=format&fit=crop',
        isVerified: true,
        status: 'Live',
        latestTransaction: { hash: '0x123...abc', timestamp: '2 hours ago' },
        organizer: 'Bayanihan Foundation',
        description: 'A detailed description of the typhoon relief efforts, focusing on the urgent need for food, water, and shelter for displaced families in the Bicol region. Funds will be used for emergency kits and rebuilding materials.',
        milestones: mockMilestones1,
        activity: [
            { hash: '0x123...abc', timestamp: '2 hours ago', description: 'Donation from 0xDonor...1', amount: 10000, donationMethod: 'crypto', donorAddress: '0xDonor...1' },
            { hash: '0x456...def', timestamp: '5 hours ago', description: 'Donation from 0xDonor...2', amount: 5000, donationMethod: 'qr', donorAddress: '0xDonor...2' },
            { hash: '0x789...ghi', timestamp: '1 day ago', description: 'Funds released for "Emergency Food Packs"', amount: 50000 },
        ],
    },
    {
        id: 'c2',
        title: 'Project Pag-asa: School Rebuilding',
        impact: 'Helping rebuild classrooms and provide supplies for students.',
        location: 'Marawi City, Philippines',
        goal: 90000,
        raised: 42000,
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1932&auto=format&fit=crop',
        isVerified: true,
        status: 'Live',
        latestTransaction: { hash: '0xabc...123', timestamp: '5 mins ago' },
        organizer: 'EduKa Foundation',
        description: 'Project Pag-asa aims to restore educational facilities in Marawi, giving children a safe space to learn and grow. We will focus on rebuilding classrooms and providing essential school supplies.',
        milestones: mockMilestones2,
        activity: [
             { hash: '0xabc...123', timestamp: '5 mins ago', description: 'Donation from 0xDonor...3', amount: 2000, donationMethod: 'bank', donorAddress: '0xDonor...3' },
        ],
    },
    {
        id: 'c3',
        title: 'Mindanao Community Rebuilding',
        impact: 'Long-term housing and infrastructure projects for displaced communities.',
        location: 'Mindanao, Philippines',
        goal: 500000,
        raised: 500000,
        imageUrl: 'https://images.unsplash.com/photo-1628024419618-e340a7114aca?q=80&w=2070&auto=format&fit=crop',
        isVerified: true,
        status: 'Completed',
        latestTransaction: { hash: '0xdef...456', timestamp: '3 weeks ago' },
        organizer: 'Manila Aid Network',
        description: 'This project focuses on the long-term recovery of communities in Mindanao, providing sustainable housing solutions and rebuilding essential infrastructure to foster resilience and growth.',
        milestones: mockMilestones3,
        activity: [
            { hash: '0xmno...345', timestamp: '3 weeks ago', description: 'Funds released for "Phase 3: Community Rebuilding"', amount: 150000 },
            { hash: '0xjkl...012', timestamp: '1 month ago', description: 'Funds released for "Phase 2: Housing Materials"', amount: 250000 },
            { hash: '0xghi...789', timestamp: '2 months ago', description: 'Funds released for "Phase 1: Debris Clearing"', amount: 100000 },
            { hash: '0xbig...d0n0r', timestamp: '2 months ago', description: 'Donation from 0xDonor...Big', amount: 500000, donationMethod: 'bank', donorAddress: '0xDonor...Big' },
        ],
        finalReport: {
            narrative: 'Thanks to the overwhelming support from our donors, we were able to successfully clear debris, distribute housing materials, and initiate community rebuilding projects. Families now have safe homes, and local infrastructure is on the path to recovery. This project showcases the power of collective action.',
            evidence: [{ type: 'file', value: 'https://images.unsplash.com/photo-1512499133279-b1074a09cfac2?q=80&w=2070&auto=format&fit=crop', name: 'Community_Rebuilt.jpg' }],
        },
    },
    {
        id: 'c4',
        title: 'Kusina para sa Lahat (Kitchen for All)',
        impact: 'Establishing a community kitchen to provide daily meals for the urban poor.',
        location: 'Tondo, Manila',
        goal: 150000,
        raised: 65000,
        imageUrl: 'https://images.unsplash.com/photo-1577106294407-511748a0f3a3?q=80&w=1974&auto=format&fit=crop',
        isVerified: true,
        status: 'Live',
        latestTransaction: { hash: '0xghi...789', timestamp: '1 day ago' },
        organizer: 'Kusina PH',
        description: 'A community-driven initiative to combat hunger in Tondo. We aim to provide at least one nutritious meal a day to children and families living in poverty.',
        milestones: mockMilestones4,
        activity: [],
    },
];

export const mockAssignedMilestones: AssignedMilestone[] = [
    {
        id: 'am1',
        campaignId: 'c2',
        milestoneId: 'c2-m2',
        campaignTitle: 'Project Pag-asa: School Rebuilding',
        milestoneTitle: 'Classroom Repair Materials',
        location: 'Marawi City, Philippines',
        targetAmount: 40000,
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1932&auto=format&fit=crop',
        ngoEvidence: [],
    },
];

const mockMilestoneInputs: MilestoneInput[] = [
    { title: 'Purchase of relief goods', target: 50000 },
    { title: 'Transportation and logistics', target: 20000 },
    { title: 'Volunteer mobilization', target: 10000 },
];

export const mockAssignedCampaigns: AssignedCampaign[] = [
    {
        id: 'ac1',
        title: 'Coastal Cleanup Drive',
        organizer: 'Bantay Dagat Volunteers',
        location: 'Anilao, Batangas',
        goal: 80000,
        imageUrl: 'https://images.unsplash.com/photo-1617095333140-1a28a3a3d3b7?q=80&w=2070&auto=format&fit=crop',
        documents: [{ name: 'barangay_permit.pdf', url: '#' }],
        milestones: mockMilestoneInputs,
    },
];

export const mockAssignedDeletions: AssignedDeletionRecommendation[] = [];


export const mockProfile: DonorProfile = {
    walletAddress: '0x1A2b3c4D5e6F7g8H9i0JkL1m2N3o4P5q6R7s8T9u',
    displayName: 'Alex Reyes',
    avatarUrl: 'https://i.pravatar.cc/150?u=alexreyes',
    totalDonatedPHP: 25500,
    totalDonatedETH: 0.85,
    campaignsSupported: 3,
    milestonesVerified: 5,
};

export const mockDonations: PastDonation[] = [
    { id: 'd1', campaignTitle: 'Typhoon Relief for Bicol', date: '2023-10-26', amountPHP: 10000, amountETH: 0.33, txHash: '0x123...abc', status: 'Verified' },
    { id: 'd2', campaignTitle: 'Project Pag-asa: School Rebuilding', date: '2023-10-22', amountPHP: 5000, amountETH: 0.17, txHash: '0x456...def', status: 'Verified' },
    { id: 'd3', campaignTitle: 'Mindanao Community Rebuilding', date: '2023-09-15', amountPHP: 10500, amountETH: 0.35, txHash: '0x789...ghi', status: 'Verified' },
];

export const mockBadges: NftBadge[] = [
    { id: 'b1', campaignTitle: 'Mindanao Community Rebuilding', mintDate: '2023-10-01', imageUrl: 'https://i.pravatar.cc/300?u=badge1', tokenId: 101, contractAddress: '0xNFT...abc', donationAmountPHP: 10500 },
];

export const mockAnalyticsData: AnalyticsData = {
    summary: {
        totalRaisedPHP: 12500000,
        totalRaisedETH: 416.67,
        activeCampaigns: 4,
        completedCampaigns: 1,
        verifiedMilestones: 8,
        volunteerVerifications: 12,
        totalDonors: 1234,
        fundsInEscrowPHP: 8200000,
    },
    donationsOverTime: [
        { label: 'Jan', value: 1200000 },
        { label: 'Feb', value: 1500000 },
        { label: 'Mar', value: 1100000 },
        { label: 'Apr', value: 1800000 },
        { label: 'May', value: 2500000 },
        { label: 'Jun', value: 2100000 },
        { label: 'Jul', value: 2300000 },
    ],
    fundsByRegion: [
        { name: 'Luzon', value: 5000000 },
        { name: 'Visayas', value: 3500000 },
        { name: 'Mindanao', value: 4000000 },
    ],
    milestoneRates: [
        { name: 'Verified & Released', value: 85, color: '#10B981' },
        { name: 'In Verification', value: 10, color: '#F59E0B' },
        { name: 'Rejected', value: 5, color: '#EF4444' },
    ],
    recentActivity: [
        { id: 'ra1', description: '₱5,000 donated to "Typhoon Relief for Bicol"', timestamp: '5 minutes ago', txHash: '0x...123' },
        { id: 'ra2', description: 'Milestone "Emergency Food Packs" verified', timestamp: '1 hour ago', txHash: '0x...456' },
        { id: 'ra3', description: '₱10,000 released for "Emergency Food Packs"', timestamp: '1 hour ago', txHash: '0x...789' },
    ],
};

export const mockExplorerData: PublicExplorerData = {
    stats: {
        totalDonations: 5678,
        fundsReleasedPHP: 8200000,
        milestonesVerified: 128,
        activeCampaigns: 23,
    },
    feed: [
        { id: 'e1', type: 'DONATION', timestamp: '2 mins ago', txHash: '0x...abc', campaignName: 'Typhoon Relief for Bicol', donor: '0xDonor...1', amount: 5000 },
        { id: 'e2', type: 'VERIFICATION', timestamp: '30 mins ago', txHash: '0x...def', campaignName: 'Project Pag-asa', milestoneTitle: 'School Supplies Kits', verifier: '0xVol...1', mediaUrl: 'https://images.unsplash.com/photo-1594652634010-275ab579ba46?q=80&w=2070&auto=format&fit=crop' },
        { id: 'e3', type: 'RELEASE', timestamp: '1 hour ago', txHash: '0x...ghi', campaignName: 'Project Pag-asa', amount: 30000, recipient: '0xNGO...1' },
    ],
};

export const mockCompletedCampaign: CompletedCampaignData = {
    id: 'c3',
    title: 'Mindanao Community Rebuilding',
    organizer: 'Manila Aid Network',
    completionDate: '2023-09-30',
    totalRaisedPHP: 500000,
    totalRaisedETH: 1.67,
    milestones: mockMilestones3,
    finalReport: {
        narrative: 'This is a fallback narrative. The real report should be loaded from the campaign data.',
        evidence: [{ type: 'file', value: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=1974&auto=format&fit=crop', name: 'Fallback_Image.jpg' }],
    },
    topDonors: [
        { id: 'd1', name: '0xDonor...Top1', amount: 50000 },
        { id: 'd2', name: '0xDonor...Top2', amount: 35000 },
        { id: 'd3', name: '0xDonor...Top3', amount: 20000 },
    ],
    totalDonors: 152,
};

export const mockNgoActivities: NgoActivity[] = [
    { id: 'na1', description: 'A donation of ₱10,000 was made to "Typhoon Relief for Bicol".', timestamp: '2 hours ago', transactionHash: '0x123...abc', donorAddress: '0xDonor...1' },
    { id: 'na2', description: 'Your campaign "Typhoon Relief for Bicol" is now live!', timestamp: '2 days ago' },
    { id: 'na3', description: 'Funds for milestone "Emergency Food Packs" have been released.', timestamp: '1 day ago', transactionHash: '0x789...ghi' },
];

export const mockPendingCampaigns: PendingCampaign[] = [
    {
        id: 'pc1',
        title: 'Community Garden for Tondo',
        organizer: 'GreenTondo Org',
        location: 'Tondo, Manila',
        goal: 75000,
        imageUrl: 'https://images.unsplash.com/photo-1593113646773-69316952a975?q=80&w=2070&auto=format&fit=crop',
        documents: [{ name: 'project_proposal.pdf', url: '#' }],
        submittedDate: '2023-10-25',
        milestones: [{ title: 'Land Preparation', target: 20000 }, { title: 'Seedling and Tool Purchase', target: 35000 }, { title: 'Community Training', target: 20000 }],
        volunteerVerifier: 'Volunteer Z (0x...v0lZ)',
        volunteerNote: "The organization has a solid plan and a good reputation in the community. Location is confirmed.",
        volunteerEvidence: [{ type: 'file', value: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop", name: 'location_photo.jpg' }],
    },
];

export const mockPendingReleases: PendingMilestoneRelease[] = [
    {
        id: 'pr1',
        campaignTitle: 'Typhoon Relief for Bicol',
        milestoneTitle: 'Medical Supplies',
        amount: 75000,
        volunteerVerifier: 'Volunteer B (0x...v0lB)',
        volunteerNote: 'Verified the purchase and distribution of medical kits to 50 families. All receipts are accounted for.',
        volunteerEvidence: [
            { type: 'file', value: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=2070&auto=format&fit=crop', name: 'receipts.jpg'},
            { type: 'link', value: 'https://docs.google.com/spreadsheets/d/example', name: 'Distribution Log'}
        ],
        submittedDate: '2023-10-26',
    },
];

export const mockPendingDeletions: PendingDeletionRecommendation[] = [];
export const mockAssignedFinalReports: AssignedFinalReport[] = [];
export const mockPendingFinalReports: PendingFinalReport[] = [];


export const mockAdminLogs: AdminActivity[] = [
    { id: 'al1', action: 'Approved campaign \'Typhoon Relief for Bicol\'', adminId: 'admin_01', timestamp: '2 days ago', relatedItem: mockCampaignDetails[0] },
    { id: 'al2', action: 'Rejected campaign \'Old Proposal\'', adminId: 'admin_01', timestamp: '3 days ago', rejectionReason: 'Incomplete documents.' },
    { id: 'al3', action: 'Co-signed release for "Emergency Food Packs"', adminId: 'admin_02', timestamp: '1 day ago', relatedItem: mockPendingReleases[0] },
];

export const mockVolunteerActivities: VolunteerActivity[] = [
    { id: 'va1', description: 'You submitted the report for "Medical Supplies". It is now pending admin review.', status: 'pending', timestamp: 'Just now', relatedItemTitle: 'Medical Supplies', relatedItem: mockAssignedMilestones[0] },
    { id: 'va2', description: 'Your verification for "Emergency Food Packs" was approved by the admin!', status: 'approved', timestamp: '1 day ago', relatedItemTitle: 'Emergency Food Packs' },
    { id: 'va3', description: 'A new campaign, "Coastal Cleanup Drive", has been assigned to you.', status: 'pending', timestamp: '2 days ago', relatedItemTitle: 'Coastal Cleanup Drive', relatedItem: mockAssignedCampaigns[0] },
];

export const mockAdminControlStats: AdminControlStats = {
    pendingVerifications: 5,
    activeCampaigns: 23,
    fundsInEscrowPHP: 8200000,
    verifiedNgos: 15,
};

export const mockPendingUsers: PendingUserVerification[] = [
    { id: 'u1', name: 'Juan dela Cruz', role: 'volunteer', submittedDate: '2023-10-26', status: 'Pending' },
    { id: 'u2', name: 'GreenTondo Org', role: 'ngo', submittedDate: '2023-10-25', status: 'Pending' },
    { id: 'u3', name: 'Maria Santos', role: 'donor', submittedDate: '2023-10-24', status: 'Verified' },
];

export const mockActiveEscrows: EscrowDetails[] = [
    { campaignId: 'c1', campaignTitle: 'Typhoon Relief for Bicol', amountPHP: 135000, progress: 54 },
    { campaignId: 'c2', campaignTitle: 'Project Pag-asa: School Rebuilding', amountPHP: 42000, progress: 46 },
    { campaignId: 'c4', campaignTitle: 'Kusina para sa Lahat', amountPHP: 65000, progress: 43 },
];