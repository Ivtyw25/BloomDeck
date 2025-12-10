import { CardPopover } from '@/components/source/CardPopover';
import { MaterialItem } from '@/types/types';
import { Layers, FileText } from 'lucide-react';

interface MaterialCardProps {
    data: MaterialItem;
    type: 'SOURCE' | 'TRASH';
}

import { useRouter } from 'next/navigation';

export default function MaterialCard({ data, type }: MaterialCardProps) {
    const router = useRouter();

    // Helper to calculate "Time Ago" (reused logic)
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

    const isFlashcard = data.type === 'FLASHCARD';

    return (
        <div
            onClick={() => router.push(`/materials/${data.id}`)}
            className="group cursor-pointer bg-surface rounded-xl p-6 shadow-sm border border-surface-border hover:shadow-md hover:border-primary/50 transition-all duration-300 relative overflow-hidden h-full flex flex-col"
        >

            {/* Top Section: Icon & Date */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isFlashcard ? 'bg-secondary/50 text-secondary-foreground' : 'bg-blue-50 text-[#3b82f6]'}`}>
                        {isFlashcard ? <Layers className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                    </div>
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                        {data.type}
                    </span>
                </div>
                <div className='items-center gap-2 flex'>
                    <div className="flex items-center gap-1 text-xs text-text-muted bg-surface-subtle px-2 py-1 rounded-lg border border-surface-border">
                        <span suppressHydrationWarning>
                            {type === 'TRASH' && data.trashedAt
                                ? `trashed ${getTimeAgoString(data.trashedAt)}`
                                : `created ${getTimeAgoString(data.createdAt)}`}
                        </span>
                    </div>
                    <CardPopover type={type} id={data.id} title={data.title} docType="MATERIAL" />
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
                            {data.content}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
