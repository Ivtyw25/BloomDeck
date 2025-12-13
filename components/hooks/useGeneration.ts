import { useState } from 'react';
import { toast } from 'sonner';
import { saveGeneratedDeck, saveGeneratedNote } from '@/services/material';

export type GenerationType = 'flashcards' | 'summary' | 'notes';

interface UseGenerationProps {
    sourceId: string;
    fileSearchStoreID?: string;
}

export function useGeneration({ sourceId, fileSearchStoreID }: UseGenerationProps) {
    const [generatingItem, setGeneratingItem] = useState<GenerationType | null>(null);
    const [successItem, setSuccessItem] = useState<GenerationType | null>(null);
    const [generatedMaterialId, setGeneratedMaterialId] = useState<string | null>(null);
    const [generatedTitle, setGeneratedTitle] = useState<string>('');

    const generate = async (type: GenerationType) => {
        if (!sourceId || !fileSearchStoreID) {
            toast.error("Source not ready for generation");
            return;
        }

        setGeneratingItem(type);
        setSuccessItem(null);
        setGeneratedMaterialId(null);

        try {
            if (type === 'flashcards') {
                const response = await fetch('/api/ai/generate-decks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileSearchStoreID })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to generate content");
                }

                if (!data.flashcards || !data.title) {
                    throw new Error("Invalid AI response format");
                }

                const material = await saveGeneratedDeck(
                    data.title,
                    data.flashcards
                );

                setGeneratedMaterialId(material.id);
                setGeneratedTitle(material.title);
                setSuccessItem(type);
                toast.success("Flashcards generated successfully!");
            } else if (type === 'notes') {
                const response = await fetch('/api/ai/create-notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileSearchStoreID })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to generate notes");
                }

                if (!data.content || !data.title || !data.preview) {
                    throw new Error("Invalid AI response format");
                }

                const material = await saveGeneratedNote(
                    data.title,
                    data.content,
                    data.preview
                );

                setGeneratedMaterialId(material.id);
                setGeneratedTitle(material.title);
                setSuccessItem(type);
                toast.success("Notes generated successfully!");
            }
            // Add other types here
        } catch (error: any) {
            console.error("Generation error:", error);
            toast.error(error.message || "Failed to generate. Please try again.");
        } finally {
            setGeneratingItem(null);
        }
    };

    return {
        generatingItem,
        successItem,
        generate,
        generatedMaterialId,
        generatedTitle,
        isGenerating: (type: GenerationType) => generatingItem === type,
        isSuccess: (type: GenerationType) => successItem === type,
        isAnyGenerating: generatingItem !== null,
        resetSuccess: () => setSuccessItem(null)
    };
}
