"use client"
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useFlashcardStudy } from '@/components/flashcard/useFlashcardStudy';
import StudyHeader from '@/components/flashcard/StudyHeader';
import StudyDisplay from '@/components/flashcard/StudyDisplay';
import StudyControls from '@/components/flashcard/StudyControls';
import TermList from '@/components/flashcard/TermList';
import { useEffect, useState, use } from 'react';
import { getMaterial, deleteMaterial } from '@/services/material';
import { useRouter } from 'next/navigation';
import { MaterialItem } from '@/types/types';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { toast } from 'sonner';

interface MaterialDetailProps {
    params: Promise<{ id: string }>;
}

export default function MaterialDetailView({ params }: MaterialDetailProps) {
    const { id } = use(params);
    const [material, setMaterial] = useState<MaterialItem | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchMaterial = async () => {
            const data = await getMaterial(id);
            setMaterial(data);
            setLoading(false);
        };
        fetchMaterial();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!material) {
        return <div>Material not found</div>;
    }

    if (material.type === 'NOTE') {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mb-4">Note View</h1>
                <p className="text-gray-500 mb-4">Note UI implementation pending.</p>
                <button onClick={() => router.push('/materials')} className="flex items-center gap-2 text-brand-textSecondary hover:text-brand-primary">
                    <ArrowLeft className="w-4 h-4" /> Back to Materials
                </button>
            </div>
        );
    }

    return (
        <FlashcardStudyWrapper
            deckId={material.id}
            deckTitle={material.title}
            onBack={() => router.push('/materials')}
        />
    );
}

interface FlashcardStudyWrapperProps {
    deckId: string;
    deckTitle: string;
    onBack: () => void;
}

function FlashcardStudyWrapper({ deckId, deckTitle, onBack }: FlashcardStudyWrapperProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDeleteSet = async () => {
        setIsDeleting(true);
        try {
            await deleteMaterial(deckId);
            toast.success("Flashcard set deleted successfully");
            router.push('/materials');
        } catch (e) {
            console.error("Failed to delete flashcard set:", e);
            toast.error("Failed to delete flashcard set");
            setIsDeleting(false);
        }
    };

    const {
        deck,
        activeDeck,
        currentCard,
        currentIndex,
        isFlipped,
        showStarredOnly,
        isTermMode,
        isFullScreen,
        isUpdating,
        editingId,
        editForm,
        actions,
        loading
    } = useFlashcardStudy(deckId);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // If no cards (e.g. starred filter active but no stars, OR empty deck)
    if (!currentCard && activeDeck.length === 0 && deck.length > 0 && showStarredOnly) {
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

    if (deck.length === 0 && !loading) {
        return (
            <div className="container mx-auto px-6 py-28 min-h-screen flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-brand-textPrimary mb-4">Empty Deck</h2>
                <p className="text-brand-textSecondary mb-8">This deck has no flashcards.</p>
                <button onClick={onBack} className="flex items-center gap-2 text-brand-textSecondary hover:text-brand-primary">
                    <ArrowLeft className="w-4 h-4" /> Back to Materials
                </button>
            </div>
        );
    }

    const allCardsStarred = deck.length > 0 && deck.every(c => c.isStarred);

    return (
        <div className={`flex flex-col max-w-full animate-slide-in-right ${isFullScreen ? 'fixed inset-0 z-50 overflow-hidden' : 'container mx-auto px-4 sm:px-6 py-4 min-h-screen'}`}>

            {!isFullScreen && (
                <StudyHeader
                    title={deckTitle}
                    totalTerms={deck.length}
                    currentIndex={currentIndex}
                    totalActive={activeDeck.length}
                    onBack={onBack}
                    onDeleteSet={() => setIsDeleteDialogOpen(true)}
                />
            )}

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
                onNext={actions.handleNext}
                onPrev={actions.handlePrev}
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
                    onToggleFullScreen={() => actions.setIsFullScreen(!isFullScreen)}
                    isUpdating={isUpdating}
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

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteSet}
                title="Delete Set Functionality"
                description={`Are you sure you want to permanently delete "${deckTitle}"? This action cannot be undone.`}
                confirmText="Delete Set"
                isLoading={isDeleting}
                loadingText="Deleting..."
            />
        </div>
    );
}
