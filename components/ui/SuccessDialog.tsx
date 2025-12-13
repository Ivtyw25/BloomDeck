"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogPortal,
    DialogOverlay,
} from '@/components/animate-ui/primitives/radix/dialog';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GenerationOption } from '@/components/hooks/useGeneration';

interface SuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    materialId: string;
    type: Exclude<GenerationOption, 'summary'>;
}

export function SuccessDialog({ isOpen, onClose, title, materialId, type }: SuccessDialogProps) {
    const router = useRouter();

    const handleGoToDeck = () => {
        router.push(`/materials/${materialId}`);
        onClose();
    };

    const typeLabel = type === 'flashcards' ? 'Flashcards' : 'Notes';
    const actionLabel = type === 'flashcards' ? 'Go to Deck' : 'View Notes';

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm" />
                <DialogContent
                    from="bottom"
                    className="fixed left-[50%] top-[50%] z-100 w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] border border-green-100 bg-white p-6 shadow-xl rounded-2xl focus:outline-none"
                >
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>

                        <DialogHeader>
                            <DialogTitle className="text-xl font-heading font-semibold text-text-main">
                                {typeLabel} Generated!
                            </DialogTitle>
                            <DialogDescription className="text-sm text-text-muted mt-2">
                                successfully generated <span className="font-semibold text-primary">"{title}"</span>.
                                You can now start studying or editing your new {typeLabel.toLowerCase()}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex w-full gap-3 mt-4">
                            <button
                                onClick={onClose}
                                className="cursor-pointer hover:scale-105 active:scale-95 flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Stay Here
                            </button>
                            <button
                                onClick={handleGoToDeck}
                                className="cursor-pointer hover:scale-105 active:scale-95 flex-1 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
                            >
                                {actionLabel}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
