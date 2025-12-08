import { MoreVertical } from 'lucide-react';
import { SOURCE_CARD_ACTIONS, TRASH_CARD_ACTIONS } from '@/lib/constants';
import { Popover, PopoverContent, PopoverTrigger, PopoverPortal } from '@/components/animate-ui/primitives/radix/popover';
import { toast } from 'sonner';

interface CardPopoverProps {
    type: 'SOURCE' | 'TRASH';
}

export function CardPopover({ type }: CardPopoverProps) {
    return (
        <Popover>
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
                                    e.stopPropagation(); // Prevent card click
                                    if (action.action === 'trash') {
                                        toast.success("moved to trash successfully");
                                    } else if (action.action === 'restore') {
                                        toast.success("restored successfully");
                                    } else if (action.action === 'delete') {
                                        toast.success("permanently deleted successfully");
                                    }
                                    console.log(`Action triggered: ${action.action}`);
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
    );
}
