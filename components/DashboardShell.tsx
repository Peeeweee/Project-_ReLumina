import React from 'react';

// A flexible header component for dashboards
export const DashboardHeader: React.FC<{
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <header className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
    <div>
      <h1 className="text-4xl font-bold text-brand-gray-dark">{title}</h1>
      <p className="text-lg text-brand-gray mt-1">{subtitle}</p>
    </div>
    {children && <div className="flex-shrink-0">{children}</div>}
  </header>
);

// A reusable stat card for dashboards
export const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  onClick?: () => void;
}> = ({ icon, label, value, onClick }) => {
  const isClickable = !!onClick;
  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`w-full bg-white rounded-lg shadow-sm border p-4 flex items-center space-x-3 text-left transition-all duration-300 ${isClickable ? 'hover:shadow-md hover:border-brand-blue hover:scale-105 cursor-pointer' : 'cursor-default'}`}
    >
      <div className="bg-brand-blue-light text-brand-blue rounded-lg p-2">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-brand-gray uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-brand-gray-dark">{value}</p>
      </div>
    </button>
  );
};


// The main shell component
interface DashboardShellProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ header, sidebar, mainContent }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {header}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24">
            {sidebar}
          </div>
        </aside>
        <main className="lg:col-span-8 xl:col-span-9">
          {mainContent}
        </main>
      </div>
    </div>
  );
};
