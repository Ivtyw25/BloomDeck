import { CardPopover } from '@/components/source/CardPopover';
import { MaterialItem } from '@/types/types';
import { Layers, FileText, ArrowRight, BookOpen, Clock } from 'lucide-react';

interface MaterialCardProps {
    data: MaterialItem;
    type: 'SOURCE' | 'TRASH';
}

export default function MaterialCard({ data, type }: MaterialCardProps) {

    // Helper to calculate "Time Ago" (reused logic)
    const getTimeAgoString = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    const isFlashcard = data.type === 'FLASHCARD';

    return (
        <div className="group cursor-pointer bg-surface rounded-xl p-6 shadow-sm border border-surface-border hover:shadow-md hover:border-primary/50 transition-all duration-300 relative overflow-hidden h-full flex flex-col">

            {/* Top Section: Icon & Date */}
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${isFlashcard ? 'bg-secondary/50 text-secondary-foreground' : 'bg-blue-50 text-[#3b82f6]'}`}>
                    {isFlashcard ? <Layers className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                </div>
                <div className='items-center gap-2 flex'>
                    <div className="flex items-center gap-1 text-xs text-text-muted bg-surface-subtle px-2 py-1 rounded-lg border border-surface-border">
                        <Clock className="w-3 h-3" />
                        {getTimeAgoString(data.dateCreated)}
                    </div>
                    <CardPopover type={type} id={data.id} title={data.title} />
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 mb-4">
                <h3 className="font-heading font-bold text-lg text-text-main mb-2 line-clamp-1">{data.title}</h3>

                <div className="min-h-18">
                    {isFlashcard ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-primary text-xs font-medium rounded-full">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            {data.cardCount} Cards
                        </div>
                    ) : (
                        <p className="text-sm text-text-muted line-clamp-3 leading-relaxed">
                            {data.preview}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer Section */}
            <div className="mt-auto pt-4 border-t border-surface-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-text-muted max-w-[70%]">
                        <BookOpen className="w-3 h-3 shrink-0" />
                        <span className="truncate" title={data.sourceName}>From: {data.sourceName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
