import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { EvidenceItem } from '../types';
import { ArrowUpTrayIcon, XCircleIcon, LinkIcon, DocumentTextIcon, CameraIcon, PlusIcon } from './icons';

interface EvidenceUploaderProps {
  onEvidenceChange: (evidence: EvidenceItem[]) => void;
}

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        return <CameraIcon className="w-5 h-5 text-gray-500" />;
    }
    if (extension === 'pdf') {
        return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
    }
    return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ onEvidenceChange }) => {
    const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkName, setLinkName] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);

    const updateParent = (items: EvidenceItem[]) => {
        setEvidenceItems(items);
        onEvidenceChange(items);
    };
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFileItems: EvidenceItem[] = acceptedFiles.map(file => ({
            type: 'file',
            name: file.name,
            value: URL.createObjectURL(file), // This value should be handled appropriately for actual uploads
        }));
        updateParent([...evidenceItems, ...newFileItems]);
    }, [evidenceItems, onEvidenceChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf'],
        },
    });

    const handleRemoveItem = (index: number) => {
        const item = evidenceItems[index];
        if (item.type === 'file') {
            URL.revokeObjectURL(item.value);
        }
        const newItems = evidenceItems.filter((_, i) => i !== index);
        updateParent(newItems);
    };

    const handleAddLink = () => {
        if (linkUrl.trim() && linkName.trim()) {
            const newLinkItem: EvidenceItem = {
                type: 'link',
                name: linkName,
                value: linkUrl,
            };
            updateParent([...evidenceItems, newLinkItem]);
            setLinkUrl('');
            setLinkName('');
            setShowLinkInput(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* --- File Dropzone --- */}
            <div
                {...getRootProps()}
                className={`w-full p-6 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-brand-blue bg-blue-50' : 'border-gray-300 hover:border-brand-blue'
                }`}
            >
                <input {...getInputProps()} />
                <ArrowUpTrayIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-brand-gray-dark">
                    <span className="font-semibold text-brand-blue">Click to upload files</span> or drag and drop
                </p>
                <p className="text-xs text-brand-gray">Images and PDFs supported</p>
            </div>

            {/* --- Add Link Section --- */}
            {showLinkInput ? (
                <div className="p-3 bg-gray-50 rounded-md border space-y-2">
                     <input type="text" value={linkName} onChange={e => setLinkName(e.target.value)} placeholder="Link Name (e.g., 'Google Sheet Log')" className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md"/>
                     <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md"/>
                     <div className="flex justify-end space-x-2">
                        <button onClick={() => setShowLinkInput(false)} className="text-xs font-semibold text-gray-600 px-2 py-1 rounded-md hover:bg-gray-200">Cancel</button>
                        <button onClick={handleAddLink} className="text-xs font-semibold text-white bg-brand-blue px-3 py-1 rounded-md hover:bg-brand-blue-dark">Add Link</button>
                     </div>
                </div>
            ) : (
                <button onClick={() => setShowLinkInput(true)} className="w-full flex items-center justify-center space-x-2 text-sm text-brand-blue font-semibold p-2 rounded-md hover:bg-blue-50">
                    <LinkIcon className="w-4 h-4" />
                    <span>Add a link</span>
                </button>
            )}

            {/* --- Evidence List --- */}
            {evidenceItems.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Attachments</h4>
                    {evidenceItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md text-sm">
                            <div className="flex items-center space-x-2 truncate">
                                {item.type === 'file' ? getFileIcon(item.name) : <LinkIcon className="w-5 h-5 text-gray-500" />}
                                <span className="text-gray-800 truncate" title={item.name}>{item.name}</span>
                            </div>
                            <button onClick={() => handleRemoveItem(index)} className="p-1 text-gray-400 hover:text-red-600">
                                <XCircleIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};