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
    // State to track the active file index (0 for first file)
    const [activeIndex, setActiveIndex] = useState(0);

    // YouTube ID extraction logic
    const getYouTubeId = (videoUrl: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = videoUrl.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getActiveUrl = (): string | undefined => {
        if (!url) return undefined;
        if (Array.isArray(url)) {
            return url[activeIndex];
        }
        return url as string;
    };

    const activeUrl = getActiveUrl();

    // Determine the type of the currently active file
    const currentType = (type === 'MIXED' && containedTypes && containedTypes[activeIndex])
        ? containedTypes[activeIndex]
        : type;

    const renderViewer = (viewingType: FileType, currentUrl?: string) => {
        if (!currentUrl) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FileIcon className="w-16 h-16 mb-4 opacity-20" />
                    <p>No preview URL available for this source.</p>
                </div>
            )
        }

        if (viewingType === 'YOUTUBE') {
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

        if (viewingType === 'PDF' || viewingType === 'DOCX' || viewingType === 'PPT') {
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
                <p>Preview not available for {viewingType}</p>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-primary hover:underline">Download / Open Link</a>
            </div>
        )
    };

    // Calculate URLs for iteration
    const previewUrls = Array.isArray(url) ? url : (url ? [url] : []);

    return (
        <div className="flex flex-col h-full w-full max-w-none">
            {previewUrls.length > 1 && (
                <div className="mb-4 self-center">
                    <Tabs value={String(activeIndex)} onValueChange={(val) => setActiveIndex(Number(val))}>
                        <TabsList className="bg-gray-100 p-1 rounded-lg">
                            {previewUrls.map((_, index) => (
                                <TabsTab
                                    key={index}
                                    value={String(index)}
                                    className="cursor-pointer px-4 py-1.5 text-xs font-medium rounded-md transition-all text-gray-500 data-selected:bg-white data-selected:shadow-sm data-selected:text-primary"
                                >
                                    {/* Use contained type name if available (MIXED situation), otherwise simply File 1, 2... */}
                                    {(type === 'MIXED' && containedTypes && containedTypes[index])
                                        ? containedTypes[index]
                                        : `File ${index + 1}`}
                                </TabsTab>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            )}

            <div className="flex-1 w-full relative bg-gray-50 border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                {renderViewer(currentType, activeUrl)}
            </div>
        </div>
    );
}
