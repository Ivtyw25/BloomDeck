"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import SourceCard from '@/components/ui/SourceCard';
import { MOCK_SOURCES } from '@/lib/constants';
import { FileType } from '@/types/types';
import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/primitives/buttons/ripple';
import { SourceToolbar } from '@/components/source/SourceToolbar';
import { EmptySourceState } from '@/components/source/EmptySourceState';

export default function SourcesView() {
    const router = useRouter();
    const [filterType, setFilterType] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'title'; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // replace with database call
    const filteredSources = MOCK_SOURCES.filter(source => {
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

    return (
        <div className="container mx-auto px-6 py-4 animate-slide-in-right max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-text-main tracking-tight">My Sources</h1>
                    <p className="text-text-muted mt-2 font-medium">Manage your study sources, use it to create your study decks</p>
                </div>
                <RippleButton
                    onClick={() => router.push('/source/upload')}
                    className="cursor-pointer flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-medium font-heading hover:bg-primary-hover hover:scale-105 transition-all shadow-md active:scale-95"
                >
                    <Plus className="w-5 h-5 stroke-3" />
                    Upload Material
                    <RippleButtonRipples />
                </RippleButton>
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
            />

            {/* Grid */}
            {filteredSources.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredSources.map(source => (
                            <motion.div
                                key={source.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <SourceCard data={source} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <EmptySourceState />
            )}
        </div>
    );
};
