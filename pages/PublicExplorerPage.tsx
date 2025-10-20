import React, { useState, useMemo, useRef } from 'react';
import { PublicExplorerData, FeedEvent, FeedEventType, CampaignDetail, Milestone } from '../types';
import { ExplorerStatCard } from '../components/ExplorerStatCard';
import { FeedEventCard } from '../components/FeedEventCard';
import { CampaignSearchResultCard } from '../components/CampaignSearchResultCard';
import { CampaignPreviewPopover } from '../components/CampaignPreviewPopover';
import { MilestonePreviewPopover } from '../components/MilestonePreviewPopover';
import { PreviewPanel } from '../components/PreviewPanel';
import { 
    CurrencyDollarIcon,
    LockOpenIcon,
    CheckCircleIcon,
    CubeTransparentIcon,
    MagnifyingGlassIcon
} from '../components/icons';

interface PublicExplorerPageProps {
  data: PublicExplorerData;
  campaigns: CampaignDetail[];
  onSelectDetails: (id: string) => void;
}

type PreviewType = 'campaign' | 'milestone';
interface HoverPreviewState {
  type: PreviewType;
  data: any;
  position: { top: number; right?: number, left?: number };
}
interface PinnedPreviewState {
    type: PreviewType;
    data: any;
}


const eventTypes: FeedEventType[] = ['DONATION', 'RELEASE', 'VERIFICATION', 'CAMPAIGN_APPROVAL'];

export const PublicExplorerPage: React.FC<PublicExplorerPageProps> = ({ data, campaigns, onSelectDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FeedEventType | 'ALL'>('ALL');
  
  const [hoverPreview, setHoverPreview] = useState<HoverPreviewState | null>(null);
  const [pinnedPreview, setPinnedPreview] = useState<PinnedPreviewState | null>(null);
  
  const mainContentRef = useRef<HTMLDivElement>(null);

  const filteredEvents = useMemo(() => {
    if (!data.feed) return [];
    return data.feed.filter(event => {
      const matchesFilter = activeFilter === 'ALL' || event.type === activeFilter;
      const matchesSearch = searchQuery === '' || 
        JSON.stringify(event).toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [data.feed, activeFilter, searchQuery]);
  
  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return [];
    return campaigns.filter(campaign => 
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [campaigns, searchQuery]);
  
  const calculatePosition = (e: React.MouseEvent): HoverPreviewState['position'] | null => {
    const containerRect = mainContentRef.current?.getBoundingClientRect();
    if (!containerRect) return null;

    // Position relative to the cursor for better accuracy on wide elements
    // Offset slightly above cursor to avoid flicker
    const top = e.clientY - containerRect.top - 20; 
    const popoverWidth = 320; // Corresponds to w-80
    
    // Space available to the right of the cursor within the container
    const spaceOnRight = containerRect.right - e.clientX;
    
    if (spaceOnRight > popoverWidth + 20) {
        // Position popover to the right of the cursor
        return { top, left: e.clientX - containerRect.left + 20 };
    } else {
        // Position popover to the left of the cursor
        return { top, right: containerRect.right - e.clientX + 20 };
    }
  };

  const handleHoverStart = (e: React.MouseEvent, item: FeedEvent | CampaignDetail) => {
    if (pinnedPreview) return; // Don't show hover popover if something is pinned
    
    const position = calculatePosition(e);
    if (!position) return;
    
    let type: PreviewType = 'campaign';
    let dataForPreview: any;

    if ('type' in item) { // It's a FeedEvent
        const campaign = campaigns.find(c => c.title === item.campaignName);
        if (!campaign) return;

        if (item.type === 'RELEASE' || item.type === 'VERIFICATION') {
            const milestone = campaign.milestones.find(m => m.title === item.milestoneTitle);
            if (milestone) {
                type = 'milestone';
                dataForPreview = { milestone, campaign };
            } else {
                dataForPreview = campaign;
            }
        } else {
            dataForPreview = campaign;
        }
    } else { // It's a CampaignDetail from search results
        dataForPreview = item;
    }
    
    setHoverPreview({ type, data: dataForPreview, position });
  };
  
  const handleHoverEnd = () => {
    setHoverPreview(null);
  };
  
  const handleClick = (e: React.MouseEvent, item: FeedEvent | CampaignDetail) => {
    setHoverPreview(null); // Hide hover popover on click

    // Logic to determine type and data, same as hover
    let type: PreviewType = 'campaign';
    let dataForPreview: any;
    if ('type' in item) { // FeedEvent
        const campaign = campaigns.find(c => c.title === item.campaignName);
        if (!campaign) return;
        if (item.type === 'RELEASE' || item.type === 'VERIFICATION') {
            const milestone = campaign.milestones.find(m => m.title === item.milestoneTitle);
            if (milestone) { type = 'milestone'; dataForPreview = { milestone, campaign }; }
            else { dataForPreview = campaign; }
        } else { dataForPreview = campaign; }
    } else { // CampaignDetail
        dataForPreview = item;
    }

    setPinnedPreview({ type, data: dataForPreview });
  };

  return (
    <div className="bg-brand-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-brand-gray-dark">Transparency Feed</h1>
                <p className="text-lg text-brand-gray mt-1">A live, immutable record of all platform activity, powered by the blockchain.</p>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <ExplorerStatCard icon={<CurrencyDollarIcon className="w-6 h-6"/>} label="Total Donations" value={data.stats.totalDonations.toLocaleString()} />
                <ExplorerStatCard icon={<LockOpenIcon className="w-6 h-6"/>} label="Funds Released" value={`₱${(data.stats.fundsReleasedPHP / 1000).toFixed(0)}k`} />
                <ExplorerStatCard icon={<CheckCircleIcon className="w-6 h-6"/>} label="Milestones Verified" value={data.stats.milestonesVerified} />
                <ExplorerStatCard icon={<CubeTransparentIcon className="w-6 h-6"/>} label="Active Campaigns" value={data.stats.activeCampaigns} />
            </div>

            <main ref={mainContentRef} className="bg-white rounded-lg shadow p-6 relative">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                     <div className="relative w-full md:w-1/2 lg:w-1/3">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text"
                            placeholder="Search campaigns or events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-brand-blue focus:border-brand-blue"
                        />
                     </div>
                    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
                        {(['ALL', ...eventTypes] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveFilter(type)}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors capitalize ${
                                    activeFilter === type ? 'bg-brand-blue text-white shadow' : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {type.replace('_', ' ').toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {searchQuery ? (
                    <div className="space-y-8">
                        {filteredCampaigns.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold text-brand-gray-dark pb-3 border-b">Campaign Results ({filteredCampaigns.length})</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {filteredCampaigns.map(campaign => (
                                        <div 
                                          key={campaign.id}
                                          onMouseEnter={(e) => handleHoverStart(e, campaign)}
                                          onMouseLeave={handleHoverEnd}
                                          onClick={(e) => handleClick(e, campaign)}
                                        >
                                            <CampaignSearchResultCard campaign={campaign} onClick={() => onSelectDetails(campaign.id)} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {filteredEvents.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold text-brand-gray-dark pb-3 border-b">Event Results ({filteredEvents.length})</h3>
                                <div className="space-y-4 mt-4">
                                    {filteredEvents.map(event => (
                                        <div 
                                            onMouseEnter={(e) => handleHoverStart(e, event)}
                                            onMouseLeave={handleHoverEnd}
                                            onClick={(e) => handleClick(e, event)}
                                            key={event.id}
                                        >
                                            <FeedEventCard event={event} viewMode={'detailed'} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {filteredCampaigns.length === 0 && filteredEvents.length === 0 && (
                            <div className="text-center py-12 text-brand-gray">
                                <h3 className="text-xl font-semibold">No results found.</h3>
                                <p>Try adjusting your search or filter criteria.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredEvents.map(event => (
                           <div 
                                onMouseEnter={(e) => handleHoverStart(e, event)}
                                onMouseLeave={handleHoverEnd}
                                onClick={(e) => handleClick(e, event)}
                                key={event.id}
                            >
                                <FeedEventCard event={event} viewMode={'detailed'} />
                           </div>
                        ))}
                        {filteredEvents.length === 0 && (
                            <div className="text-center py-12 text-brand-gray">
                                <h3 className="text-xl font-semibold">No platform activity yet.</h3>
                            </div>
                        )}
                    </div>
                )}
                
                {hoverPreview && (
                    <div 
                        className="absolute z-10 animate-scale-in pointer-events-none" 
                        style={{ 
                            top: hoverPreview.position.top, 
                            left: hoverPreview.position.left,
                            right: hoverPreview.position.right
                        }}
                    >
                        {hoverPreview.type === 'campaign' && hoverPreview.data && (
                            <CampaignPreviewPopover campaign={hoverPreview.data} />
                        )}
                        {hoverPreview.type === 'milestone' && hoverPreview.data && (
                            <MilestonePreviewPopover milestone={hoverPreview.data.milestone} campaign={hoverPreview.data.campaign} />
                        )}
                    </div>
                )}

                 {pinnedPreview && (
                    <PreviewPanel
                        type={pinnedPreview.type}
                        data={pinnedPreview.data}
                        onClose={() => setPinnedPreview(null)}
                        onViewDetails={onSelectDetails}
                    />
                )}

            </main>
        </div>
    </div>
  );
};