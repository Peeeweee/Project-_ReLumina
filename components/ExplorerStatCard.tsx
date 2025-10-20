import React from 'react';

interface ExplorerStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export const ExplorerStatCard: React.FC<ExplorerStatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
      <div className="bg-brand-blue-light text-brand-blue rounded-full p-3">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-brand-gray">{label}</p>
        <p className="text-2xl font-bold text-brand-gray-dark">{value}</p>
      </div>
    </div>
  );
};
