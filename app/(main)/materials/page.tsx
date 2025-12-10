"use client"
import { Zap } from 'lucide-react';
import MaterialCard from '@/components/ui/MaterialCard';
import { MOCK_MATERIALS, MATERIAL_FILTER_OPTIONS } from '@/lib/constants';
import { SourceToolbar } from '@/components/source/SourceToolbar';
import { EmptySourceState } from '@/components/source/EmptySourceState';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResourceGrid } from '@/components/layout/ResourceGrid';
import { useResourceFilter } from '@/hooks/useResourceFilter';

export default function MaterialsView() {
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
    } = useResourceFilter({ items: MOCK_MATERIALS, dateField: 'dateCreated' });

    return (
        <div className="container mx-auto px-6 py-4 animate-slide-in-right max-w-7xl">
            {/* Header */}
            <PageHeader
                title="My Materials"
                description="Review your generated study aids"
            >
                {/* Decorative Stat */}
                <div className="hidden sm:flex items-center gap-4 bg-accents/20 px-3 py-2 rounded-xl border border-accents/50">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-accents text-primary rounded-lg">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium tracking-wider">Total Items</p>
                            <p className="text-lg font-semibold font-heading text-text-main leading-none">{MOCK_MATERIALS.length}</p>
                        </div>
                    </div>
                </div>
            </PageHeader>

            <SourceToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterType={filterType}
                setFilterType={setFilterType}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterOptions={MATERIAL_FILTER_OPTIONS}
            />

            {/* Grid */}
            {filteredItems.length > 0 ? (
                <ResourceGrid>
                    <AnimatePresence>
                        {filteredItems.map(materials => (
                            <motion.div
                                key={materials.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MaterialCard key={materials.id} data={materials} type="SOURCE" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </ResourceGrid>
            ) : (
                <EmptySourceState text="No materials found" desc="We couldn't find any materials matching your search. You may create your materials from sources." />
            )}
        </div>
    );
};
