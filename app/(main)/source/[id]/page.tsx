"use client"

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSourceById, updateFileSearchStoresID } from '@/services/source';
import { SourceDocument } from '@/types/types';
import { toast } from 'sonner';
import { Eye, Loader2, MessageSquare, Sparkles } from 'lucide-react';

//components
import { SourceHeader } from '@/components/source/SourceHeader';
import { SourcePreview } from '@/components/source/SourcePreview';
import { ChatInterface } from '@/components/ui/ChatInterface';
import { GenerationGrid } from '@/components/ui/GenerationGrid';
import { ErrorState } from '@/components/ui/ErrorState';
import { Tabs, TabsList, TabsTab, TabsPanels, TabsPanel } from '@/components/animate-ui/components/base/tabs';
import { ConceptSummaryDialog } from '@/components/source/ConceptSummaryDialog';
import { SuccessDialog } from '@/components/ui/SuccessDialog';

// Hooks
import { useChat } from '@/components/hooks/useChat';
import { useGeneration } from '@/components/hooks/useGeneration';

export default function SourcePage() {
    const router = useRouter();
    const params = useParams();
    const sourceId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

    const [source, setSource] = useState<SourceDocument | null>(null);
    const [loading, setLoading] = useState(true);

    // Summary Feature State
    const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
    const [summaryResult, setSummaryResult] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    // Custom hooks for chat and generation
    const chat = useChat({
        sourceId: typeof sourceId === 'string' ? sourceId : '',
        fileSearchStoreID: source?.fileSearchStoreID,
        sourceTitle: source?.title
    });

    const generation = useGeneration({
        sourceId: typeof sourceId === 'string' ? sourceId : '',
        fileSearchStoreID: source?.fileSearchStoreID,
    });

    // Fetch source data
    useEffect(() => {
        const fetchSource = async () => {
            if (!sourceId) return;

            try {
                const data = await getSourceById(sourceId);
                if (data) {
                    setSource(data);

                    if (data.type !== 'YOUTUBE' && !data.fileSearchStoreID) {
                        const response = await fetch('/api/ai/create-filestores', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                fileSearchStoreName: data.title,
                                sourceId: sourceId,
                                file_urls: data.url as Array<string>
                            }),
                        });

                        if (!response.ok) {
                            console.error("Create filestore failed with status:", response.status);
                            throw new Error(`Failed to create filestores: ${response.statusText}`);
                        }

                        // Parse JSON safely
                        let result;
                        try {
                            result = await response.json();
                        } catch (e) {
                            console.error("Failed to parse create-filestores response:", e);
                            throw new Error("Invalid response from server");
                        }

                        if (result.success && result.fileSearchStoreID) {
                            setSource(prev => prev ? ({ ...prev, fileSearchStoreID: result.fileSearchStoreID }) : null);
                            updateFileSearchStoresID(sourceId, result.fileSearchStoreID);
                        }
                    }
                } else {
                    toast.error("Source not found");
                }
            } catch (error) {
                console.error("Failed to fetch source:", error);
                toast.error("Failed to load source");
            }
            finally {
                setLoading(false);
            }
        };

        fetchSource();
    }, [sourceId]);

    const handleBack = () => {
        router.back();
    };

    const handleSummarySubmit = async (concept: string) => {
        setIsSummaryLoading(true);
        setSummaryResult(''); // Reset result on new submission

        try {
            const response = await fetch('/api/ai/concept-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    concept,
                    fileSearchStoreID: source?.fileSearchStoreID,
                    sourceTitle: source?.title
                })
            });

            if (!response.ok) {
                throw new Error("Failed to generate summary");
            }

            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                fullText += chunk;
                setSummaryResult(fullText);
            }

        } catch (error) {
            console.error("Summary error:", error);
            toast.error("Failed to generate summary. Please try again.");
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const handleGenerate = (type: any) => {
        if (type === 'summary') {
            setIsSummaryDialogOpen(true);
        } else if (type === 'flashcards') {
            generation.generate(type);
        }
    };

    if (loading) {
        return (<div className="flex min-h-screen items-center justify-center">
            <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-primary animate-spin" />
        </div>);
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

                    <TabsPanel value="chat" className="min-h-[70vh] ">
                        <ChatInterface
                            messages={chat.messages}
                            inputMessage={chat.inputMessage}
                            isTyping={chat.isTyping}
                            isLoading={chat.isLoading}
                            chatEndRef={chat.chatEndRef}
                            onInputChange={chat.setInputMessage}
                            onSendMessage={chat.sendMessage}
                            onClearChat={chat.clearChat}
                        />
                    </TabsPanel>

                    <TabsPanel value="generate" className="h-full min-h-[80vh] md:min-h-[60vh]">
                        <GenerationGrid
                            onGenerate={handleGenerate}
                            isGenerating={generation.isGenerating}
                            isSuccess={generation.isSuccess}
                            disabled={generation.isAnyGenerating}
                        />
                    </TabsPanel>
                </TabsPanels>
            </Tabs>

            <ConceptSummaryDialog
                isOpen={isSummaryDialogOpen}
                onClose={() => setIsSummaryDialogOpen(false)}
                onSubmit={handleSummarySubmit}
                isLoading={isSummaryLoading}
                summary={summaryResult}
            />

            <SuccessDialog
                isOpen={generation.isSuccess('flashcards')}
                onClose={generation.resetSuccess}
                title={generation.generatedTitle}
                materialId={generation.generatedMaterialId || ''}
                type="flashcards"
            />
        </div>
    );
};
