import { MoreVertical } from 'lucide-react';
import { SOURCE_CARD_ACTIONS, TRASH_CARD_ACTIONS } from '@/lib/constants';
import { Popover, PopoverContent, PopoverTrigger, PopoverPortal } from '@/components/animate-ui/primitives/radix/popover';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleTrashSource, deleteSource } from '@/services/source';
import { toggleTrashMaterial, deleteMaterial } from '@/services/material';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

interface CardPopoverProps {
    type: 'SOURCE' | 'TRASH';
    id: string;
    title: string;
    docType: 'SOURCE' | 'MATERIAL';
}

export function CardPopover({ type, id, title, docType }: CardPopoverProps) {
    const router = useRouter();
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showTrashConfirm, setShowTrashConfirm] = useState(false);
    const [open, setOpen] = useState(false);

    const handleAction = async (action: string) => {
        setOpen(false);

        if (action === 'delete') {
            setShowDeleteConfirm(true);
            return;
        }

        if (action === 'trash') {
            setShowTrashConfirm(true);
            return;
        }

        const isRestore = action === 'restore';

        if (!isRestore) return;

        const promise = docType === 'SOURCE'
            ? toggleTrashSource(id, false)
            : toggleTrashMaterial(id, false);

        toast.promise(promise, {
            loading: 'Restoring...',
            success: () => {
                router.refresh();
                return 'Restored successfully';
            },
            error: 'Failed to restore'
        });
    };

    const onConfirmTrash = async () => {
        setIsActionLoading(true);
        try {
            if (docType === 'SOURCE') {
                await toggleTrashSource(id, true);
            } else {
                await toggleTrashMaterial(id, true);
            }
            toast.success("Moved to trash");
            if (docType === 'SOURCE') {
                router.push('/source');
            } else {
                router.push('/materials');
            }
            router.refresh();
            setShowTrashConfirm(false);
        } catch (e) {
            console.error(e);
            toast.error("Failed to move to trash");
        } finally {
            setIsActionLoading(false);
        }
    };

    const onConfirmDelete = async () => {
        setIsActionLoading(true);
        try {
            if (docType === 'SOURCE') {
                await deleteSource(id);
            } else {
                await deleteMaterial(id);
            }
            toast.success("Permanently deleted");
            router.refresh();
            setShowDeleteConfirm(false);
        } catch (e) {
            console.error(e);
            toast.error("Failed to delete source");
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors shrink-0 -mt-1 -mr-2 outline-none"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </PopoverTrigger>
                <PopoverPortal>
                    <PopoverContent
                        sideOffset={5}
                        align="end"
                        className="bg-white rounded-xl shadow-lg border border-gray-100 p-1 z-50 focus:outline-none w-32"
                    >
                        <div className="flex flex-col gap-0.5">
                            {(type === 'TRASH' ? TRASH_CARD_ACTIONS : SOURCE_CARD_ACTIONS).map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAction(action.action);
                                    }}
                                    className={`cursor-pointer flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg w-full text-left transition-colors ${action.variant === 'destructive'
                                        ? 'text-red-500 hover:bg-red-50'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <action.icon className="w-3.5 h-3.5" />
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </PopoverPortal>
            </Popover>

            <ConfirmationDialog
                isOpen={showTrashConfirm}
                onClose={() => setShowTrashConfirm(false)}
                onConfirm={onConfirmTrash}
                title="Move to Trash?"
                description={`Are you sure you want to move "${title}" to trash? Items in trash will be permanently deleted after 30 days.`}
                confirmText="Move to Trash"
                isLoading={isActionLoading}
                loadingText="Trashing..."
            />

            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={onConfirmDelete}
                title="Delete Source Permanently?"
                description={`Are you sure you want to delete "${title}"? This action cannot be undone and will permanently delete all associated files.`}
                confirmText="Delete Forever"
                isLoading={isActionLoading}
                loadingText="Deleting..."
            />
        </>
    );
}
