import { SourceDocument, FileType } from '@/types/types';
import { FileText, File, Presentation, FileCode } from 'lucide-react';
import { YouTubeIcon } from '@/lib/icons';
import { CardPopover } from '@/components/source/CardPopover';
import Link from 'next/link';

interface SourceCardProps {
    data: SourceDocument;
    type: 'SOURCE' | 'TRASH';
}

export default function SourceCard({ data, type }: SourceCardProps) {

    // Helper to calculate "Time Ago"
    const getTimeAgoString = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return "Just now";
    };

    const getSingleIcon = (type: FileType, className: string) => {
        switch (type) {
            case 'PDF': return <FileText className={`${className} text-[#ef4444]`} strokeWidth={2} />;
            case 'PPT': return <Presentation className={`${className} text-[#f97316]`} strokeWidth={2} />;
            case 'DOCX': return <FileCode className={`${className} text-[#3b82f6]`} strokeWidth={2} />;
            case 'YOUTUBE': return <YouTubeIcon className={`${className} text-[#ff0000]`} />;
            default: return <File className={`${className} text-gray-500`} strokeWidth={2} />;
        }
    };

    const getBgColorForType = (type: FileType) => {
        switch (type) {
            case 'PDF': return 'bg-[#fef2f2]';
            case 'PPT': return 'bg-[#fff7ed]';
            case 'DOCX': return 'bg-[#eff6ff]';
            case 'YOUTUBE': return 'bg-[#fef2f2]';
            default: return 'bg-gray-50';
        }
    };

    const renderIconArea = () => {
        if (data.type === 'MIXED' && data.containedTypes && data.containedTypes.length >= 2) {
            const type1 = data.containedTypes[0];
            const type2 = data.containedTypes[1];

            return (
                <div className="flex w-14 h-14 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5">
                    <div className={`w-1/2 h-full flex items-center justify-center ${getBgColorForType(type1)}`}>
                        {getSingleIcon(type1, "w-5 h-5")}
                    </div>
                    <div className={`w-1/2 h-full flex items-center justify-center ${getBgColorForType(type2)}`}>
                        {getSingleIcon(type2, "w-5 h-5")}
                    </div>
                </div>
            );
        }

        return (
            <div className={`w-14 h-14 flex items-center justify-center rounded-xl transition-colors shadow-sm ring-1 ring-black/5 ${getBgColorForType(data.type)}`}>
                {getSingleIcon(data.type, "w-7 h-7")}
            </div>
        );
    };

    return (
        <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300 relative overflow-hidden flex flex-col h-full ">
            {/* Clickable Overlay Link */}
            {type !== 'TRASH' && (
                <Link href={`/source/${data.id}`} className="cursor-pointer absolute inset-0 z-0" aria-label={`View ${data.title}`} />
            )}

            {/* Selection/Hover Indicator - Left Border */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-full z-10"></div>

            <div className="flex items-start justify-between h-full relative z-10 pointer-events-none">
                <div className="flex items-start gap-4 w-full">
                    <div className="shrink-0 pt-1">
                        {renderIconArea()}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                        <h3 className="font-heading font-bold text-gray-900 line-clamp-1 break-all text-sm lg:text-md leading-tight mb-1.5" >
                            {data.title}
                        </h3>

                        {/* Meta Info Row */}
                        <div className="flex flex-wrap items-center gap-2 text-xs lg:text-[13px] font-medium text-gray-400">
                            <span className="uppercase text-gray-500 font-semibold text-[10px] lg:text-xs tracking-wide">{data.type === 'MIXED' ? 'Mixed Sources' : data.type}</span>

                            {data.size && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>{data.size}</span>
                                </>
                            )}

                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span suppressHydrationWarning>
                                {type === 'TRASH' && data.trashDate
                                    ? `trashed ${getTimeAgoString(data.trashDate)}`
                                    : `created ${getTimeAgoString(data.dateAdded)}`}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pointer-events-auto">
                    <CardPopover type={type} id={data.id} title={data.title} docType="SOURCE" fileStoresId={data.fileSearchStoreID || null} />
                </div>
            </div>
        </div>
    );
};
