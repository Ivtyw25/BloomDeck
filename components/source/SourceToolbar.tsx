'use client';
import { Search, Calendar, ArrowDown, Type, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { FILTER_OPTIONS } from '@/lib/constants';
import { Popover, PopoverContent, PopoverTrigger, PopoverPortal } from '@/components/animate-ui/primitives/radix/popover';

interface SortConfig {
    key: 'date' | 'title';
    direction: 'asc' | 'desc';
}

interface SourceToolbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterType: string;
    setFilterType: (type: string) => void;
    sortConfig: SortConfig;
    setSortConfig: (config: SortConfig | ((current: SortConfig) => SortConfig)) => void;
    isFilterOpen: boolean;
    setIsFilterOpen: (isOpen: boolean) => void;
}

export function SourceToolbar({
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    sortConfig,
    setSortConfig,
    isFilterOpen,
    setIsFilterOpen
}: SourceToolbarProps) {

    const handleSort = (key: 'date' | 'title') => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    return (
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search sources..."
                    className="w-full pl-12 pr-4 py-3 bg-surface-subtle shadow-xs hover:bg-gray-50 border-transparent rounded-xl text-sm font-normal text-text-main placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
                {/* Filter Tabs */}
                <div className="hidden sm:flex items-center bg-surface-subtle p-1 rounded-xl">
                    {FILTER_OPTIONS.map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`relative cursor-pointer px-5 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-colors duration-300 z-0 ${filterType === type
                                ? 'text-primary'
                                : 'text-text-muted hover:text-text-main hover:bg-gray-200/50'
                                }`}
                        >
                            {filterType === type && (
                                <motion.div
                                    layoutId="active-filter"
                                    className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg -z-10"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{type}</span>
                        </button>
                    ))}
                </div>

                <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

                {/* Sort Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleSort('date')}
                        className={`cursor-pointer flex items-center gap-2 md:px-3 px-2 md:py-2 py-1 text-[10px] md:text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${sortConfig.key === 'date' ? 'text-primary bg-green-50' : 'text-text-muted hover:bg-surface-subtle'
                            }`}
                    >
                        <Calendar className={`md:w-4 md:h-4 w-3 h-3 ${sortConfig.key === 'date' ? 'text-primary' : 'text-gray-400'}`} />
                        Date
                        {sortConfig.key === 'date' && (
                            <motion.div
                                animate={{ rotate: sortConfig.direction === 'desc' ? 0 : 180 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <ArrowDown className="md:w-3.5 md:h-3.5 w-2.5 h-2.5" />
                            </motion.div>
                        )}
                    </button>

                    <button
                        onClick={() => handleSort('title')}
                        className={`cursor-pointer flex items-center gap-2 md:px-3 px-2 md:py-2 py-1 text-[10px] md:text-xs font-semibold rounded-lg transition-colors whitespace-nowrap 
                                ${sortConfig.key === 'title' ? 'text-primary bg-green-50' : 'text-text-muted hover:bg-surface-subtle'
                            }`}
                    >
                        <Type className={`md:w-4 md:h-4 w-3 h-3 ${sortConfig.key === 'title' ? 'text-primary' : 'text-gray-400'}`} />
                        Title
                        {sortConfig.key === 'title' && (
                            <motion.div
                                animate={{ rotate: sortConfig.direction === 'desc' ? 0 : 180 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <ArrowDown className="md:w-3.5 md:h-3.5 w-2.5 h-2.5" />
                            </motion.div>
                        )}
                    </button>
                </div>
                {/* Mobile Filter Button & Popout */}
                <div className="relative sm:hidden">
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <button
                                className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-surface-subtle text-text-main hover:text-gray-600 rounded-xl text-[10px] font-medium border border-gray-200 active:bg-gray-100 transition-colors"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>{filterType === 'ALL' ? 'Filter Type' : filterType}</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverPortal>
                            <PopoverContent
                                sideOffset={5}
                                align="start"
                                className="w-40 bg-white rounded-xl shadow-lg border border-gray-100 p-1 z-50 focus:outline-none"
                            >
                                <div className="flex flex-col gap-0.5">
                                    {FILTER_OPTIONS.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => { setFilterType(type); setIsFilterOpen(false); }}
                                            className={`px-3 py-2 text-left text-xs rounded-lg hover:bg-gray-50 flex items-center justify-between w-full transition-colors ${filterType === type ? 'text-primary font-semibold bg-green-50/50' : 'text-text-main'
                                                }`}
                                        >
                                            {type === 'ALL' ? 'All Sources' : type}
                                            {filterType === type && <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>}
                                        </button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </PopoverPortal>
                    </Popover>
                </div>
            </div>
        </div>
    );
}
