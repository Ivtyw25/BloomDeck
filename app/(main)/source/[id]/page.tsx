"use client"

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSourceById } from '@/services/source';
import { SourceDocument } from '@/types/types';
import { toast } from 'sonner';
import { Eye, MessageSquare, Sparkles } from 'lucide-react';

//components
import { SourceHeader } from '@/components/source/SourceHeader';
import { SourcePreview } from '@/components/source/SourcePreview';
import { ChatInterface } from '@/components/ui/ChatInterface';
import { GenerationGrid } from '@/components/ui/GenerationGrid';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Tabs, TabsList, TabsTab, TabsPanels, TabsPanel } from '@/components/animate-ui/components/base/tabs';

// Hooks
import { useChat } from '@/components/hooks/useChat';
import { useGeneration } from '@/components/hooks/useGeneration';

export default function SourcePage() {
    const router = useRouter();
    const params = useParams();
    const sourceId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

    const [source, setSource] = useState<SourceDocument | null>(null);
    const [loading, setLoading] = useState(true);

    // Custom hooks for chat and generation
    const chat = useChat({
        initialMessage: source ? `Hi! I've analyzed "${source.title}". Ask me anything about it!` : undefined
    });
    const generation = useGeneration();

    // Fetch source data
    useEffect(() => {
        const fetchSource = async () => {
            if (!sourceId) return;

            try {
                const data = await getSourceById(sourceId);
                if (data) {
                    setSource(data);
                } else {
                    toast.error("Source not found");
                }
            } catch (error) {
                console.error("Failed to fetch source:", error);
                toast.error("Failed to load source");
            } finally {
                setLoading(false);
            }
        };

        fetchSource();
    }, [sourceId]);

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return <LoadingState />;
    }

    if (!source) {
        return (
            <ErrorState
                message="Source not found."
                actionLabel="Back to Sources"
                onAction={() => router.push('/source')}
            />
        );
    }

    return (
        <div className="container px-6 py-4 min-h-screen animate-slide-in-right max-w-full">
            <SourceHeader
                title={source.title}
                type={source.type}
                size={source.size}
                onBack={handleBack}
            />

            {/* Main Content Container */}
            <Tabs defaultValue="preview" className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col min-h-[50vh]">
                <TabsList className="border-b border-gray-100 bg-gray-50/50 w-full rounded-none h-auto p-0 sticky top-0 z-10">
                    <TabsTab value="preview" className="cursor-pointer flex-1 py-3 sm:py-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 data-selected:text-primary">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Preview</span>
                    </TabsTab>
                    <TabsTab value="chat" className="cursor-pointer flex-1 py-3 sm:py-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 data-selected:text-primary">
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Chat</span>
                    </TabsTab>
                    <TabsTab value="generate" className="cursor-pointer flex-1 py-3 sm:py-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 data-selected:text-primary">
                        <Sparkles className="w-4 h-4" />
                        <span className="hidden sm:inline">Generate</span>
                    </TabsTab>
                </TabsList>

                <TabsPanels className="flex-1 bg-white relative">
                    <TabsPanel value="preview" className="p-4 sm:p-6 flex items-center justify-center min-h-[80vh] bg-gray-50">
                        <SourcePreview type={source.type} url={source.url} containedTypes={source.containedTypes} />
                    </TabsPanel>

                    <TabsPanel value="chat" className="min-h-[75vh] ">
                        <ChatInterface
                            messages={chat.messages}
                            inputMessage={chat.inputMessage}
                            isTyping={chat.isTyping}
                            chatEndRef={chat.chatEndRef}
                            onInputChange={chat.setInputMessage}
                            onSendMessage={chat.sendMessage}
                        />
                    </TabsPanel>

                    <TabsPanel value="generate" className="h-full min-h-[80vh] md:min-h-[60vh]">
                        <GenerationGrid
                            onGenerate={generation.generate}
                            isGenerating={generation.isGenerating}
                            isSuccess={generation.isSuccess}
                            disabled={generation.isAnyGenerating}
                        />
                    </TabsPanel>
                </TabsPanels>
            </Tabs>
        </div>
    );
};
