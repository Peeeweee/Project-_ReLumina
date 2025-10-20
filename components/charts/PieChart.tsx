import React, { useState } from 'react';
// FIX: Corrected import path for types
import { MilestoneRateData } from '../../types';

interface PieChartProps {
  data: MilestoneRateData[];
  size?: number;
  holeSize?: number;
  onSegmentClick?: (item: MilestoneRateData | null) => void;
}

const DonutSegment: React.FC<{
  item: MilestoneRateData;
  startAngle: number;
  endAngle: number;
  size: number;
  holeSize: number;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ item, startAngle, endAngle, size, holeSize, isActive, isHovered, onClick, onMouseEnter, onMouseLeave }) => {
  const radius = size / 2;
  const holeRadius = holeSize / 2;
  const start = {
    x: radius + Math.cos(startAngle) * radius,
    y: radius + Math.sin(startAngle) * radius,
  };
  const end = {
    x: radius + Math.cos(endAngle) * radius,
    y: radius + Math.sin(endAngle) * radius,
  };
  const holeStart = {
    x: radius + Math.cos(startAngle) * holeRadius,
    y: radius + Math.sin(startAngle) * holeRadius,
  };
  const holeEnd = {
    x: radius + Math.cos(endAngle) * holeRadius,
    y: radius + Math.sin(endAngle) * holeRadius,
  };
  const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

  const d = [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    `L ${holeEnd.x} ${holeEnd.y}`,
    `A ${holeRadius} ${holeRadius} 0 ${largeArcFlag} 0 ${holeStart.x} ${holeStart.y}`,
    'Z',
  ].join(' ');
  
  const dataLabel = `${item.name}: ${item.value}%`;
  const midAngle = startAngle + (endAngle - startAngle) / 2;
  const transform = isActive ? `translate(${Math.cos(midAngle) * 8}, ${Math.sin(midAngle) * 8})` : '';

  return (
    <g
      transform={transform}
      className="transition-transform duration-300 ease-out"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      <path
        d={d}
        fill={item.color}
        style={{ filter: isHovered && !isActive ? 'brightness(1.15)' : 'brightness(1)' }}
        className="transition-all duration-200"
      >
        <title>{dataLabel}</title>
      </path>
    </g>
  );
};


export const PieChart: React.FC<PieChartProps> = ({ data, size = 200, holeSize = 100, onSegmentClick }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  if (!data || data.length === 0) return null;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const handleSegmentClick = (index: number, item: MilestoneRateData) => {
    const newIndex = activeIndex === index ? null : index;
    setActiveIndex(newIndex);
    if (onSegmentClick) {
        onSegmentClick(newIndex === null ? null : item);
    }
  };

  // Handle the case of a single 100% segment, which SVG arcs can't draw
  if (data.length === 1 && data[0].value / total >= 0.999) {
    const item = data[0];
    const radius = size / 2;
    const holeRadius = holeSize / 2;
    const strokeWidth = radius - holeRadius;
    const circleRadius = holeRadius + strokeWidth / 2;
    const isActive = activeIndex === 0;
    const isHovered = hoveredIndex === 0;
    
    return (
       <div className="flex items-center space-x-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g 
              onClick={() => handleSegmentClick(0, item)}
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: 'pointer' }}
              className="transition-transform duration-300 ease-out"
              transform={isActive ? 'scale(1.05)' : 'scale(1)'}
            >
              <circle
                  cx={radius}
                  cy={radius}
                  r={circleRadius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  style={{ filter: isHovered && !isActive ? 'brightness(1.15)' : 'brightness(1)' }}
              >
                <title>{`${item.name}: ${item.value}%`}</title>
              </circle>
            </g>
        </svg>
        <div className="space-y-2">
            <div key={item.name} className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                <span className="text-sm text-brand-gray-dark">{item.name} ({item.value}%)</span>
            </div>
        </div>
      </div>
    );
  }
  
  let startAngle = -Math.PI / 2;

  return (
    <div className="flex items-center space-x-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {data.map((item, index) => {
            const angle = (item.value / total) * 2 * Math.PI;
            const endAngle = startAngle + angle;
            const segment = (
                <DonutSegment
                  key={item.name}
                  item={item}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  size={size}
                  holeSize={holeSize}
                  isActive={activeIndex === index}
                  isHovered={hoveredIndex === index}
                  onClick={() => handleSegmentClick(index, item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
            );
            startAngle = endAngle;
            return segment;
            })}
        </svg>
        <div className="space-y-2">
            {data.map(item => (
                <div key={item.name} className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm text-brand-gray-dark">{item.name} ({item.value}%)</span>
                </div>
            ))}
        </div>
    </div>
  );
};