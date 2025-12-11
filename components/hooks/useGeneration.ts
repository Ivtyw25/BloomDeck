import { useState } from 'react';

export type GenerationType = 'flashcards' | 'summary' | 'notes';

export function useGeneration() {
    const [generatingItem, setGeneratingItem] = useState<GenerationType | null>(null);
    const [successItem, setSuccessItem] = useState<GenerationType | null>(null);

    const generate = (type: GenerationType) => {
        setGeneratingItem(type);
        setSuccessItem(null);

        // Mock Generation
        setTimeout(() => {
            setGeneratingItem(null);
            setSuccessItem(type);
            setTimeout(() => setSuccessItem(null), 3000);
        }, 2000);
    };

    return {
        generatingItem,
        successItem,
        generate,
        isGenerating: (type: GenerationType) => generatingItem === type,
        isSuccess: (type: GenerationType) => successItem === type,
        isAnyGenerating: generatingItem !== null
    };
}
