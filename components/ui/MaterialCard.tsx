import { CardPopover } from '@/components/source/CardPopover';
import { MaterialItem } from '@/types/types';
import { Layers, FileText } from 'lucide-react';

interface MaterialCardProps {
    data: MaterialItem;
    type: 'SOURCE' | 'TRASH';
}


import { useRouter } from 'next/navigation';
import { getTimeAgoString } from '@/lib/time-utils';

export default function MaterialCard({ data, type }: MaterialCardProps) {
    const router = useRouter();



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
                    <CardPopover type={type} id={data.id} title={data.title} docType="MATERIAL" fileStoresId={null} />
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 mb-0">
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
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium" suppressHydrationWarning>
                    {type === 'TRASH' && data.trashedAt
                        ? `Trashed ${getTimeAgoString(data.trashedAt)}`
                        : `Created ${getTimeAgoString(data.createdAt)}`}
                </span>
            </div>
        </div>
    );
};
