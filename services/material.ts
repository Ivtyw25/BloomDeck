'use server';

import { supabase } from '@/lib/supabase';
import { MaterialItem, MaterialType, Flashcard } from "@/app/types/types";

export interface CreateMaterialParams {
    title: string;
    type: MaterialType;
    content?: string;
    preview?: string;
}


export async function getMaterials(inTrash: boolean = false): Promise<MaterialItem[]> {
    let query = supabase
        .from('Materials-Table')
        .select('*, flashcards(count)')
        .order('created_at', { ascending: false });

    if (inTrash) {
        query = query.eq('inTrash', true);
    } else {
        query = query.eq('inTrash', false);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Supabase Fetch Materials Error:", error);
        throw new Error(`Failed to fetch materials: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        type: item.type as MaterialType,
        cardCount: item.flashcards?.[0]?.count || 0,
        inTrash: item.inTrash,
        trashedAt: item.trashed_at,
        createdAt: item.created_at,
        content: item.content,
        preview: item.type !== 'FLASHCARD' ? item.preview : '',
    }));
}

export async function getMaterial(id: string): Promise<MaterialItem | null> {
    const { data, error } = await supabase
        .from('Materials-Table')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Supabase Fetch Material Error:", error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        type: data.type as MaterialType,
        inTrash: data.inTrash,
        trashedAt: data.trashed_at,
        createdAt: data.created_at,
        content: data.content,
        preview: data.preview // Include preview
    };
}

export async function getFlashcards(materialId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('materials_fk', materialId)
        .order('sequence', { ascending: true });

    if (error) {
        console.error("Supabase Fetch Flashcards Error:", error);
        throw new Error(`Failed to fetch flashcards: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        term: item.term,
        definition: item.definition,
        isStarred: item.is_starred,
        materialsFk: item.materials_fk
    }));
}

export async function toggleTrashMaterial(id: string, inTrash: boolean) {
    const { error } = await supabase
        .from('Materials-Table')
        .update({ inTrash })
        .eq('id', id);

    if (error) {
        console.error("Supabase Toggle Trash Material Error:", error);
        throw new Error(`Failed to move material to trash: ${error.message}`);
    }
}

export async function updateFlashcardStar(id: string, isStarred: boolean) {
    const { error } = await supabase
        .from('flashcards')
        .update({ is_starred: isStarred })
        .eq('id', id);

    if (error) {
        console.error("Supabase Update Flashcard Star Error:", error);
        throw new Error(`Failed to update star status: ${error.message}`);
    }
}

export async function updateAllFlashcardsStar(materialId: string, isStarred: boolean) {
    const { error } = await supabase
        .from('flashcards')
        .update({ is_starred: isStarred })
        .eq('materials_fk', materialId);

    if (error) {
        console.error("Supabase Update All Flashcards Star Error:", error);
        throw new Error(`Failed to update all stars: ${error.message}`);
    }
}

export async function updateFlashcardContent(id: string, term: string, definition: string) {
    const { error } = await supabase
        .from('flashcards')
        .update({ term, definition })
        .eq('id', id);

    if (error) {
        console.error("Supabase Update Flashcard Content Error:", error);
        throw new Error(`Failed to update flashcard content: ${error.message}`);
    }
}

export async function deleteMaterial(id: string) {
    const { error } = await supabase
        .from('Materials-Table')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Supabase Delete Material Error:", error);
        throw new Error(`Failed to delete material: ${error.message}`);
    }
}

export async function createMaterial(data: CreateMaterialParams) {
    const { data: insertedData, error } = await supabase
        .from('Materials-Table')
        .insert(data)
        .select()
        .single();

    if (error) {
        console.error("Supabase Create Material Error:", error);
        throw new Error(`Failed to create material: ${error.message}`);
    }

    return insertedData;
}

export async function saveGeneratedDeck(title: string, flashcards: { term: string, definition: string }[]) {
    const material = await createMaterial({
        title: title,
        type: 'FLASHCARD' as MaterialType,
    });

    if (!material) {
        throw new Error("Failed to create material");
    }

    const flashcardsData = flashcards.map((card, index) => ({
        materials_fk: material.id,
        term: card.term,
        definition: card.definition,
        sequence: index,
        is_starred: false
    }));

    const { error } = await supabase
        .from('flashcards')
        .insert(flashcardsData);

    if (error) {
        console.error("Supabase Batch Insert Flashcards Error:", error);
        throw new Error(`Failed to save flashcards: ${error.message}`);
    }

    return material;
}

export async function saveGeneratedNote(title: string, content: string, preview: string) {
    const material = await createMaterial({
        title: title,
        type: 'NOTE' as MaterialType,
        content: content,
        preview: preview
    });

    if (!material) {
        throw new Error("Failed to create note material");
    }

    return material;
}
