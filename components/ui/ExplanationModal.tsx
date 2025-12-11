"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogPortal,
    DialogOverlay,
} from '@/components/animate-ui/primitives/radix/dialog';
import { Bot, Sparkles } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { useSmoothTyping } from '@/components/hooks/useSmoothTyping';

interface ExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    term: string;
    explanation: string | null;
    isLoading: boolean;
}

export function ExplanationModal({
    isOpen,
    onClose,
    term,
    explanation,
    isLoading
}: ExplanationModalProps) {
    const animatedExplanation = useSmoothTyping(explanation, 10);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm" />
                <DialogContent
                    from="top"
                    className="fixed left-[50%] top-[50%] z-100 w-[90vw] max-w-lg translate-x-[-50%] translate-y-[-50%] border border-primary/50 bg-white p-0 shadow-2xl rounded-2xl duration-200 focus:outline-none overflow-hidden"
                >
                    <div className="bg-linear-to-br from-primary/5 to-transparent p-6 pb-4">
                        <DialogHeader className="mb-2">
                            <DialogTitle className="flex items-center gap-2 text-xl font-heading font-bold text-textPrimary">
                                <Bot className="w-5 h-5 text-text-main" />
                                <span className='font-semibold font-heading'>AI Explanation</span>
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium">
                                Create an easier way to understand "{term}"
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="px-6 py-4 min-h-[150px] max-h-[60vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-40 space-y-3 text-brand-textSecondary">
                                <Sparkles className="w-8 h-8 animate-pulse text-brand-primary" />
                                <p className="text-sm font-medium animate-pulse">Generating tailored explanation...</p>
                            </div>
                        ) : (
                            <>
                                {explanation ? (
                                    <MarkdownRenderer content={animatedExplanation} />
                                ) : (
                                    <div className="prose prose-sm prose-gray max-w-none text-brand-textPrimary leading-relaxed">
                                        <p className="text-red-500">Failed to generate explanation.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-primary-hover bg-primary cursor-pointer transition-all shadow-sm hover:scale-105 active:scale-95"
                        >
                            Got it
                        </button>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
