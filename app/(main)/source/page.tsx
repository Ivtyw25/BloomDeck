"use client"
import Link from 'next/link';
import { Upload, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { SourceDocument } from '@/app/types/types';
import { getSources } from '@/services/source';
import { FILTER_OPTIONS } from '@/lib/constants';
import { SourceToolbar } from '@/components/source/SourceToolbar';
import { AnimatePresence, motion } from 'framer-motion';
import SourceCard from '@/components/ui/SourceCard';
import { EmptySourceState } from '@/components/source/EmptySourceState';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResourceGrid } from '@/components/layout/ResourceGrid';
import { useResourceFilter } from '@/hooks/useResourceFilter';

export default function SourcePage() {
    const [sources, setSources] = useState<SourceDocument[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const data = await getSources(false);
                setSources(data);
            } catch (error) {
                console.error("Failed to fetch sources:", error);
                toast.error("Failed to load sources");
            } finally {
                setLoading(false);
            }
        };

        fetchSources();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('realtime:active_sources')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'Sources-Table'
            }, (payload) => {
                fetchSources();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

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
    } = useResourceFilter({ items: sources, dateField: 'dateAdded' });

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

            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-primary animate-spin" />
                </div>
            ) : filteredItems.length > 0 ? (
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
