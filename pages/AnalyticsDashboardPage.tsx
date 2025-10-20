import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AnalyticsData, CampaignDetail, ChartDataPoint, MilestoneRateData, CampaignStatus, AggregatedDonor, VolunteerActivity, Milestone, Transaction } from '../types';
import { AnalyticsStatCard } from '../components/AnalyticsStatCard';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { DonorListModal } from '../components/DonorListModal';
import { CampaignPreviewDetail } from '../components/CampaignPreviewDetail';
import { ProgressBar } from '../components/ProgressBar';
import { 
    CurrencyDollarIcon,
    CubeTransparentIcon,
    ClipboardDocumentCheckIcon,
    UsersIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ArrowPathIcon,
    XMarkIcon,
    ClockIcon
} from '../components/icons';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
});


// --- Re-usable Detail Modal ---
const DashboardDetailModal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void; }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex justify-center items-center p-4" onClick={onClose}>
        <div className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 opacity-0 animate-cool-fade-in-scale max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-black/10 flex justify-between items-center flex-shrink-0 bg-white/70 rounded-t-lg">
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <div className="overflow-y-auto bg-gray-50/50 p-2">
                {children}
            </div>
        </div>
    </div>
);

// --- Milestone Preview Modal ---
const MilestonePreviewModal: React.FC<{ milestone: Milestone | null; onClose: () => void; }> = ({ milestone, onClose }) => {
    if (!milestone) return null;
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex justify-center items-center p-4" onClick={onClose}>
        <div className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl w-full max-w-md transform transition-all opacity-0 animate-cool-fade-in-scale text-center p-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Milestone Preview</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">{milestone.title}</h2>
            <p className="text-lg text-gray-600 mt-4">Target Amount</p>
            <p className="text-5xl font-bold text-brand-blue mt-1">₱{Number(milestone.target).toLocaleString()}</p>
            <button onClick={onClose} className="mt-8 bg-gray-100 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors">Close</button>
        </div>
      </div>
    );
};

// --- Analytics Detail Modal for Global View ---
type DetailModalContentType = 'fundsRaised' | 'totalCampaigns' | 'activeCampaigns' | 'verifiedMilestones' | 'volunteerVerifications';
interface AnalyticsDetailModalProps {
    contentType: DetailModalContentType | null;
    onClose: () => void;
    campaigns: CampaignDetail[];
    volunteerActivities: VolunteerActivity[];
}
const AnalyticsDetailModal: React.FC<AnalyticsDetailModalProps> = ({ contentType, onClose, campaigns, volunteerActivities }) => {
    const content = useMemo(() => {
        if (!contentType) return null;
        switch (contentType) {
            case 'fundsRaised':
            case 'totalCampaigns':
            case 'activeCampaigns':
                const filteredCampaigns = contentType === 'activeCampaigns' 
                    ? campaigns.filter(c => c.status === 'Live') 
                    : campaigns;
                return {
                    title: contentType === 'fundsRaised' ? 'Total Funds Raised by Campaign' : contentType === 'activeCampaigns' ? 'Active Campaigns' : 'All Campaigns',
                    body: <CampaignPreviewDetail campaigns={filteredCampaigns} />
                };
            case 'verifiedMilestones':
                // Fix: Explicitly typed the accumulator in the `reduce` function to ensure correct type inference for `milestonesByCampaign`. This resolves an issue where `milestones` was inferred as `unknown`, causing a crash when calling `.map`.
                const milestonesByCampaign = campaigns.reduce((acc: Record<string, Milestone[]>, campaign) => {
                    const verified = campaign.milestones.filter(m => m.status === 'Verified & Released');
                    if (verified.length > 0) {
                        acc[campaign.title] = verified;
                    }
                    return acc;
                }, {} as Record<string, Milestone[]>);
                return {
                    title: 'Verified Milestones',
                    body: (
                        <div className="space-y-4 p-2">
                            {Object.entries(milestonesByCampaign).map(([campaignTitle, milestones]) => (
                                <div key={campaignTitle} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                    <h4 className="font-semibold text-gray-900 px-4 py-3 bg-gray-50 border-b text-md">{campaignTitle}</h4>
                                    {/* FIX: The type of `milestones` is inferred as `unknown` from `Object.entries`. Cast it to `Milestone[]` to allow calling `.map`. */}
                                    <ul className="divide-y divide-gray-100">{(milestones as Milestone[]).map(m => (
                                        <li key={m.id} className="px-4 py-3 flex justify-between items-center text-sm">
                                            <span className="text-gray-700">{m.title}</span>
                                            <span className="font-bold text-brand-green-dark">{formatter.format(m.target)}</span>
                                        </li>
                                    ))}</ul>
                                </div>
                                ))
                            }
                        </div>
                    )
                };
            case 'volunteerVerifications':
                 const approvedActivities = volunteerActivities.filter(v => v.status === 'approved');
                return { title: 'Approved Volunteer Verifications', body: <ul className="divide-y divide-gray-100">{(approvedActivities as VolunteerActivity[]).map(activity => (<li key={activity.id} className="p-3"><p className="text-sm text-gray-800">{activity.description}</p><p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p></li>))}</ul> };
            default: return null;
        }
    }, [contentType, campaigns, volunteerActivities]);
    if (!contentType || !content) return null;
    return (
        <DashboardDetailModal title={content.title} onClose={onClose}>{content.body}</DashboardDetailModal>
    );
};

// --- Chart Preview Modal ---
interface ChartPreviewModalProps {
    chartType: 'donationsOverTime' | 'topPerforming' | 'statusBreakdown' | 'donationMethods' | 'donations' | 'milestones' | 'fundsDistribution' | 'escrowUtilization' | 'disbursementCategories' | null;
    onClose: () => void;
    lineChartData?: ChartDataPoint[];
    horizontalBarData?: { name: string, value: number }[];
    barChartData?: { name: string, value: number }[];
    pieChartData?: MilestoneRateData[];
    gaugeValue?: number;
    gaugeLabel?: string;
}
const ChartPreviewModal: React.FC<ChartPreviewModalProps> = ({ chartType, onClose, lineChartData, horizontalBarData, barChartData, pieChartData, gaugeValue, gaugeLabel }) => {
    if (!chartType) return null;

    let title = '';
    let chartElement: React.ReactNode = null;
    const chartContainerClasses = "flex justify-center items-center p-8 bg-gray-50/50 rounded-b-lg";

    switch (chartType) {
        case 'donationsOverTime':
        case 'donations':
            title = 'Donations Over Time';
            chartElement = lineChartData ? <div className={chartContainerClasses}><LineChart data={lineChartData} width={800} height={400} /></div> : null;
            break;
        case 'topPerforming':
        case 'disbursementCategories':
             title = chartType === 'topPerforming' ? 'Top Performing Live Campaigns' : 'Fund Disbursement by Category';
            chartElement = horizontalBarData ? <div className={chartContainerClasses}><HorizontalBarChart data={horizontalBarData} width={800} height={400} /></div> : null;
            break;
        case 'statusBreakdown':
            title = 'Campaign Status Breakdown';
            chartElement = barChartData ? <div className={chartContainerClasses}><BarChart data={barChartData} width={500} height={400} /></div> : null;
            break;
        case 'donationMethods':
        case 'milestones':
        case 'fundsDistribution':
            title = chartType === 'milestones' ? 'Milestone Status Breakdown' : chartType === 'fundsDistribution' ? 'Funds Distribution' : 'Donation Methods';
            chartElement = pieChartData ? <div className={chartContainerClasses}><PieChart data={pieChartData} size={350} holeSize={170} /></div> : null;
            break;
        case 'escrowUtilization':
            title = 'Escrow Utilization Rate';
            chartElement = gaugeValue !== undefined && gaugeLabel ? <div className={chartContainerClasses}><GaugeChart value={gaugeValue} label={gaugeLabel} /></div> : null;
            break;
        default:
            return null;
    }

    if (!chartElement) {
        chartElement = <div className="p-8 text-center text-gray-500">Chart data is unavailable.</div>;
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl w-full max-w-4xl transform opacity-0 animate-cool-fade-in-scale" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-black/10 flex justify-between items-center bg-white/70 rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                {chartElement}
            </div>
        </div>
    );
};


// --- HorizontalBarChart ---
const HorizontalBarChart: React.FC<{ data: {name: string, value: number}[], width?: number, height?: number }> = ({ data, width = 800, height = 250 }) => {
    const padding = { top: 10, right: 60, bottom: 20, left: 150 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...data.map(d => d.value));
    const barHeight = chartHeight / data.length;

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${padding.left}, ${padding.top})`}>{data.map((d, i) => {
            const barWidth = d.value > 0 ? (d.value / maxValue) * chartWidth : 0;
            const y = i * barHeight;
            const label = d.name.length > 25 ? `${d.name.slice(0, 22)}...` : d.name;
            return (
            <g key={d.name} className="group">
                <text x={-10} y={y + barHeight / 2} dy="0.35em" textAnchor="end" fontSize="12" fill="#374151" className="font-medium"><title>{d.name}</title>{label}</text>
                <rect x={0} y={y + barHeight * 0.15} width={barWidth} height={barHeight * 0.7} fill="#3B82F6" className="transition-opacity duration-200 group-hover:opacity-80" rx="4" ry="4"><title>{`${d.name}: ₱${d.value.toLocaleString()}`}</title></rect>
                <text x={barWidth + 5} y={y + barHeight / 2} dy="0.35em" fontSize="11" fill="#1F2937" className="font-semibold">{compactFormatter.format(d.value)}</text>
            </g>
            );
        })}</g>
        </svg>
    );
};

// --- GaugeChart Component ---
const GaugeChart: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
        <svg height="150" width="150" viewBox="0 0 150 150">
            <circle stroke="#E5E7EB" fill="transparent" strokeWidth="12" r={radius} cx="75" cy="75" />
            <circle
                stroke="#3B82F6"
                fill="transparent"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                r={radius}
                cx="75"
                cy="75"
                transform="rotate(-90 75 75)"
                className="transition-all duration-700 ease-in-out"
            />
            <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-3xl font-bold fill-current text-brand-gray-dark">
                {`${value.toFixed(1)}%`}
            </text>
        </svg>
        <p className="text-sm font-semibold text-brand-gray text-center mt-2">{label}</p>
    </div>
  );
};

// --- New Progress Stat Card ---
const ProgressStatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  progress: number;
  raised: number;
  goal: number;
  onClick?: () => void;
}> = ({ icon, label, progress, raised, goal, onClick }) => {
  const isClickable = !!onClick;
  
  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`w-full bg-white rounded-lg shadow p-5 flex flex-col text-left transition-all duration-300 space-y-4 ${isClickable ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex items-start space-x-4">
          <div className="bg-brand-blue-light text-brand-blue rounded-lg p-3">
            {icon}
          </div>
          <div>
            <p className="text-sm text-brand-gray">{label}</p>
            <p className="text-2xl font-bold text-brand-gray-dark">{`${progress.toFixed(0)}%`}</p>
          </div>
      </div>
      <div>
        <div className="flex justify-between items-baseline mb-1 text-sm">
            <span className="font-semibold text-brand-gray-dark">
                {formatter.format(raised)}
                <span className="font-normal text-brand-gray"> raised</span>
            </span>
            <span className="font-normal text-brand-gray">
                Goal: {formatter.format(goal)}
            </span>
        </div>
        <ProgressBar value={progress} />
      </div>
    </button>
  );
};


// --- Stat card for Milestone Status ---
const MilestoneStatusDetailCard = React.forwardRef<HTMLDivElement, {
  statusData: MilestoneRateData | null;
  milestones: Milestone[];
  onClose: () => void;
}>(({ statusData, milestones, onClose }, ref) => {
    if (!statusData) return null;

    const totalAmount = milestones.reduce((sum, m) => sum + m.target, 0);

    return (
      <div 
          ref={ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[280px] bg-white rounded-lg z-10 flex flex-col animate-cool-fade-in-scale shadow-2xl border"
      >
        <div className="flex justify-between items-center p-3 border-b flex-shrink-0 animate-content-fade-in-up" style={{ opacity: 0, animationDelay: '150ms' }}>
            <div className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: statusData.color }}></span>
                <h4 className="font-bold text-sm text-gray-800">{statusData.name}</h4>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-4 h-4" /></button>
        </div>
        <div className="text-center p-3 flex-shrink-0 animate-content-fade-in-up" style={{ opacity: 0, animationDelay: '250ms' }}>
            <p className="text-xs text-gray-500">Total Funds</p>
            <p className="text-2xl font-bold" style={{ color: statusData.color }}>{formatter.format(totalAmount)}</p>
        </div>
        <div className="flex-grow overflow-y-auto px-3 pb-3 animate-content-fade-in-up max-h-[120px]" style={{ opacity: 0, animationDelay: '350ms' }}>
            <ul className="space-y-1.5">
                {milestones.length > 0 ? milestones.map(m => (
                <li key={m.id} className="text-xs flex justify-between p-2 bg-gray-50 rounded-md border">
                    <span className="text-gray-700 truncate mr-2">{m.title}</span>
                    <span className="font-semibold text-gray-800 flex-shrink-0 ml-2">{formatter.format(m.target)}</span>
                </li>
                )) : <p className="text-center text-xs text-gray-400 pt-4">No milestones in this category.</p>}
            </ul>
        </div>
      </div>
    );
});

const DonationMethodDetailCard = React.forwardRef<HTMLDivElement, {
  methodData: MilestoneRateData | null;
  allCampaigns: CampaignDetail[];
  onClose: () => void;
}>(({ methodData, allCampaigns, onClose }, ref) => {
    if (!methodData) return null;

    const relevantTransactions = useMemo(() => {
        let methodKey: 'crypto' | 'qr' | 'bank' | undefined;
        if (methodData.name === 'Crypto Wallet') methodKey = 'crypto';
        else if (methodData.name === 'E-Wallet / Card') methodKey = 'qr';
        else if (methodData.name === 'Bank Transfer') methodKey = 'bank';
        
        if (!methodKey) return [];

        return allCampaigns.flatMap(campaign => 
            campaign.activity
                .filter(tx => tx.donationMethod === methodKey)
                .map(tx => ({ ...tx, campaignTitle: campaign.title }))
        );
    }, [methodData, allCampaigns]);

    const totalAmount = relevantTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    return (
      <div 
          ref={ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[300px] bg-white/70 backdrop-blur-xl rounded-lg z-10 flex flex-col animate-cool-fade-in-scale shadow-2xl border border-white/30"
          style={{ boxShadow: `0 0 20px ${methodData.color}30, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`}}
      >
        <div className="flex justify-between items-center p-3 border-b border-black/10 flex-shrink-0 animate-content-fade-in-up" style={{ opacity: 0, animationDelay: '150ms' }}>
            <div className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: methodData.color }}></span>
                <h4 className="font-bold text-sm text-gray-800">{methodData.name}</h4>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-4 h-4" /></button>
        </div>
        <div className="text-center p-3 flex-shrink-0 animate-content-fade-in-up" style={{ opacity: 0, animationDelay: '250ms' }}>
            <p className="text-xs text-gray-500">Total from {relevantTransactions.length} donations</p>
            <p className="text-2xl font-bold" style={{ color: methodData.color }}>{formatter.format(totalAmount)}</p>
        </div>
        <div className="flex-grow overflow-y-auto px-3 pb-3 animate-content-fade-in-up max-h-[150px]" style={{ opacity: 0, animationDelay: '350ms' }}>
            <ul className="space-y-1.5">
                {relevantTransactions.length > 0 ? relevantTransactions.map(tx => (
                <li key={tx.hash} className="text-xs flex justify-between p-2 bg-gray-50/70 rounded-md border border-gray-100">
                    <span className="text-gray-700 truncate mr-2" title={tx.campaignTitle}>{tx.campaignTitle}</span>
                    <span className="font-semibold text-gray-800 flex-shrink-0 ml-2">{formatter.format(tx.amount || 0)}</span>
                </li>
                )) : <p className="text-center text-xs text-gray-400 pt-4">No donations found for this method.</p>}
            </ul>
        </div>
      </div>
    );
});


// --- Per-Campaign Analytics View ---
const CampaignAnalyticsView: React.FC<{ campaign: CampaignDetail }> = ({ campaign }) => {
    const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
    const [previewMilestone, setPreviewMilestone] = useState<Milestone | null>(null);
    const [chartInPreview, setChartInPreview] = useState<'donations' | 'milestones' | 'fundsDistribution' | 'escrowUtilization' | 'disbursementCategories' | null>(null);
    const [selectedMilestoneStatus, setSelectedMilestoneStatus] = useState<MilestoneRateData | null>(null);
    const detailCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (detailCardRef.current && !detailCardRef.current.contains(event.target as Node)) {
                setSelectedMilestoneStatus(null);
            }
        }
        if (selectedMilestoneStatus) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedMilestoneStatus]);

    const campaignAnalyticsData = useMemo(() => {
        const donations = campaign.activity.filter(tx => tx.description?.toLowerCase().includes('donation'));
        const milestoneStatusCounts = campaign.milestones.reduce((acc, ms) => {
            acc[ms.status] = (acc[ms.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const milestoneRates: MilestoneRateData[] = Object.entries(milestoneStatusCounts).map(([name, value]) => ({
            name,
            value: campaign.milestones.length > 0 ? parseFloat(((Number(value) / campaign.milestones.length) * 100).toFixed(1)) : 0,
            color: name === 'Verified & Released' ? '#10B981' : name === 'In Verification' ? '#F59E0B' : name === 'Pending Volunteer Verification' ? '#3B82F6' : name === 'Locked' ? '#6B7280' : '#EF4444'
        }));
        
        return {
            summary: {
                totalDonors: new Set(donations.map(d => d.donorAddress)).size,
                verifiedMilestones: campaign.milestones.filter(m => m.status === 'Verified & Released').length,
            },
            donationsOverTime: [
                { label: 'Wk 1', value: campaign.raised * 0.2 }, { label: 'Wk 2', value: campaign.raised * 0.5 },
                { label: 'Wk 3', value: campaign.raised * 0.1 }, { label: 'Wk 4', value: campaign.raised * 0.2 },
            ],
            milestoneRates,
            recentActivity: campaign.activity.slice(0, 5).map(tx => ({ id: tx.hash, description: tx.description || 'Transaction', timestamp: tx.timestamp, txHash: tx.hash })),
        };
    }, [campaign]);
    
    const { 
        fundsDistributionData, 
        escrowUtilizationRate, 
        releasedMilestones 
    } = useMemo(() => {
        const released = campaign.milestones
            .filter(m => m.status === 'Verified & Released')
            .reduce((sum, m) => sum + m.target, 0);
        
        const escrow = campaign.raised - released;
        const unfunded = Math.max(0, campaign.goal - campaign.raised);
        const utilization = campaign.raised > 0 ? (released / campaign.raised) * 100 : 0;

        const distributionDataForPie: MilestoneRateData[] = [
            { name: 'Released', value: released, color: '#10B981' },
            { name: 'In Escrow', value: escrow, color: '#3B82F6' },
            { name: 'Unfunded Goal', value: unfunded, color: '#E5E7EB' },
        ].filter(item => item.value > 0);

        const releasedMilestonesList = campaign.milestones.filter(m => m.status === 'Verified & Released');

        return { 
            escrowUtilizationRate: utilization,
            fundsDistributionData: distributionDataForPie,
            releasedMilestones: releasedMilestonesList
        };
    }, [campaign]);

    const relevantMilestones = useMemo(() => {
        if (!selectedMilestoneStatus) return [];
        return campaign.milestones.filter(m => m.status === selectedMilestoneStatus.name);
    }, [selectedMilestoneStatus, campaign.milestones]);

    const campaignSpecificDonors = useMemo((): AggregatedDonor[] => {
        const donorMap = new Map<string, { totalDonated: number; donationCount: number }>();
        if (!campaign || !campaign.activity) return [];
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

        return Array.from(donorMap.entries()).map(([address, data]) => ({
            address,
            ...data
        })).sort((a, b) => b.totalDonated - a.totalDonated);
    }, [campaign]);

    const progress = (campaign.goal > 0) ? (campaign.raised / campaign.goal) * 100 : 0;
    
    return (
        <>
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsStatCard icon={<CurrencyDollarIcon className="w-6 h-6" />} label="Total Funds Raised" value={formatter.format(campaign.raised)} />
                <AnalyticsStatCard icon={<UsersIcon className="w-6 h-6" />} label="Unique Donors" value={`${campaignSpecificDonors.length}`} onClick={() => setIsDonorModalOpen(true)} />
                <ProgressStatCard
                  icon={<CubeTransparentIcon className="w-6 h-6" />}
                  label="Progress to Goal"
                  progress={progress}
                  raised={campaign.raised}
                  goal={campaign.goal}
                />
                <AnalyticsStatCard icon={<CheckCircleIcon className="w-6 h-6" />} label="Milestones Released" value={`${campaignAnalyticsData.summary.verifiedMilestones} / ${campaign.milestones.length}`} />
            </div>
            <main className="space-y-8">
                <div onClick={() => setChartInPreview('donations')} className="bg-white rounded-lg shadow p-6 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <h3 className="text-xl font-bold text-brand-gray-dark mb-4 group-hover:text-brand-blue transition-colors">Donations Over Time</h3>
                    <div className="w-full overflow-x-auto"><LineChart data={campaignAnalyticsData.donationsOverTime} width={900} height={300}/></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow p-6 group">
                        <h3 onClick={() => setChartInPreview('milestones')} className="text-xl font-bold text-brand-gray-dark mb-4 group-hover:text-brand-blue transition-colors cursor-pointer">Milestone Status</h3>
                        <div className="relative flex justify-center items-center h-full min-h-[250px] pt-4">
                            <PieChart 
                                data={campaignAnalyticsData.milestoneRates} 
                                size={250} 
                                holeSize={120} 
                                onSegmentClick={(item) => {
                                    if (item?.name === selectedMilestoneStatus?.name) {
                                        setSelectedMilestoneStatus(null);
                                    } else {
                                        setSelectedMilestoneStatus(item);
                                    }
                                }}
                            />
                            {selectedMilestoneStatus && (
                                <MilestoneStatusDetailCard 
                                    ref={detailCardRef}
                                    statusData={selectedMilestoneStatus}
                                    milestones={relevantMilestones}
                                    onClose={() => setSelectedMilestoneStatus(null)}
                                />
                            )}
                        </div>
                    </div>
                    <RecentActivityFeed activity={campaignAnalyticsData.recentActivity} />
                </div>
                 <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold text-brand-gray-dark mb-4">Financial Flow & Transparency</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                        <div onClick={() => setChartInPreview('fundsDistribution')} className="bg-white rounded-lg shadow-inner border p-6 flex flex-col items-center h-full cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                            <h4 className="text-md font-semibold text-brand-gray-dark text-center mb-2 w-full group-hover:text-brand-blue">Funds Distribution vs. Goal</h4>
                            <div className="flex-grow flex items-center">
                                <PieChart data={fundsDistributionData} size={220} holeSize={100} />
                            </div>
                        </div>
                        <div onClick={() => setChartInPreview('escrowUtilization')} className="bg-white rounded-lg shadow-inner border p-6 flex flex-col items-center h-full cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                            <h4 className="text-md font-semibold text-brand-gray-dark text-center mb-2 w-full group-hover:text-brand-blue">Escrow Utilization Rate</h4>
                            <div className="flex-grow flex items-center">
                                <GaugeChart value={escrowUtilizationRate} label="(Funds Released / Total Raised)" />
                            </div>
                        </div>
                        <div className="md:col-span-2 lg:col-span-1 bg-white rounded-lg shadow-inner border p-6">
                            <h4 className="text-md font-semibold text-brand-gray-dark mb-4">Released Funds Breakdown</h4>
                            <ul className="space-y-2">
                                {releasedMilestones.length > 0 ? releasedMilestones.map(m => (
                                    <li key={m.id} className="text-sm flex justify-between p-2 bg-gray-50 rounded-md border">
                                        <span className="text-gray-700 truncate mr-2">{m.title}</span>
                                        <span className="font-semibold text-brand-green-dark flex-shrink-0 ml-2">{formatter.format(m.target)}</span>
                                    </li>
                                )) : <p className="text-center text-sm text-gray-400 pt-4">No funds have been released yet.</p>}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        <DonorListModal 
            title={`Donors for "${campaign.title}"`}
            donors={campaignSpecificDonors} 
            isOpen={isDonorModalOpen} 
            onClose={() => setIsDonorModalOpen(false)} 
        />
        <MilestonePreviewModal milestone={previewMilestone} onClose={() => setPreviewMilestone(null)} />
        <ChartPreviewModal
            chartType={chartInPreview}
            onClose={() => setChartInPreview(null)}
            lineChartData={campaignAnalyticsData.donationsOverTime}
            pieChartData={chartInPreview === 'milestones' ? campaignAnalyticsData.milestoneRates : fundsDistributionData}
            gaugeValue={escrowUtilizationRate}
            gaugeLabel="(Funds Released / Total Raised)"
        />
        </>
    );
};

// --- Global Platform Analytics View ---
const GlobalAnalyticsView: React.FC<{ data: AnalyticsData, allCampaigns: CampaignDetail[], volunteerActivities: VolunteerActivity[], aggregatedDonors: AggregatedDonor[] }> = ({ data, allCampaigns, volunteerActivities, aggregatedDonors }) => {
    const [chartInPreview, setChartInPreview] = useState<'donationsOverTime' | 'topPerforming' | 'statusBreakdown' | 'donationMethods' | 'fundsDistribution' | 'disbursementCategories' | 'escrowUtilization' | null>(null);
    const [detailModalContentType, setDetailModalContentType] = useState<DetailModalContentType | null>(null);
    const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
    const [selectedDonationMethod, setSelectedDonationMethod] = useState<MilestoneRateData | null>(null);
    const donationMethodCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (donationMethodCardRef.current && !donationMethodCardRef.current.contains(event.target as Node)) {
                setSelectedDonationMethod(null);
            }
        }
        if (selectedDonationMethod) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedDonationMethod]);

    const campaignStatusCounts = useMemo(() => Object.entries(allCampaigns.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {} as Record<CampaignStatus, number>)).map(([name, value]) => ({ name, value })), [allCampaigns]);
    const donationMethods = useMemo(() => { const counts = allCampaigns.flatMap(c => c.activity).reduce((acc, tx) => { const method = tx.donationMethod || 'crypto'; acc[method] = (acc[method] || 0) + 1; return acc; }, {} as Record<string, number>); return [ { name: 'Crypto Wallet', value: counts['crypto'] || 0, color: '#3B82F6' }, { name: 'E-Wallet / Card', value: counts['qr'] || 0, color: '#8B5CF6' }, { name: 'Bank Transfer', value: counts['bank'] || 0, color: '#10B981' }, ]; }, [allCampaigns]);
    const topCampaignsData = useMemo(() => allCampaigns.filter(c => c.status === 'Live').sort((a, b) => b.raised - a.raised).slice(0, 5).map(c => ({ name: c.title, value: c.raised })).reverse(), [allCampaigns]);
    
    // --- New Financial Transparency Calculations ---
    const { totalGoal, totalReleased, totalRaised } = useMemo(() => {
        const raised = data.summary.totalRaisedPHP;
        const goal = allCampaigns.reduce((sum, c) => sum + c.goal, 0);
        const released = allCampaigns.flatMap(c => c.milestones)
            .filter(m => m.status === 'Verified & Released')
            .reduce((sum, m) => sum + m.target, 0);
        return { totalGoal: goal, totalReleased: released, totalRaised: raised };
    }, [allCampaigns, data.summary.totalRaisedPHP]);

    const totalInEscrow = totalRaised - totalReleased;
    const escrowUtilizationRate = totalRaised > 0 ? (totalReleased / totalRaised) * 100 : 0;

    const fundsDistributionData = useMemo((): MilestoneRateData[] => {
        if (totalGoal === 0) return [];
        const unfunded = Math.max(0, totalGoal - totalRaised);
        return [
            { name: 'Released', value: parseFloat(((totalReleased / totalGoal) * 100).toFixed(1)), color: '#10B981' },
            { name: 'In Escrow', value: parseFloat(((totalInEscrow / totalGoal) * 100).toFixed(1)), color: '#3B82F6' },
            { name: 'Unfunded Goal', value: parseFloat(((unfunded / totalGoal) * 100).toFixed(1)), color: '#E5E7EB' },
        ].filter(item => item.value > 0);
    }, [totalGoal, totalReleased, totalInEscrow, totalRaised]);
    
    const getCategory = (title: string): string => {
        const lowerTitle = title.toLowerCase();
        if (['food', 'meal', 'kitchen', 'nutritional'].some(kw => lowerTitle.includes(kw))) return 'Food & Nutrition';
        if (['shelter', 'housing', 'rebuilding', 'repair', 'materials'].some(kw => lowerTitle.includes(kw))) return 'Shelter & Materials';
        if (['medical', 'supplies', 'kits'].some(kw => lowerTitle.includes(kw))) return 'Supplies & Kits';
        if (['transportation', 'logistics', 'mobilization', 'training', 'clearing', 'equipment', 'community'].some(kw => lowerTitle.includes(kw))) return 'Operations & Logistics';
        return 'Other';
    };

    const disbursementCategories = useMemo(() => {
        const categories: Record<string, number> = {};
        allCampaigns.flatMap(c => c.milestones)
            .filter(m => m.status === 'Verified & Released')
            .forEach(m => {
                const category = getCategory(m.title);
                categories[category] = (categories[category] || 0) + m.target;
            });
        return Object.entries(categories)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [allCampaigns]);

    return (
        <>
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <AnalyticsStatCard icon={<CurrencyDollarIcon className="w-6 h-6" />} label="Total Funds Raised" value={`₱${(data.summary.totalRaisedPHP / 1_000_000).toFixed(2)}M`} subValue={<><p>{`${data.summary.totalRaisedETH.toFixed(2)} ETH`}</p><p className="font-semibold text-gray-600">{`₱${(data.summary.fundsInEscrowPHP / 1000).toFixed(0)}k in Escrow`}</p></>} trend="up" trendLabel="+12%" onClick={() => setDetailModalContentType('fundsRaised')} />
                 <AnalyticsStatCard icon={<UsersIcon className="w-6 h-6" />} label="Total Donors" value={`${data.summary.totalDonors}`} trend="down" trendLabel="-2%" onClick={() => setIsDonorModalOpen(true)} />
                 <AnalyticsStatCard icon={<CubeTransparentIcon className="w-6 h-6" />} label="Total Campaigns" value={`${data.summary.activeCampaigns + data.summary.completedCampaigns}`} onClick={() => setDetailModalContentType('totalCampaigns')} />
                 <AnalyticsStatCard icon={<CubeTransparentIcon className="w-6 h-6 text-brand-green-dark" />} label="Active Campaigns" value={`${data.summary.activeCampaigns}`} onClick={() => setDetailModalContentType('activeCampaigns')} />
                 <AnalyticsStatCard icon={<CheckCircleIcon className="w-6 h-6" />} label="Verified Milestones" value={`${data.summary.verifiedMilestones}`} trend="up" trendLabel="+8" onClick={() => setDetailModalContentType('verifiedMilestones')} />
                 <AnalyticsStatCard icon={<ClipboardDocumentCheckIcon className="w-6 h-6" />} label="Volunteer Verifications" value={`${data.summary.volunteerVerifications}`} onClick={() => setDetailModalContentType('volunteerVerifications')} />
            </div>
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div onClick={() => setChartInPreview('donationsOverTime')} className="bg-white rounded-lg shadow p-6 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-brand-gray-dark mb-4 group-hover:text-brand-blue transition-colors">Donations Over Time</h3>
                        <div className="w-full overflow-x-auto"><LineChart data={data.donationsOverTime} width={800} height={300}/></div>
                    </div>
                    <div onClick={() => setChartInPreview('topPerforming')} className="bg-white rounded-lg shadow p-6 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-brand-gray-dark mb-4 group-hover:text-brand-blue transition-colors">Top Performing Live Campaigns</h3>
                        {topCampaignsData.length > 0 ? <div className="w-full overflow-x-auto"><HorizontalBarChart data={topCampaignsData} /></div> : <div className="flex items-center justify-center h-full text-gray-500 py-10">No live campaigns to display.</div>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div onClick={() => setChartInPreview('statusBreakdown')} className="bg-white rounded-lg shadow p-6 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <h3 className="text-xl font-bold text-brand-gray-dark mb-4 group-hover:text-brand-blue transition-colors">Campaign Status Breakdown</h3>
                            <div className="w-full overflow-x-auto"><BarChart data={campaignStatusCounts} width={380} height={300} /></div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <h3 onClick={() => setChartInPreview('donationMethods')} className="text-xl font-bold text-brand-gray-dark mb-4 group-hover:text-brand-blue transition-colors cursor-pointer">Donation Methods</h3>
                            <div className="relative flex justify-center items-center h-full pt-4 min-h-[250px]">
                                <PieChart 
                                    data={donationMethods} 
                                    size={250} 
                                    holeSize={120}
                                    onSegmentClick={(item) => {
                                        if (item?.name === selectedDonationMethod?.name) {
                                            setSelectedDonationMethod(null);
                                        } else {
                                            setSelectedDonationMethod(item);
                                        }
                                    }}
                                />
                                {selectedDonationMethod && (
                                    <DonationMethodDetailCard
                                        ref={donationMethodCardRef}
                                        methodData={selectedDonationMethod}
                                        allCampaigns={allCampaigns}
                                        onClose={() => setSelectedDonationMethod(null)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-bold text-brand-gray-dark mb-4">Financial Transparency & Flow Analytics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                             <div onClick={() => setChartInPreview('fundsDistribution')} className="bg-white rounded-lg shadow-inner border p-6 flex flex-col items-center h-full cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                                <h4 className="text-md font-semibold text-brand-gray-dark text-center mb-2 w-full group-hover:text-brand-blue">Funds Distribution</h4>
                                <div className="flex-grow flex items-center">
                                    <PieChart data={fundsDistributionData} size={220} holeSize={100} />
                                </div>
                            </div>
                            <div onClick={() => setChartInPreview('escrowUtilization')} className="bg-white rounded-lg shadow-inner border p-6 flex flex-col items-center h-full cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                                <h4 className="text-md font-semibold text-brand-gray-dark text-center mb-2 w-full group-hover:text-brand-blue">Escrow Utilization Rate</h4>
                                <div className="flex-grow flex items-center">
                                    <GaugeChart value={escrowUtilizationRate} label="(Funds Released / Total Raised)" />
                                </div>
                            </div>
                            <div onClick={() => setChartInPreview('disbursementCategories')} className="md:col-span-2 bg-white rounded-lg shadow-inner border p-6 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                                <h4 className="text-md font-semibold text-brand-gray-dark mb-4 group-hover:text-brand-blue">Top Fund Disbursement Categories</h4>
                                <div className="w-full overflow-x-auto">
                                    {disbursementCategories.length > 0
                                        ? <HorizontalBarChart data={disbursementCategories} height={400} width={600} />
                                        : <div className="flex items-center justify-center h-full text-gray-500 py-10">No funds have been released yet.</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1"><RecentActivityFeed activity={data.recentActivity} /></div>
            </main>
        </div>
        <AnalyticsDetailModal contentType={detailModalContentType} onClose={() => setDetailModalContentType(null)} campaigns={allCampaigns} volunteerActivities={volunteerActivities} />
        <DonorListModal donors={aggregatedDonors} isOpen={isDonorModalOpen} onClose={() => setIsDonorModalOpen(false)} />
        <ChartPreviewModal
            chartType={chartInPreview}
            onClose={() => setChartInPreview(null)}
            lineChartData={data.donationsOverTime}
            horizontalBarData={chartInPreview === 'topPerforming' ? topCampaignsData : disbursementCategories}
            barChartData={campaignStatusCounts}
            pieChartData={chartInPreview === 'donationMethods' ? donationMethods : fundsDistributionData}
            gaugeValue={escrowUtilizationRate}
            gaugeLabel="(Funds Released / Total Raised)"
        />
        </>
    );
};

// --- Main Page Component ---
interface AnalyticsDashboardPageProps { data: AnalyticsData; campaigns: CampaignDetail[]; volunteerActivities: VolunteerActivity[]; aggregatedDonors: AggregatedDonor[]; }
export const AnalyticsDashboardPage: React.FC<AnalyticsDashboardPageProps> = ({ data, campaigns, volunteerActivities, aggregatedDonors }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignDetail | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => { function handleClickOutside(event: MouseEvent) { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) { setIsDropdownOpen(false); } } document.addEventListener("mousedown", handleClickOutside); return () => { document.removeEventListener("mousedown", handleClickOutside); }; }, [dropdownRef]);
  const handleCampaignSelect = (campaignId: string) => { setSelectedCampaign(campaignId === 'platform' ? null : campaigns.find(c => c.id === campaignId) || null); };
  return (
    <>
      <style>{`
        @keyframes cool-fade-in-scale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-cool-fade-in-scale {
          animation: cool-fade-in-scale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes content-fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-content-fade-in-up {
          animation: content-fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div className="bg-brand-gray-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <header className="mb-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                          <h1 className="text-4xl font-bold text-brand-gray-dark">{selectedCampaign ? `Analytics for: ${selectedCampaign.title}` : 'Platform Analytics'}</h1>
                          <p className="text-lg text-brand-gray mt-1">{selectedCampaign ? 'A detailed, real-time overview of this campaign.' : 'A transparent, real-time overview of platform-wide impact.'}</p>
                      </div>
                      <div ref={dropdownRef} className="relative flex-shrink-0 w-full md:w-auto">
                          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between w-full md:w-72 bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-2 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-brand-blue"><span className="truncate">{selectedCampaign ? `Analytics for: ${selectedCampaign.title}` : 'View Platform-Wide Analytics'}</span><ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} /></button>
                          {isDropdownOpen && (<div className="absolute top-full mt-1 w-full md:w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-20 animate-cool-fade-in-scale origin-top-right"><ul className="p-2 space-y-1"><li><button onClick={() => { handleCampaignSelect('platform'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 rounded-md hover:bg-gray-100">View Platform-Wide Analytics</button></li><li className="border-t border-gray-100 my-1"></li>{campaigns.filter(c => c.status === 'Live' || c.status === 'Completed').map(c => (<li key={c.id}><button onClick={() => { handleCampaignSelect(c.id); setIsDropdownOpen(false); }} className="w-full text-left p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-50 hover:shadow-md hover:scale-[1.02]"><div className="flex items-center space-x-3"><img src={c.imageUrl} className="w-20 h-12 object-cover rounded-md flex-shrink-0" alt={c.title} /><div className="flex-1 min-w-0"><p className="font-semibold text-gray-800 truncate">{c.title}</p><p className="text-xs text-gray-500 truncate">{c.organizer}</p><div className="flex justify-between items-baseline text-xs mt-1"><span className="font-semibold text-brand-blue">{formatter.format(c.raised)}</span><span className="text-gray-400">Goal: {compactFormatter.format(c.goal)}</span></div></div></div></button></li>))}</ul></div>)}
                      </div>
                  </div>
              </header>
              {selectedCampaign ? <CampaignAnalyticsView campaign={selectedCampaign} /> : <GlobalAnalyticsView data={data} allCampaigns={campaigns} volunteerActivities={volunteerActivities} aggregatedDonors={aggregatedDonors} />}
          </div>
      </div>
    </>
  );
};