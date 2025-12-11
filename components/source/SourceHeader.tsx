import { FileType } from '@/types/types';
import { PlayCircle, FileText, ArrowLeft } from 'lucide-react';

interface SourceHeaderProps {
    title: string;
    type: FileType;
    size?: string;
    onBack: () => void;
}

export function SourceHeader({ title, type, size, onBack }: SourceHeaderProps) {
    const getIconForType = (fileType: FileType) => {
        if (fileType === 'YOUTUBE') return <PlayCircle className="w-4 h-4 text-red-500" />;
        return <FileText className="w-4 h-4 text-primary" />;
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
            <button
                onClick={onBack}
                className="flex cursor-pointer group items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors font-medium self-start "
            >
                <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1`} />
                Back
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-white px-2 py-1 font-normal rounded text-xs text-gray-600 border border-gray-100 flex items-center gap-1 uppercase tracking-wide">
                            {getIconForType(type)}
                            {type}
                        </span>
                        <span className="text-xs text-gray-500">{size || null}</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-heading wrap-break-words">{title}</h1>
                </div>
            </div>
        </div>
    );
}
