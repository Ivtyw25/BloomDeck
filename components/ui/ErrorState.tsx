import { ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function ErrorState({ message, actionLabel = 'Go Back', onAction }: ErrorStateProps) {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <p className="text-lg text-gray-500">{message}</p>
            {onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 text-primary font-medium hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" /> {actionLabel}
                </button>
            )}
        </div>
    );
}
