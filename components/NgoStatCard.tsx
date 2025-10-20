import React from 'react';

interface NgoStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  onClick?: () => void;
}

export const NgoStatCard: React.FC<NgoStatCardProps> = ({ icon, label, value, onClick }) => {
  const isClickable = !!onClick;
  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`w-full bg-white rounded-lg shadow p-5 flex items-center space-x-4 text-left transition-all duration-300 ${isClickable ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}`}
    >
      <div className="bg-brand-blue-light text-brand-blue rounded-lg p-3">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-brand-gray">{label}</p>
        <p className="text-2xl font-bold text-brand-gray-dark">{value}</p>
      </div>
    </button>
  );
};
