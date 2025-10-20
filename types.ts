import React from 'react';

// Shared base types
export interface Transaction {
  hash: string;
  timestamp: string;
  description?: string;
  amount?: number;
  donorAddress?: string;
  donationMethod?: 'crypto' | 'qr' | 'bank';
}

// This is now the single source of truth for a campaign's lifecycle state.
export type CampaignStatus = 
  | 'Live'
  | 'Completed'
  | 'Awaiting Admin Verification'
  | 'Pending Volunteer Verification'
  | 'Rejected'
  | 'Draft'
  | 'Completion Pending Volunteer Review'
  | 'Completion Pending Admin Approval'
  | 'Pending Final Report';

export interface Campaign {
  id: string;
  title: string;
  impact: string;
  location: string;
  goal: number;
  raised: number;
  imageUrl: string;
  isVerified: boolean;
  status: CampaignStatus;
  latestTransaction: Transaction;
  rejectionReason?: string;
}

// New unified type for all evidence attachments
export interface EvidenceItem {
    type: 'file' | 'link';
    value: string; // URL for file or the link itself
    name: string; // filename for file, or title for the link
}


// Campaign Details
export type MilestoneStatus = 'Verified & Released' | 'In Verification' | 'Locked' | 'Rejected' | 'Pending Volunteer Verification';

export interface Milestone {
  id: string;
  title: string;
  target: number;
  status: MilestoneStatus;
  verifier?: string;
  verificationTx?: string;
  rejectionReason?: string;
}

export interface CampaignDetail extends Campaign {
  organizer: string;
  description: string;
  milestones: Milestone[];
  activity: Transaction[];
  finalReport?: FinalReport;
}

// Volunteer types
export interface AssignedMilestone {
    id: string;
    campaignId: string; // Added campaignId for easier state updates
    milestoneId: string; // Added milestoneId for easier state updates
    campaignTitle: string;
    milestoneTitle: string;
    location: string;
    targetAmount: number;
    imageUrl: string;
    ngoEvidence: EvidenceItem[]; // NGO can provide evidence for the volunteer to review
}

export interface AssignedCampaign {
    id: string; 
    title: string;
    organizer: string;
    location: string;
    goal: number;
    imageUrl: string;
    documents: { name: string; url: string }[];
    milestones: MilestoneInput[]; // Added milestones for volunteer review
}

export interface AssignedDeletionRecommendation {
    id: string;
    campaign: CampaignDetail;
    recommenderInfo: string; // e.g., "Admin: current_admin" or "NGO: Bayanihan Foundation"
    reason: string;
    assignedDate: string;
}

export interface AssignedFinalReport {
    id: string; // campaignId
    campaignTitle: string;
    location: string;
    imageUrl: string;
    ngoReport: string;
    ngoEvidence: EvidenceItem[];
    submittedDate: string;
}


// FIX: Add PendingFinalReport to the VolunteerRelatedItem union type to fix type error in App.tsx.
export type VolunteerRelatedItem = AssignedCampaign | AssignedMilestone | PendingCampaign | PendingMilestoneRelease | CampaignDetail | PendingDeletionRecommendation | AssignedDeletionRecommendation | AssignedFinalReport | PendingFinalReport;

export interface VolunteerActivity {
    id: string;
    description: string;
    timestamp: string;
    status: 'pending' | 'approved' | 'rejected';
    relatedItemTitle: string;
    relatedItem?: VolunteerRelatedItem;
    rejectionReason?: string;
}


// Admin types
export interface PendingCampaign {
    id: string;
    title: string;
    organizer: string;
    location: string;
    goal: number;
    imageUrl: string;
    documents: { name: string; url: string }[];
    submittedDate: string;
    milestones: MilestoneInput[]; // Added milestones for admin review
    volunteerVerifier?: string;
    volunteerNote?: string;
    volunteerEvidence?: EvidenceItem[];
}

export interface PendingMilestoneRelease {
    id: string;
    campaignTitle: string;
    milestoneTitle: string;
    amount: number;
    volunteerVerifier: string;
    volunteerNote: string;
    volunteerEvidence: EvidenceItem[];
    submittedDate: string;
}

export interface PendingDeletionRecommendation {
    id: string;
    campaign: CampaignDetail;
    submittedDate: string;
    // Details of who is making the recommendation now for the admin
    recommender: {
        id: string; // volunteerId or other identifier
        note: string;
        evidence: EvidenceItem[];
    };
    // Optional: details of the original request if this is a review
    originalRequest?: {
        recommenderInfo: string;
        reason: string;
    }
}


export interface PendingFinalReport {
    id: string; // some unique id for the report itself, or campaignId
    campaignId: string;
    campaignTitle: string;
    ngoReport: string;
    ngoEvidence: EvidenceItem[];
    volunteerId: string;
    volunteerNote: string;
    volunteerEvidence: EvidenceItem[];
    submittedDate: string;
}

export type AdminRelatedItem = PendingCampaign | PendingMilestoneRelease | AssignedCampaign | CampaignDetail | PendingDeletionRecommendation | PendingFinalReport;


export interface AdminActivity {
    id: string;
    action: string;
    adminId: string;
    timestamp: string;
    relatedItem?: AdminRelatedItem; // Updated to include AssignedCampaign
    rejectionReason?: string;
}

// Donor Profile types
export interface DonorProfile {
    walletAddress: string;
    displayName: string;
    avatarUrl: string;
    totalDonatedPHP: number;
    totalDonatedETH: number;
    campaignsSupported: number;
    milestonesVerified: number;
}

export interface PastDonation {
    id: string;
    campaignTitle: string;
    date: string;
    amountPHP: number;
    amountETH: number;
    txHash: string;
    status: 'Verified' | 'Pending Verification';
}

export interface NftBadge {
    id: string;
    campaignTitle: string;
    mintDate: string;
    imageUrl: string;
    tokenId: number;
    contractAddress: string;
    donationAmountPHP: number;
}

// Analytics types
export interface AnalyticsSummaryData {
    totalRaisedPHP: number;
    totalRaisedETH: number;
    activeCampaigns: number;
    completedCampaigns: number;
    verifiedMilestones: number;
    volunteerVerifications: number;
    totalDonors: number;
    fundsInEscrowPHP: number;
}

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface RegionData {
    name: string;
    value: number;
}

export interface MilestoneRateData {
    name: string;
    value: number;
    color: string;
}

export interface AnalyticsRecentActivity {
    id: string;
    description: string;
    timestamp: string;
    txHash: string;
}

export interface AnalyticsData {
    summary: AnalyticsSummaryData;
    donationsOverTime: ChartDataPoint[];
    fundsByRegion: RegionData[];
    milestoneRates: MilestoneRateData[];
    recentActivity: AnalyticsRecentActivity[];
}

// Public Explorer types
export interface ExplorerStats {
    totalDonations: number;
    fundsReleasedPHP: number;
    milestonesVerified: number;
    activeCampaigns: number;
}

export type FeedEventType = 'DONATION' | 'VERIFICATION' | 'RELEASE' | 'CAMPAIGN_APPROVAL';

export interface FeedEvent {
    id: string;
    type: FeedEventType;
    timestamp: string;
    txHash: string;
    campaignName: string;
    // Optional fields depending on type
    donor?: string;
    amount?: number;
    milestoneTitle?: string;
    verifier?: string;
    mediaUrl?: string;
    recipient?: string;
}

export interface PublicExplorerData {
    stats: ExplorerStats;
    feed: FeedEvent[];
}


// Campaign Completion types
export interface CompletedMilestone extends Milestone {}

export interface FinalReport {
    narrative: string;
    evidence: EvidenceItem[];
}

export interface TopDonor {
    id: string;
    name: string;
    amount: number;
}

export interface CompletedCampaignData {
    id: string;
    title: string;
    organizer: string;
    completionDate: string;
    totalRaisedPHP: number;
    totalRaisedETH: number;
    milestones: CompletedMilestone[];
    finalReport: FinalReport;
    topDonors: TopDonor[];
    totalDonors: number;
}

// NGO-related types
export interface NgoActivity {
    id: string;
    description: string;
    timestamp: string;
    transactionHash?: string;
    donorAddress?: string;
}

// Create Campaign types
export interface MilestoneInput {
    title: string;
    target: number | ''; // Allow empty string for initial state
}

// KYC/Onboarding types
export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin' | 'guest';

export interface KycFormData {
    name: string;
    organization: string;
    region: string;
    contact: string;
    identityDoc: File | null;
    role: UserRole | null;
}
// FIX: Add missing types for Admin Controls Page
// Admin Controls Page types
export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export interface PendingUserVerification {
    id: string;
    name: string;
    role: UserRole;
    submittedDate: string;
    status: VerificationStatus;
}

export interface EscrowDetails {
    campaignId: string;
    campaignTitle: string;
    amountPHP: number;
    progress: number; // percentage
}

export interface AdminControlStats {
    pendingVerifications: number;
    activeCampaigns: number;
    fundsInEscrowPHP: number;
    verifiedNgos: number;
}

// Platform-wide donation feed type
export interface AggregatedDonation {
    campaignTitle: string;
    transaction: Transaction;
}

export interface AggregatedDonor {
  address: string;
  totalDonated: number;
  donationCount: number;
}