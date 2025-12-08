"use client"
import { ArrowLeft } from 'lucide-react';
import { MOCK_MATERIALS } from '@/lib/constants'; // Data import
import { useFlashcardStudy } from '@/components/flashcard/useFlashcardStudy';
import StudyHeader from '@/components/flashcard/StudyHeader';
import StudyDisplay from '@/components/flashcard/StudyDisplay';
import StudyControls from '@/components/flashcard/StudyControls';
import TermList from '@/components/flashcard/TermList';

interface FlashcardStudyViewProps {
    deckId: string;
    onBack: () => void;
}

export default function FlashcardStudyView({ deckId, onBack }: FlashcardStudyViewProps) {
    // --- Data Fetching ---
    const deckInfo = MOCK_MATERIALS.find(m => m.id === deckId);
    const deckTitle = deckInfo?.title || "Untitled Deck";

    // --- Logic Hook ---
    const {
        deck,
        activeDeck,
        currentCard,
        currentIndex,
        isFlipped,
        showStarredOnly,
        isTermMode,
        isFullScreen,
        editingId,
        editForm,
        actions
    } = useFlashcardStudy(deckId);

    // If no cards (e.g. starred filter active but no stars)
    if (!currentCard && activeDeck.length === 0 && showStarredOnly) {
        return (
            <div className="container mx-auto px-6 py-28 min-h-screen flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-brand-textPrimary mb-4">No starred cards</h2>
                <p className="text-brand-textSecondary mb-8">You haven't starred any cards in this deck yet.</p>
                <div className="flex gap-4">
                    <button onClick={() => actions.setShowStarredOnly(false)} className="text-brand-primary underline">Show All Cards</button>
                    <button onClick={onBack} className="flex items-center gap-2 text-brand-textSecondary hover:text-brand-primary">
                        <ArrowLeft className="w-4 h-4" /> Back to Materials
                    </button>
                </div>
            </div>
        );
    }

    const allCardsStarred = deck.length > 0 && deck.every(c => c.isStarred);

    return (
        <div className={`flex flex-col max-w-full animate-slide-in-right ${isFullScreen ? 'fixed inset-0 z-50 overflow-hidden' : 'container mx-auto px-4 sm:px-6 py-4 min-h-screen'}`}>

            {/* Top Header Section (Hidden in Full Screen) */}
            {!isFullScreen && (
                <StudyHeader
                    title={deckTitle}
                    totalTerms={deck.length}
                    currentIndex={currentIndex}
                    totalActive={activeDeck.length}
                    onBack={onBack}
                />
            )}

            {/* Study Area (Wrapped in StudyDisplay for layout) */}
            <StudyDisplay
                deckTitle={deckTitle}
                currentIndex={currentIndex}
                totalCards={activeDeck.length}
                currentCard={currentCard}
                isTermMode={isTermMode}
                isFlipped={isFlipped}
                isFullScreen={isFullScreen}
                onFlip={actions.handleFlip}
                onToggleFullScreen={actions.setIsFullScreen}
            />

            <div className="relative -mt-4 z-20 px-4 md:px-0 mb-4 flex justify-center">
                <StudyControls
                    currentCard={currentCard}
                    currentIndex={currentIndex}
                    totalCards={activeDeck.length}
                    isFullScreen={isFullScreen}
                    showStarredOnly={showStarredOnly}
                    isTermMode={isTermMode}
                    onToggleStar={() => actions.toggleStar(currentCard.id)}
                    onShuffle={actions.handleShuffle}
                    onPrev={actions.handlePrev}
                    onNext={actions.handleNext}
                    onToggleStarredOnly={() => actions.setShowStarredOnly(!showStarredOnly)}
                    onToggleMode={actions.toggleMode}
                />
            </div>



            {/* Terms List Section (Hidden in Full Screen) */}
            {!isFullScreen && (
                <TermList
                    deck={deck}
                    allStarred={allCardsStarred}
                    editingId={editingId}
                    editForm={editForm}
                    onToggleAllStars={actions.handleToggleAllStars}
                    onToggleStar={actions.toggleStar}
                    onStartEdit={actions.startEditing}
                    onSaveEdit={actions.saveEditing}
                    onCancelEdit={actions.cancelEditing}
                    onEditFormChange={actions.setEditForm}
                />
            )}
        </div>
    );
}