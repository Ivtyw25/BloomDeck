import { MoreVertical } from 'lucide-react';
import { SOURCE_CARD_ACTIONS, TRASH_CARD_ACTIONS } from '@/lib/constants';
import { Popover, PopoverContent, PopoverTrigger, PopoverPortal } from '@/components/animate-ui/primitives/radix/popover';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleTrashSource, deleteSource } from '@/services/source';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

interface CardPopoverProps {
    type: 'SOURCE' | 'TRASH';
    id: string;
    title: string;
}

export function CardPopover({ type, id, title }: CardPopoverProps) {
    const router = useRouter();
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [open, setOpen] = useState(false);

    const handleAction = async (action: string) => {
        setOpen(false);

        if (action === 'delete') {
            setShowDeleteConfirm(true);
            return;
        }

        const isTrash = action === 'trash';
        const isRestore = action === 'restore';

        if (!isTrash && !isRestore) return;

        const promise = toggleTrashSource(id, isTrash);

        toast.promise(promise, {
            loading: isTrash ? 'Moving to trash...' : 'Restoring...',
            success: () => {
                router.refresh();
                return isTrash ? 'Moved to trash' : 'Restored successfully';
            },
            error: isTrash ? 'Failed to move to trash' : 'Failed to restore'
        });
    };

    const onConfirmDelete = async () => {
        setIsActionLoading(true);
        try {
            await deleteSource(id);
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
                    <button className="cursor-pointer text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors shrink-0 -mt-1 -mr-2 outline-none">
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
                                    className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg w-full text-left transition-colors ${action.variant === 'destructive'
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
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={onConfirmDelete}
                title="Delete Source Permanently?"
                description={`Are you sure you want to delete "${title}"? This action cannot be undone and will permanently delete all associated files.`}
                confirmText="Delete Forever"
                isLoading={isActionLoading}
            />
        </>
    );
}
