"use client"
import { useState } from 'react';
import { Zap } from 'lucide-react';
import MaterialCard from '@/components/ui/MaterialCard';
import { MOCK_MATERIALS, MATERIAL_FILTER_OPTIONS } from '@/lib/constants';
import { SourceToolbar } from '@/components/source/SourceToolbar';
import { EmptySourceState } from '@/components/source/EmptySourceState';
import { motion, AnimatePresence } from 'motion/react';

export default function MaterialsView() {
    const [filterType, setFilterType] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'title'; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredMaterials = MOCK_MATERIALS.filter(item => {
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

    return (

        <div className="container mx-auto px-6 py-4 animate-slide-in-right max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-text-main">My Materials</h1>
                    <p className="text-text-muted mt-2 font-medium">Review your generated study aids</p>
                </div>

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
            </div>


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
            {filteredMaterials.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredMaterials.map(materials => (
                            <motion.div
                                key={materials.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MaterialCard key={materials.id} data={materials} type="SOURCE"/>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <EmptySourceState text="No materials found" desc="We couldn't find any materials matching your search." />
            )}
        </div>
    );
};
