import React from 'react';

interface AdminStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  onClick?: () => void;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({ icon, label, value, onClick }) => {
  const isClickable = !!onClick;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`w-full bg-white rounded-lg shadow p-5 flex items-start space-x-4 text-left transition-all duration-300 ${
        isClickable ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''
      }`}
    >
      <div className="bg-blue-100 text-blue-600 rounded-lg p-3">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </button>
  );
};