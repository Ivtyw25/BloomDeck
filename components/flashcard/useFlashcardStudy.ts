import { useState, useCallback, useEffect } from 'react';
import { getFlashcards, updateFlashcardStar, updateAllFlashcardsStar, updateFlashcardContent } from '@/services/material';
import { FlashcardData } from '@/types/types';

export const useFlashcardStudy = (deckId: string) => {
    const [deck, setDeck] = useState<FlashcardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [isTermMode, setIsTermMode] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ term: string, definition: string }>({ term: '', definition: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const data = await getFlashcards(deckId);
                setDeck(data);
            } catch (e) {
                console.error("Failed to fetch flashcards:", e);
            } finally {
                setLoading(false);
            }
        };
        if (deckId) fetchDeck();
    }, [deckId]);

    // Reset navigation when filtering changes
    useEffect(() => {
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [showStarredOnly]);

    // Derived state
    const activeDeck = showStarredOnly ? deck.filter(c => c.isStarred) : deck;
    const currentCard = activeDeck[currentIndex];

    // Actions
    const handleNext = useCallback(() => {
        if (currentIndex < activeDeck.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 100);
        }
    }, [currentIndex, activeDeck.length]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 100);
        }
    }, [currentIndex]);

    const handleFlip = useCallback(() => {
        setIsFlipped(prev => !prev);
    }, []);

    const toggleStar = useCallback(async (id: string) => {
        const card = deck.find(c => c.id === id);
        if (!card) return;
        const newStatus = !card.isStarred;
        setIsUpdating(true);

        // Optimistic update
        const newDeck = deck.map(c =>
            c.id === id ? { ...c, isStarred: newStatus } : c
        );
        setDeck(newDeck);

        try {
            await updateFlashcardStar(id, newStatus);
        } catch (e) {
            console.error("Failed to update star:", e);
            // Revert
            setDeck(deck);
        } finally {
            setIsUpdating(false);
        }
    }, [deck]);

    const handleToggleAllStars = useCallback(async () => {
        const allStarred = deck.every(c => c.isStarred);
        const newStatus = !allStarred;
        const newDeck = deck.map(c => ({ ...c, isStarred: newStatus }));
        setDeck(newDeck);
        setIsUpdating(true);

        try {
            await updateAllFlashcardsStar(deckId, newStatus);
        } catch (e) {
            console.error("Failed to update all stars:", e);
            setDeck(deck);
        } finally {
            setIsUpdating(false);
        }
    }, [deck, deckId]);

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

    const [isExplaining, setIsExplaining] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    const handleExplainConcept = async () => {
        if (!currentCard) return;

        setIsExplaining(true);
        setShowExplanationModal(true);
        setExplanation("");

        try {
            const response = await fetch('/api/ai/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    term: currentCard.term,
                    definition: currentCard.definition
                })
            });
            if (!response.ok) throw new Error('Failed to start stream');
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Stop loading indicator as soon as stream starts
            setIsExplaining(false);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                setExplanation(prev => (prev || "") + chunk);
            }
        } catch (error) {
            console.error("Failed to explain:", error);
            setExplanation("Failed to generate explanation. Please try again.");
        } finally {
            setIsExplaining(false);
        }
    };

    const saveEditing = async () => {
        if (!editingId) return;
        const previousDeck = deck;
        const updatedDeck = deck.map(c => c.id === editingId ? { ...c, term: editForm.term, definition: editForm.definition } : c);

        setDeck(updatedDeck);
        setEditingId(null);

        try {
            await updateFlashcardContent(editingId, editForm.term, editForm.definition);
        } catch (e) {
            console.error("Failed to update content:", e);
            setDeck(previousDeck);
        }
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
                case 'KeyQ':
                    setShowStarredOnly(prev => !prev);
                    break;
                case 'KeyF':
                    setIsFullScreen(prev => !prev);
                    break;
                case 'KeyE':
                    handleExplainConcept();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, handleFlip, toggleStar, handleShuffle, toggleMode, isFullScreen, currentCard]);

    return {
        deck,
        loading,
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
        isExplaining,
        explanation,
        showExplanationModal,
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
            setEditForm: setEditFormState,
            handleExplainConcept,
            setShowExplanationModal
        }
    };
};
