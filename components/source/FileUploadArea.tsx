'use client';
import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { RippleButton, RippleButtonRipples } from '../animate-ui/primitives/buttons/ripple';

interface FileUploadAreaProps {
    onFilesSelected: (files: File[]) => void;
    maxFiles?: number;
    currentFileCount: number;
}

export function FileUploadArea({ onFilesSelected, maxFiles = 2, currentFileCount }: FileUploadAreaProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        onFilesSelected(droppedFiles);
    };

    if (currentFileCount >= maxFiles) {
        return (
            <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 text-center bg-gray-50/50">
                <p className="text-sm font-medium text-text-muted">
                    Maximum {maxFiles} files only
                </p>
            </div>
        );
    }

    return (
        <div
            className={`
                relative border-2 border-dashed rounded-[32px] p-12 text-center transition-all duration-300 ease-out flex flex-col items-center justify-center
                ${isDragging
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white hover:border-green-500 hover:bg-gray-50/30'
                }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="w-14 h-14 bg-green-50 shadow-xs rounded-full flex items-center justify-center mb-5 text-green-500">
                <UploadCloud className="w-6 h-6 stroke-2" />
            </div>

            <h3 className="text-lg font-semibold font-heading text-text-main mb-1.5">
                Drag & drop files here
            </h3>
            <p className="text-xs font-medium text-text-muted mb-6">
                Max {maxFiles} files. Supported: .pdf, .docx, .pptx, .txt.
            </p>

            <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.docx,.pptx,.txt"
                onChange={(e) => {
                    if (e.target.files) onFilesSelected(Array.from(e.target.files));
                }}
            />
            <RippleButton>
                <label
                    htmlFor="file-upload"
                    className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover active:scale-95 transition-all cursor-pointer shadow-md shadow-[#b5d365]/20"
                >
                    Browse Files
                </label>
                <RippleButtonRipples />
            </RippleButton>
        </div>
    );
}
