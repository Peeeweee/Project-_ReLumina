import React from 'react';
import { EvidenceItem } from '../types';
import { LinkIcon, DocumentTextIcon, CameraIcon, ArrowTopRightOnSquareIcon } from './icons';

interface EvidenceViewerProps {
  evidence: EvidenceItem[];
  title?: string;
}

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        return <CameraIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />;
    }
    if (extension === 'pdf') {
        return <DocumentTextIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />;
    }
    return <DocumentTextIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />;
};

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ evidence, title = "Submitted Evidence" }) => {
  if (!evidence || evidence.length === 0) {
    return (
        <div>
            <h3 className="font-semibold text-gray-700">{title}</h3>
            <p className="text-sm text-gray-500 italic mt-1">No evidence was provided.</p>
        </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <div className="mt-2 space-y-2">
        {evidence.map((item, index) => (
          <a
            key={index}
            href={item.value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md border text-sm text-left transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm"
          >
            <div className="flex items-center space-x-2 truncate">
                {item.type === 'file' ? getFileIcon(item.name) : <LinkIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />}
                <span className="font-medium text-gray-800 truncate" title={item.name}>{item.name}</span>
            </div>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
          </a>
        ))}
      </div>
    </div>
  );
};