import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from './icons';

interface AnalyticsStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  onClick?: () => void;
}

export const AnalyticsStatCard: React.FC<AnalyticsStatCardProps> = ({ icon, label, value, subValue, trend, trendLabel, onClick }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';
  const isClickable = !!onClick;
  
  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`w-full bg-white rounded-lg shadow p-5 flex items-start space-x-4 text-left transition-all duration-300 ${isClickable ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'cursor-default'}`}
    >
      <div className="bg-brand-blue-light text-brand-blue rounded-lg p-3">
        {icon}
      </div>
      <div>
        <p className="text-sm text-brand-gray">{label}</p>
        <div className="flex items-baseline space-x-2 mt-1">
            <p className="text-2xl font-bold text-brand-gray-dark">{value}</p>
            {trend && trend !== 'neutral' && trendLabel && (
                <div className={`flex items-center text-xs font-semibold ${trendColor}`}>
                    {trend === 'up' ? <ChevronUpIcon className="w-4 h-4"/> : <ChevronDownIcon className="w-4 h-4"/>}
                    <span>{trendLabel}</span>
                </div>
            )}
        </div>
        {subValue && (
          <div className="text-xs text-brand-gray mt-0.5">{subValue}</div>
        )}
      </div>
    </button>
  );
};