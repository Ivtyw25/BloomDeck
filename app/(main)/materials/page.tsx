import React from 'react';

export default function MaterialsPage() {
    return (
        <div className='flex flex-col gap-4'>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Materials</h1>
            </div>
            <div className="rounded-lg border border-dashed shadow-sm p-10 text-center">
                <h3 className='text-lg font-semibold'>Study Materials</h3>
                <p className='text-muted-foreground'>Access your study materials and resources.</p>
            </div>
        </div>
    );
}
