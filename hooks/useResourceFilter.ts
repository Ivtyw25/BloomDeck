import { useState, useMemo } from 'react';

interface SortConfig {
    key: 'date' | 'title';
    direction: 'asc' | 'desc';
}

interface FilterableItem {
    id: string;
    title: string;
    type: string;
    [key: string]: any;
}

interface UseResourceFilterProps<T extends FilterableItem> {
    items: T[];
    dateField?: keyof T; 
}

export function useResourceFilter<T extends FilterableItem>({ items, dateField = 'dateAdded' }: UseResourceFilterProps<T>) {
    const [filterType, setFilterType] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const typeValue = item.type;
            const containedTypes = item.containedTypes as string[] | undefined;

            const matchesType = filterType === 'ALL' ||
                typeValue === filterType ||
                (filterType === 'FLASHCARDS' && item.type === 'FLASHCARD') || // Specific alias handling
                (filterType === 'NOTES' && item.type === 'NOTE') ||
                (containedTypes && containedTypes.includes(filterType));

            // Search Filtering
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = item.title.toLowerCase().includes(searchLower) ||
                (item.sourceName && (item.sourceName as string).toLowerCase().includes(searchLower));

            return matchesType && matchesSearch;
        }).sort((a, b) => {
            if (sortConfig.key === 'date') {
                const dateA = new Date(a[dateField] as string).getTime();
                const dateB = new Date(b[dateField] as string).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            } else {
                return sortConfig.direction === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            }
        });
    }, [items, filterType, searchQuery, sortConfig, dateField]);

    return {
        filteredItems,
        filterType,
        setFilterType,
        searchQuery,
        setSearchQuery,
        sortConfig,
        setSortConfig,
        isFilterOpen,
        setIsFilterOpen
    };
}
