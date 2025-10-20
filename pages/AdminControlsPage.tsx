
import React, { useState } from 'react';
import { AdminStatCard } from '../components/admin_controls/AdminStatCard';
import { UserVerificationTable } from '../components/admin_controls/UserVerificationTable';
import { CampaignReviewList } from '../components/admin_controls/CampaignReviewList';
import { FundOversightDashboard } from '../components/admin_controls/FundOversightDashboard';
import { SystemSettings } from '../components/admin_controls/SystemSettings';
import { 
    UsersIcon, 
    CurrencyDollarIcon, 
    CubeTransparentIcon,
    ClipboardDocumentCheckIcon,
    Cog6ToothIcon,
} from '../components/icons';
import {
    mockAdminControlStats,
    mockPendingUsers,
    mockPendingCampaigns,
    mockActiveEscrows
} from '../data/mockData';

type AdminModule = 'overview' | 'users' | 'campaigns' | 'funds' | 'settings';

const navItems: { id: AdminModule; name: string; icon: React.ReactNode }[] = [
    { id: 'users', name: 'User Verification', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'campaigns', name: 'Campaign Review', icon: <CubeTransparentIcon className="w-5 h-5" /> },
    { id: 'funds', name: 'Fund Oversight', icon: <CurrencyDollarIcon className="w-5 h-5" /> },
    { id: 'settings', name: 'System Settings', icon: <Cog6ToothIcon className="w-5 h-5" /> },
];

export const AdminControlsPage: React.FC = () => {
    const [activeModule, setActiveModule] = useState<AdminModule>('users');

    const renderModule = () => {
        switch (activeModule) {
            case 'users':
                return <UserVerificationTable users={mockPendingUsers} />;
            case 'campaigns':
                return <CampaignReviewList campaigns={mockPendingCampaigns} />;
            case 'funds':
                return <FundOversightDashboard escrows={mockActiveEscrows} />;
            case 'settings':
                return <SystemSettings />;
            default:
                return <UserVerificationTable users={mockPendingUsers} />;
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Platform Admin Controls</h1>
                    <p className="text-sm text-gray-500">Global oversight and management dashboard.</p>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <AdminStatCard icon={<ClipboardDocumentCheckIcon className="w-6 h-6"/>} label="Pending Verifications" value={mockAdminControlStats.pendingVerifications} />
                    <AdminStatCard icon={<CubeTransparentIcon className="w-6 h-6"/>} label="Active Campaigns" value={mockAdminControlStats.activeCampaigns} />
                    <AdminStatCard icon={<CurrencyDollarIcon className="w-6 h-6"/>} label="Funds in Escrow" value={`₱${(mockAdminControlStats.fundsInEscrowPHP / 1000).toFixed(0)}k`} />
                    <AdminStatCard icon={<UsersIcon className="w-6 h-6"/>} label="Verified NGOs" value={mockAdminControlStats.verifiedNgos} />
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    <nav className="lg:w-1/4">
                        <ul className="space-y-2 bg-white p-4 rounded-lg shadow-md">
                            {navItems.map(item => (
                                <li key={item.id}>
                                    <button 
                                        onClick={() => setActiveModule(item.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md text-left transition-all duration-200 ${activeModule === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-[1.03]'}`}
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <main className="flex-1">
                        {renderModule()}
                    </main>
                </div>
            </div>
        </div>
    );
};
