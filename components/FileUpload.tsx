import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// FIX: Corrected import path for icons
import { ArrowUpTrayIcon, XCircleIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    onFileSelect(null);
    if (preview) {
        URL.revokeObjectURL(preview);
    }
  };

  if (file && preview) {
    return (
      <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-300">
        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        <button
          onClick={removeFile}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
          aria-label="Remove image"
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full p-6 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-brand-blue bg-blue-50' : 'border-gray-300 hover:border-brand-blue'}`}
    >
      <input {...getInputProps()} />
      <ArrowUpTrayIcon className="w-10 h-10 mx-auto text-gray-400 mb-2" />
      <p className="text-sm text-brand-gray-dark">
        <span className="font-semibold text-brand-blue">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-brand-gray">PNG, JPG, GIF up to 10MB</p>
    </div>
  );
};