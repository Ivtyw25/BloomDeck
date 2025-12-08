import React, { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: ReactNode; // For actions/buttons
    className?: string;
}

export function PageHeader({ title, description, children, className = '' }: PageHeaderProps) {
    return (
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 ${className}`}>
            <div>
                <h1 className="text-3xl font-heading font-bold text-text-main tracking-tight">{title}</h1>
                {description && <p className="text-text-muted mt-2 font-medium">{description}</p>}
            </div>
            {children && (
                <div className="flex items-center gap-4">
                    {children}
                </div>
            )}
        </div>
    );
}
