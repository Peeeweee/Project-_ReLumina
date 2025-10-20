import React from 'react';
// FIX: Corrected import path for types
import { PendingDeletionRecommendation } from '../types';
// FIX: Corrected import path for icons
import { ArrowTopRightOnSquareIcon } from './icons';
import { EvidenceViewer } from './EvidenceViewer';

interface DeletionRecommendationDetailProps {
    item: PendingDeletionRecommendation;
    onDeleteClick: () => void;
    onDismissClick: () => void;
}

export const DeletionRecommendationDetail: React.FC<DeletionRecommendationDetailProps> = ({ item, onDeleteClick, onDismissClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 border-l-4 border-red-500">
            <div>
                <span className="text-sm font-semibold text-red-600">DELETION RECOMMENDATION</span>
                <h2 className="text-2xl font-bold text-gray-800">{item.campaign.title}</h2>
                <p className="text-gray-600">Campaign by: {item.campaign.organizer}</p>
                <p className="text-sm text-gray-500">Submitted: {item.submittedDate}</p>
            </div>

            {item.originalRequest && (
                 <div className="border-t pt-4 space-y-2">
                    <h3 className="font-semibold text-gray-700">Original Request</h3>
                    <p className="text-sm text-gray-600">
                        <strong>Source:</strong> {item.originalRequest.recommenderInfo}
                    </p>
                    <div className="text-sm text-gray-800 p-3 bg-red-50 rounded-md border border-red-200 italic">
                        "{item.originalRequest.reason}"
                    </div>
                </div>
            )}

            <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold text-gray-700">Volunteer's Justification</h3>
                <p className="text-sm text-gray-600">
                    <strong>Verifier:</strong> {item.recommender.id}
                </p>
                <div className="text-sm text-gray-800 p-3 bg-red-50 rounded-md border border-red-200 italic">
                    "{item.recommender.note}"
                </div>
                 <div className="mt-2">
                    <EvidenceViewer evidence={item.recommender.evidence} title="Volunteer Evidence"/>
                </div>
            </div>
            <div className="border-t pt-6 flex space-x-3">
                <button
                    onClick={onDismissClick}
                    className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300"
                >
                    Dismiss Recommendation
                </button>
                 <button
                    onClick={onDeleteClick}
                    className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700"
                >
                    Delete Campaign
                </button>
            </div>
        </div>
    );
};