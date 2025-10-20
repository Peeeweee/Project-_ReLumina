import React from 'react';
// FIX: Corrected import path for types
import { FinalReport } from '../types';
import { EvidenceViewer } from './EvidenceViewer';

interface ImpactReportProps {
  report: FinalReport;
  onViewReportClick: () => void;
}

export const ImpactReport: React.FC<ImpactReportProps> = ({ report, onViewReportClick }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-brand-gray-dark">Final Impact Report</h2>
        <button
          onClick={onViewReportClick}
          className="bg-gray-100 text-sm text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
        >
          View Submitted Report
        </button>
      </div>
      <p className="text-base text-brand-gray-dark leading-relaxed mb-6">{report.narrative}</p>
      
      <div className="border-t pt-4">
        <EvidenceViewer evidence={report.evidence} title="Final Evidence" />
      </div>
    </div>
  );
};