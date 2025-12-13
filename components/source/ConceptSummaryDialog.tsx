"use client"

import { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogPortal,
    DialogOverlay,
} from '@/components/animate-ui/primitives/radix/dialog';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

interface ConceptSummaryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (concept: string) => Promise<void>;
    isLoading: boolean;
    summary: string;
}

export function ConceptSummaryDialog({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    summary
}: ConceptSummaryDialogProps) {
    const [concept, setConcept] = useState('');
    const resultRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of result
    useEffect(() => {
        if (resultRef.current) {
            resultRef.current.scrollTop = resultRef.current.scrollHeight;
        }
    }, [summary]);

    useEffect(() => {
        if (isOpen && !summary && !isLoading) {
            setConcept('');
        }
    }, [isOpen, summary, isLoading]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!concept.trim() || isLoading) return;
        await onSubmit(concept);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm" />
                <DialogContent
                    from="top"
                    className="fixed left-[50%] top-[50%] z-100 w-[95vw] max-w-2xl translate-x-[-50%] translate-y-[-50%] border border-primary/50 bg-white p-0 shadow-xl rounded-2xl duration-200 focus:outline-none flex flex-col max-h-[85vh]"
                >
                    <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl font-heading font-semibold text-text-main leading-6 flex items-center gap-2">
                                Concept Summary
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-text-muted font-medium leading-relaxed mt-2">
                                Enter a specific concept from the source document to get a concise AI-generated summary.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col p-6 sm:p-8 gap-4">
                        {(summary || isLoading) && (
                            <div
                                className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-4 border border-gray-100 min-h-[150px] shadow-inner"
                                ref={resultRef}
                            >
                                {summary ? (
                                    <MarkdownRenderer content={summary} className="text-xs sm:text-sm lg:text-md" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 animate-pulse">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                                        <span className="text-xs sm:text-sm font-medium">Analyzing document and generating summary...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="relative shrink-0">
                            <textarea
                                value={concept}
                                onChange={(e) => setConcept(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. Photosynthesis, Supply and Demand, Quantum Mechanics..."
                                className="w-full pl-4 pr-12 py-3.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none min-h-[60px] max-h-[120px] shadow-sm"
                                rows={2}
                                disabled={isLoading}
                                autoFocus
                            />
                            <button
                                onClick={() => handleSubmit()}
                                disabled={!concept.trim() || isLoading}
                                className="absolute active:scale-95 right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
