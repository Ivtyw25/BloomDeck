import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            {message && <p className="text-gray-500">{message}</p>}
        </div>
    );
}
