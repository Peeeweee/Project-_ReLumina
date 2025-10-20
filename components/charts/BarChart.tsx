
import React from 'react';
// FIX: Corrected import path for types
import { RegionData } from '../../types';

interface BarChartProps {
  data: RegionData[];
  width?: number;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, width = 400, height = 300 }) => {
  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = chartWidth / data.length;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {/* Y-axis (hidden, for scale) */}
        <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#E5E7EB" />
        {/* X-axis */}
        <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#D1D5DB" />
        
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * chartHeight;
          const x = i * barWidth;
          const y = chartHeight - barHeight;
          return (
            <g key={d.name} className="group">
              <rect
                x={x + barWidth * 0.1}
                y={y}
                width={barWidth * 0.8}
                height={barHeight}
                fill="#3B82F6"
                className="transition-opacity duration-200 group-hover:opacity-80"
              />
              <text x={x + barWidth / 2} y={chartHeight + 15} textAnchor="middle" fontSize="10" fill="#6B7280">
                {d.name}
              </text>
              <title>{`${d.name}: ₱${d.value.toLocaleString()}`}</title>
            </g>
          );
        })}
      </g>
    </svg>
  );
};