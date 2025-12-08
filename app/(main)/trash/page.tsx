"use client"
import { MOCK_TRASH, TRASH_FILTER_OPTIONS, MOCK_TRASH_MATERIALS, MATERIAL_FILTER_OPTIONS } from '@/lib/constants';
import { useState } from 'react';
import { SourceToolbar } from '@/components/source/SourceToolbar';
import { AnimatePresence, motion } from 'framer-motion';
import SourceCard from '@/components/ui/SourceCard';
import { EmptySourceState } from '@/components/source/EmptySourceState';
import MaterialCard from '@/components/ui/MaterialCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResourceGrid } from '@/components/layout/ResourceGrid';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useResourceFilter } from '@/hooks/useResourceFilter';

export default function TrashPage() {
    const [viewMode, setViewMode] = useState<'SOURCE' | 'MATERIAL'>('SOURCE');

    const items = viewMode === 'SOURCE' ? MOCK_TRASH : MOCK_TRASH_MATERIALS;
    const dateField = viewMode === 'SOURCE' ? 'dateAdded' : 'dateCreated';
    const filterOptions = viewMode === 'SOURCE' ? TRASH_FILTER_OPTIONS : MATERIAL_FILTER_OPTIONS;

    const {
        filteredItems,
        filterType,
        setFilterType,
        searchQuery,
        setSearchQuery,
        sortConfig,
        setSortConfig,
        isFilterOpen,
        setIsFilterOpen
    } = useResourceFilter({ items: items as any[], dateField });

    const handleModeChange = (mode: string) => {
        setViewMode(mode as 'SOURCE' | 'MATERIAL');
        setFilterType('ALL'); // Reset filter when switching modes
    };

    return (
        <div className="container mx-auto px-6 py-4 animate-slide-in-right max-w-7xl">
            {/* Header */}
            <PageHeader
                title="Trash"
                description="Items in trash will be deleted after 30 days."
            >
                <SegmentedControl
                    options={[
                        { label: 'Sources', value: 'SOURCE' },
                        { label: 'Materials', value: 'MATERIAL' }
                    ]}
                    value={viewMode}
                    onChange={handleModeChange}
                    layoutId="trash-tab"
                />
            </PageHeader>

            {/* Main Toolbar */}
            <SourceToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterType={filterType}
                setFilterType={setFilterType}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterOptions={filterOptions}
            />

            {filteredItems.length > 0 ? (
                <ResourceGrid
                    className={viewMode === 'MATERIAL' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'}
                >
                    <AnimatePresence>
                        {filteredItems.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                {viewMode === 'SOURCE' ? (
                                    <SourceCard data={item as any} type="TRASH" />
                                ) : (
                                    <MaterialCard data={item as any} type="TRASH" />
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </ResourceGrid>
            ) : (
                <EmptySourceState
                    text={`No ${viewMode.toLowerCase()}s found`}
                    desc={`We couldn't find any ${viewMode.toLowerCase()}s in trash matching your search.`}
                />
            )}
        </div>
    );
}
