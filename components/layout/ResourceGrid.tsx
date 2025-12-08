import { ReactNode } from 'react';

interface ResourceGridProps {
    children: ReactNode;
    className?: string; // Allow overriding grid cols if needed for specific use cases
}

export function ResourceGrid({ children, className = '' }: ResourceGridProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 ${className}`}>
            {children}
        </div>
    );
}
