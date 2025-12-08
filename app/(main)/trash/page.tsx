"use client"
import { MOCK_TRASH, TRASH_FILTER_OPTIONS, MOCK_TRASH_MATERIALS, MATERIAL_FILTER_OPTIONS } from '@/lib/constants';
import { useState } from 'react';
import { FileType } from '@/types/types';
import { SourceToolbar } from '@/components/source/SourceToolbar';
import { AnimatePresence, motion } from 'framer-motion';
import SourceCard from '@/components/ui/SourceCard';
import { EmptySourceState } from '@/components/source/EmptySourceState';
import MaterialCard from '@/components/ui/MaterialCard';

export default function TrashPage() {

    const [viewMode, setViewMode] = useState<'SOURCE' | 'MATERIAL'>('SOURCE');
    const [filterType, setFilterType] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'title'; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter Logic
    const getFilteredItems = () => {
        if (viewMode === 'SOURCE') {
            return MOCK_TRASH.filter(source => {
                const matchesType = filterType === 'ALL' ||
                    source.type === filterType ||
                    (source.type === 'MIXED' && source.containedTypes?.includes(filterType as FileType));

                const matchesSearch = source.title.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesType && matchesSearch;
            }).sort((a, b) => {
                if (sortConfig.key === 'date') {
                    const dateA = new Date(a.dateAdded).getTime();
                    const dateB = new Date(b.dateAdded).getTime();
                    return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
                } else {
                    return sortConfig.direction === 'asc'
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title);
                }
            });
        } else {
            return MOCK_TRASH_MATERIALS.filter(item => {
                const matchesType = filterType === 'ALL' ||
                    (filterType === 'FLASHCARDS' && item.type === 'FLASHCARD') ||
                    (filterType === 'NOTES' && item.type === 'NOTE');

                const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.sourceName.toLowerCase().includes(searchQuery.toLowerCase());

                return matchesType && matchesSearch;
            }).sort((a, b) => {
                if (sortConfig.key === 'date') {
                    const dateA = new Date(a.dateCreated).getTime();
                    const dateB = new Date(b.dateCreated).getTime();
                    return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
                } else {
                    return sortConfig.direction === 'asc'
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title);
                }
            });
        }
    };

    const filteredItems = getFilteredItems();

    const handleModeChange = (mode: 'SOURCE' | 'MATERIAL') => {
        setViewMode(mode);
        setFilterType('ALL'); // Reset filter when switching modes
    };

    return (
        <div className="container mx-auto px-6 py-4 animate-slide-in-right max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-text-main tracking-tight">Trash</h1>
                    <p className="text-text-muted mt-2 font-medium">Items in trash will be deleted after 30 days.</p>
                </div>

                {/* Pill Switcher */}
                <div className="bg-surface-subtle p-1 rounded-xl inline-flex items-center relative">
                    <button
                        onClick={() => handleModeChange('SOURCE')}
                        className={`cursor-pointer relative z-10 px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-350 ${viewMode === 'SOURCE'
                            ? 'text-primary'
                            : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        {viewMode === 'SOURCE' && (
                            <motion.div
                                layoutId="trash-tab"
                                className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg -z-10"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        Sources
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button
                        onClick={() => handleModeChange('MATERIAL')}
                        className={`cursor-pointer relative z-10 px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-350 ${viewMode === 'MATERIAL'
                            ? 'text-primary'
                            : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        {viewMode === 'MATERIAL' && (
                            <motion.div
                                layoutId="trash-tab"
                                className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg -z-10"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        Materials
                    </button>
                </div>
            </div>

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
                filterOptions={viewMode === 'SOURCE' ? TRASH_FILTER_OPTIONS : MATERIAL_FILTER_OPTIONS}
            />

            {filteredItems.length > 0 ? (
                <motion.div layout className={`grid grid-cols-1 ${viewMode === 'SOURCE' ? 'md:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'} gap-6`}>
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
                </motion.div>
            ) : (
                <EmptySourceState
                    text={`No ${viewMode.toLowerCase()}s found`}
                    desc={`We couldn't find any ${viewMode.toLowerCase()}s in trash matching your search.`}
                />
            )}
        </div>
    );
}
