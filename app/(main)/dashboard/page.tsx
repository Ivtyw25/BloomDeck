import React from 'react';

export default function DashboardPage() {
    return (
        <div className='flex flex-col gap-4'>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <div className="rounded-lg border border-dashed shadow-sm p-10 text-center">
                <h3 className='text-lg font-semibold'>Welcome to your Dashboard</h3>
                <p className='text-muted-foreground'>This is where you can see an overview of your activity.</p>
            </div>
        </div>
    );
}
