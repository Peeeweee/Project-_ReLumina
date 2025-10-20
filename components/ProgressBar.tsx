
import React from 'react';

interface ProgressBarProps {
  value: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const progress = Math.max(0, Math.min(100, value));

  return (
    <div
      className="w-full bg-brand-gray-light rounded-full h-2.5"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Funding progress"
    >
      <div
        className="bg-brand-blue h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
