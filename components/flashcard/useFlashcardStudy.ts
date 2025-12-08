import { useState, useCallback, useEffect } from 'react';
import { FLASHCARDS } from '@/lib/constants';
import { FlashcardData } from '@/types/types';

export const useFlashcardStudy = (deckId: string) => {
    // In a real app, this would fetch based on deckId.
    // Assuming FLASHCARDS is the source for now.

    const [deck, setDeck] = useState<FlashcardData[]>([...FLASHCARDS]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [isTermMode, setIsTermMode] = useState(true); // True = Term front, False = Def front
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Pagination for terms list needs to be handled by the list component or passed down
    // But since the original page had it, let's keep list state here or in the list component.
    // The user wants separation of concerns. List state belongs to List component ideally, 
    // unless the parent needs to control it. Here parent doesn't seem to need it.
    // I will move list pagination state to TermList component.

    // Edit States
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ term: string, definition: string }>({ term: '', definition: '' });

    // Derived state
    const activeDeck = showStarredOnly ? deck.filter(c => c.isStarred) : deck;
    const currentCard = activeDeck[currentIndex];

    // Actions
    const handleNext = useCallback(() => {
        if (currentIndex < activeDeck.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
        }
    }, [currentIndex, activeDeck.length]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
        }
    }, [currentIndex]);

    const handleFlip = useCallback(() => {
        setIsFlipped(prev => !prev);
    }, []);

    const toggleStar = useCallback((id: string) => {
        const newDeck = deck.map(c =>
            c.id === id ? { ...c, isStarred: !c.isStarred } : c
        );
        setDeck(newDeck);
    }, [deck]);

    const handleToggleAllStars = useCallback(() => {
        const allStarred = deck.every(c => c.isStarred);
        const newDeck = deck.map(c => ({ ...c, isStarred: !allStarred }));
        setDeck(newDeck);
    }, [deck]);

    const handleShuffle = useCallback(() => {
        const shuffled = [...deck].sort(() => Math.random() - 0.5);
        setDeck(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [deck]);

    const toggleMode = useCallback(() => {
        setIsTermMode(prev => !prev);
        setIsFlipped(false);
    }, []);

    // Edit Actions
    const startEditing = (card: FlashcardData) => {
        setEditingId(card.id);
        setEditForm({ term: card.term, definition: card.definition });
    };

    const saveEditing = () => {
        if (!editingId) return;
        setDeck(prev => prev.map(c => c.id === editingId ? { ...c, term: editForm.term, definition: editForm.definition } : c));
        setEditingId(null);
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const setEditFormState = (updates: Partial<{ term: string, definition: string }>) => {
        setEditForm(prev => ({ ...prev, ...updates }));
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.code) {
                case 'Space':
                case 'Enter':
                    e.preventDefault();
                    handleFlip();
                    break;
                case 'ArrowRight':
                    handleNext();
                    break;
                case 'ArrowLeft':
                    handlePrev();
                    break;
                case 'KeyS':
                    if (currentCard) toggleStar(currentCard.id);
                    break;
                case 'KeyR':
                    handleShuffle();
                    break;
                case 'KeyT':
                    toggleMode();
                    break;
                case 'Escape':
                    if (isFullScreen) setIsFullScreen(false);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, handleFlip, toggleStar, handleShuffle, toggleMode, isFullScreen, currentCard]);

    return {
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
        actions: {
            handleNext,
            handlePrev,
            handleFlip,
            toggleStar,
            handleToggleAllStars,
            handleShuffle,
            toggleMode,
            setIsFullScreen,
            setShowStarredOnly,
            startEditing,
            saveEditing,
            cancelEditing,
            setEditForm: setEditFormState
        }
    };
};
