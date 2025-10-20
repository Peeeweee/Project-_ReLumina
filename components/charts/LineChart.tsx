import React, { useState } from 'react';
import { ChartDataPoint } from '../../types';

interface LineChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data, width = 500, height = 300 }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value), 0);
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
  const yScale = (value: number) => chartHeight - (maxValue > 0 ? (value / maxValue) * chartHeight : 0);

  const points = data.map((d, i) => `${xScale(i)},${yScale(d.value)}`).join(' ');

  const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
    const value = maxValue > 0 ? (maxValue / 4) * i : 0;
    return {
      value: value,
      y: yScale(value),
    };
  });
  
  const handlePointClick = (index: number) => {
    setActiveIndex(prevIndex => prevIndex === index ? null : index);
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g 
        transform={`translate(${padding.left}, ${padding.top})`}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Click background to deselect */}
        <rect 
            x={0} 
            y={0} 
            width={chartWidth} 
            height={chartHeight} 
            fill="transparent" 
            onClick={() => setActiveIndex(null)}
            className="cursor-pointer"
        />
        {/* Y-axis */}
        <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#D1D5DB" />
        {yAxisLabels.map(label => (
          <g key={label.value}>
            <line x1="-5" y1={label.y} x2="0" y2={label.y} stroke="#D1D5DB" />
            <text x="-10" y={label.y} dy="0.32em" textAnchor="end" fontSize="10" fill="#6B7280">
              {`${(label.value / 1000)}k`}
            </text>
          </g>
        ))}

        {/* X-axis */}
        <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#D1D5DB" />
        {data.map((d, i) => (
          <text key={d.label} x={xScale(i)} y={chartHeight + 15} textAnchor="middle" fontSize="10" fill="#6B7280">
            {d.label}
          </text>
        ))}

        {/* Data Line */}
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={points}
        />

        {/* Data Points with enhanced tooltips */}
        {data.map((d, i) => {
            const cx = xScale(i);
            const cy = yScale(d.value);
            const tooltipText = `₱${d.value.toLocaleString()}`;
            const textLength = tooltipText.length;
            const tooltipWidth = textLength * 5.5 + 16; // Heuristic for width
            const isActive = activeIndex === i;
            const isHovered = hoveredIndex === i;
            const isVisible = isActive || isHovered;

            return (
                <g 
                    key={i} 
                    onClick={(e) => { e.stopPropagation(); handlePointClick(i); }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {/* Highlight ring for active point */}
                    {isActive && <circle cx={cx} cy={cy} r="8" fill="#3B82F6" fillOpacity="0.3" />}

                    {/* The data point circle */}
                    <circle
                        cx={cx}
                        cy={cy}
                        r="4"
                        fill="#3B82F6"
                        stroke="white"
                        strokeWidth="2"
                    />

                    {/* Invisible larger circle for easier hover/click target */}
                    <circle cx={cx} cy={cy} r="12" fill="transparent" className="cursor-pointer" />

                    {/* Tooltip Group: Show on group hover OR if active */}
                    <g
                        className={`transition-opacity duration-200 pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                        transform={`translate(${cx}, ${cy - 15})`}
                    >
                        {/* Tooltip background */}
                        <rect
                            x={-tooltipWidth / 2}
                            y={-22}
                            width={tooltipWidth}
                            height={20}
                            rx="4"
                            fill="#1F2937" // brand-gray-dark
                        />
                        {/* Tooltip text */}
                        <text
                            x="0"
                            y={-12}
                            textAnchor="middle"
                            fontSize="10"
                            fill="white"
                            fontWeight="600"
                        >
                            {tooltipText}
                        </text>
                        {/* Tooltip pointer/arrow */}
                        <polygon points="0,0 -4,-4 4,-4" fill="#1F2937" />
                    </g>
                </g>
            );
        })}
      </g>
    </svg>
  );
};