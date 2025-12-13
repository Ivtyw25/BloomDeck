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

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    loadingText?: string;
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    loadingText
}: ConfirmationDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm" />
                <DialogContent
                    from="top"
                    className="fixed left-[50%] top-[50%] z-100 w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] border border-primary/50 bg-white p-6 shadow-xl rounded-2xl duration-200 focus:outline-none"
                >
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-lg font-heading font-semibold text-text-main leading-6">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-text-muted font-medium leading-relaxed mt-2">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onConfirm();
                            }}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>{loadingText || 'Deleting...'}</span>
                                </>
                            ) : confirmText}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
