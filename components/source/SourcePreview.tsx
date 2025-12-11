import { useState } from 'react';
import { FileType } from '@/types/types';
import { PlayCircle, FileText, File as FileIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTab } from '@/components/animate-ui/components/base/tabs';

interface SourcePreviewProps {
    type: FileType;
    url?: string | string[];
    containedTypes?: FileType[];
}

export function SourcePreview({ type, url, containedTypes }: SourcePreviewProps) {
    // For MIXED types, we need state to switch between available sub-types
    // Default to the first contained type if available, otherwise just use the main type
    const [viewType, setViewType] = useState<FileType>(
        type === 'MIXED' && containedTypes && containedTypes.length > 0
            ? containedTypes[0]
            : type
    );

    // YouTube ID extraction logic
    const getYouTubeId = (videoUrl: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = videoUrl.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getActiveUrl = (): string | undefined => {
        if (!url) return undefined;
        if (Array.isArray(url)) {
            if (type === 'MIXED' && containedTypes) {
                const index = containedTypes.indexOf(viewType);
                if (index !== -1 && index < url.length) {
                    return url[index];
                }
            }
            return url[0];
        }
        return url as string;
    };

    const activeUrl = getActiveUrl();
    const renderViewer = (currentType: FileType, currentUrl?: string) => {
        if (!currentUrl) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FileIcon className="w-16 h-16 mb-4 opacity-20" />
                    <p>No preview URL available for this source.</p>
                </div>
            )
        }

        if (currentType === 'YOUTUBE') {
            const videoId = getYouTubeId(currentUrl);
            if (videoId) {
                return (
                    <div className="w-full h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] xl:h-[540px] bg-black rounded-xl overflow-hidden">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                )
            }
            return (
                <div className="w-full max-w-3xl aspect-video bg-black rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60"></div>
                    <PlayCircle className="w-16 sm:w-20 h-16 sm:h-20 text-white/90 group-hover:scale-110 transition-transform cursor-pointer z-10" />
                    <p className="mt-4 text-white/80 font-medium z-10 text-sm sm:text-base">Invalid YouTube URL</p>
                </div>
            );
        }

        if (currentType === 'PDF' || currentType === 'DOCX' || currentType === 'PPT') {
            // Google Docs Viewer for Office files and PDF (better mobile support)
            return (
                <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(currentUrl)}&embedded=true`}
                    className="w-full h-[80vh] rounded-xl border border-gray-200"
                    title="Document Viewer"
                />
            )
        }

        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>Preview not available for {currentType}</p>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-primary hover:underline">Download / Open Link</a>
            </div>
        )
    };

    return (
        <div className="flex flex-col h-full w-full max-w-none">
            {type === 'MIXED' && containedTypes && (
                <div className="mb-4 self-center">
                    <Tabs value={viewType} onValueChange={(val) => setViewType(val as FileType)}>
                        <TabsList className="bg-gray-100 p-1 rounded-lg">
                            {containedTypes.map(t => (
                                <TabsTab
                                    key={t}
                                    value={t}
                                    className="cursor-pointer px-4 py-1.5 text-xs font-medium rounded-md transition-all text-gray-500 data-selected:bg-white data-selected:shadow-sm data-selected:text-primary"
                                >
                                    {t}
                                </TabsTab>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            )}

            <div className="flex-1 w-full relative bg-gray-50 border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                {renderViewer(viewType, activeUrl)}
            </div>
        </div>
    );
}
