import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Pencil, Check, X as XIcon } from 'lucide-react';
import { FlashcardData } from '@/types/types';

interface TermListProps {
    deck: FlashcardData[];
    allStarred: boolean;
    editingId: string | null;
    editForm: { term: string, definition: string };
    onToggleAllStars: () => void;
    onToggleStar: (id: string) => void;
    onStartEdit: (card: FlashcardData) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onEditFormChange: (updates: Partial<{ term: string, definition: string }>) => void;
}

export default function TermList({
    deck,
    allStarred,
    editingId,
    editForm,
    onToggleAllStars,
    onToggleStar,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onEditFormChange
}: TermListProps) {
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(deck.length / ITEMS_PER_PAGE);
    const paginatedList = deck.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // If deck length changes, safe check page
    if (page > totalPages && totalPages > 0) {
        setPage(totalPages);
    }

    return (
        <div className="mt-15 max-w-4xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-heading font-bold text-text-main">Terms in this set ({deck.length})</h2>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleAllStars}
                        className="text-sm font-medium text-primary cursor-pointer hover:scale-105 active:scale-95 hover:text-primary-hover transition-colors flex items-center gap-1"
                    >
                        {allStarred ? 'Unstar All' : 'Star All'}
                    </button>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm p-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1 cursor-pointer transition-all hover:scale-110 active:scale-90 hover:-translate-x-1 text-text-muted hover:text-primary-hover disabled:opacity-30"
                            >
                                <ChevronLeft strokeWidth={3} className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <span className="px-3 text-xs sm:text-sm font-medium text-text-muted">
                                {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-1 cursor-pointer transition-all hover:scale-110 active:scale-90 hover:translate-x-1 text-text-muted hover:text-primary-hover disabled:opacity-30"
                            >
                                <ChevronRight strokeWidth={3} className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* List Header Row (Desktop) */}
            <div className="hidden md:flex px-6 pb-2 text-xs font-bold text-text-muted uppercase tracking-wider">
                <div className="flex-1">Term</div>
                <div className="flex-[1.5]">Definition</div>
                <div className="w-24 text-right">Actions</div>
            </div>

            <div className="space-y-4">
                {paginatedList.map((card) => {
                    const isEditing = editingId === card.id;

                    return (
                        <div key={card.id} className={`bg-white p-4 sm:p-6 rounded-2xl shadow-sm border ${isEditing ? 'border-primary/50 ring-1 ring-primary/50' : 'border-surface-border hover:shadow-md hover:border-primary/30'} transition-all flex flex-col md:flex-row gap-4 sm:gap-6 md:items-start justify-between group`}>

                            {/* Term Column */}
                            <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6 md:border-dashed">
                                <span className="md:hidden text-xs text-text-muted uppercase tracking-wider font-semibold block mb-1 opacity-50">Term</span>

                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.term}
                                        onChange={(e) => onEditFormChange({ term: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 outline-none text-sm sm:text-base"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="text-text-main font-medium break-words text-sm sm:text-base">{card.term}</p>
                                )}
                            </div>

                            {/* Definition Column */}
                            <div className="flex-[1.5]">
                                <span className="md:hidden text-xs text-text-muted uppercase tracking-wider font-semibold block mb-1 opacity-50">Definition</span>

                                {isEditing ? (
                                    <textarea
                                        value={editForm.definition}
                                        onChange={(e) => onEditFormChange({ definition: e.target.value })}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 outline-none resize-none text-sm sm:text-base"
                                    />
                                ) : (
                                    <p className="text-text-main break-words leading-relaxed text-sm sm:text-base">{card.definition}</p>
                                )}
                            </div>

                            {/* Actions Column */}
                            <div className="flex items-center gap-2 opacity-100 transition-opacity justify-end md:w-24 mt-2 md:mt-0 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={onSaveEdit}
                                            className="p-2 cursor-pointer text-text-muted hover:scale-110 active:scale-90 hover:text-primary-hover transition-colors"
                                            title="Save"
                                        >
                                            <Check strokeWidth={3} className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                        <button
                                            onClick={onCancelEdit}
                                            className="p-2 cursor-pointer text-text-muted hover:scale-110 active:scale-90 hover:text-red-500 transition-colors"
                                            title="Cancel"
                                        >
                                            <XIcon strokeWidth={3} className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => onToggleStar(card.id)}
                                            className={`p-2 cursor-pointer text-text-muted hover:scale-110 active:scale-90 transition-colors ${card.isStarred ? 'text-yellow-400' : 'text-text-muted'}`}
                                            title="Star card (s)"
                                        >
                                            <Star strokeWidth={3} className={`w-4 h-4 sm:w-5 sm:h-5 ${card.isStarred ? 'fill-current' : ''}`} />
                                        </button>
                                        <button
                                            onClick={() => onStartEdit(card)}
                                            className="p-2 cursor-pointer text-text-muted hover:scale-110 active:scale-90 hover:text-primary-hover transition-colors"
                                            title="Edit card"
                                        >
                                            <Pencil strokeWidth={3} className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
