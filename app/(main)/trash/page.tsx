"use client"
import { TRASH_FILTER_OPTIONS, MATERIAL_FILTER_OPTIONS } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { SourceToolbar } from '@/components/source/SourceToolbar';
import { AnimatePresence, motion } from 'framer-motion';
import SourceCard from '@/components/ui/SourceCard';
import { EmptySourceState } from '@/components/source/EmptySourceState';
import MaterialCard from '@/components/ui/MaterialCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResourceGrid } from '@/components/layout/ResourceGrid';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useResourceFilter } from '@/hooks/useResourceFilter';
import { getSources } from '@/services/source';
import { getMaterials } from '@/services/material';
import { SourceDocument, MaterialItem } from '@/types/types';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function TrashPage() {
    const [viewMode, setViewMode] = useState<'SOURCE' | 'MATERIAL'>('SOURCE');
    const [sources, setSources] = useState<SourceDocument[]>([]);
    const [materials, setMaterials] = useState<MaterialItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrash = async () => {
            try {
                const [sourcesData, materialsData] = await Promise.all([
                    getSources(true),
                    getMaterials(true)
                ]);
                setSources(sourcesData);
                setMaterials(materialsData);
            } catch (error) {
                console.error("Failed to fetch trash:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrash();

        const sourceChannel = supabase
            .channel('realtime:trash_sources')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'Sources-Table',
            }, () => {
                fetchTrash();
            })
            .subscribe();

        const materialChannel = supabase
            .channel('realtime:trash_materials')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'Materials-Table',
                // Note: listening to all events is safer to catch moves to/from trash
            }, () => {
                fetchTrash();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(sourceChannel);
            supabase.removeChannel(materialChannel);
        };
    }, []);

    const items = viewMode === 'SOURCE' ? sources : materials;
    const dateField = viewMode === 'SOURCE' ? 'dateAdded' : 'createdAt';
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

            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-primary animate-spin" />
                </div>
            ) : filteredItems.length > 0 ? (
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
