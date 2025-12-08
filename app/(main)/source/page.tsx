"use client"
import Link from 'next/link';
import { Upload } from 'lucide-react';
import { MOCK_SOURCES, FILTER_OPTIONS } from '@/lib/constants';
import { SourceToolbar } from '@/components/source/SourceToolbar';
import { AnimatePresence, motion } from 'framer-motion';
import SourceCard from '@/components/ui/SourceCard';
import { EmptySourceState } from '@/components/source/EmptySourceState';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResourceGrid } from '@/components/layout/ResourceGrid';
import { useResourceFilter } from '@/hooks/useResourceFilter';

export default function SourcePage() {
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
    } = useResourceFilter({ items: MOCK_SOURCES, dateField: 'dateAdded' });

    return (
        <div className="container mx-auto px-6 py-4 animate-slide-in-right max-w-7xl">
            {/* Header */}
            <PageHeader
                title="My Sources"
                description="Manage your uploaded documents and media"
            >
                <Link href="/source/upload">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-green-500 transition-all shadow-md shadow-[#b5d365]/20 group cursor-pointer active:scale-95">
                        <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" strokeWidth={2.5} />
                        <span className="text-sm">Upload Sources</span>
                    </button>
                </Link>
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
                filterOptions={FILTER_OPTIONS}
            />

            {filteredItems.length > 0 ? (
                <ResourceGrid>
                    <AnimatePresence>
                        {filteredItems.map(source => (
                            <motion.div
                                key={source.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <SourceCard data={source} type='SOURCE' />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </ResourceGrid>
            ) : (
                <EmptySourceState text="No sources found" desc="We couldn't find any sources matching your search." />
            )}
        </div>
    );
}
