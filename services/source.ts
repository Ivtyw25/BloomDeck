'use server';

import { supabase } from '@/lib/supabase';
import { SourceDocument, FileType } from "@/app/types/types";
import { deleteFilesFromS3 } from '@/services/upload';

export interface CreateSourceParams {
    title: string;
    type: string;
    containedTypes?: string[] | null;
    size?: string | null;
    file_url?: string[] | null;
    youtube_url?: string | null;
}

/**
 * Inserts a new row into the "Source-Table" in Supabase.
 * This runs on the server.
 * 
 * @param data The data object to insert. Keys should match the table columns.
 * @returns The inserted data or throws an error.
 */
export async function createSource(data: CreateSourceParams) {
    const { data: insertedData, error } = await supabase
        .from('Sources-Table')
        .insert(data)
        .select()
        .single();

    if (error) {
        console.error("Supabase Insert Error:", error);
        throw new Error(`Failed to create source: ${error.message}`);
    }

    return insertedData;
}


/**
 * Fetches sources from the "Sources-Table" in Supabase.
 * This runs on the server.
 * 
 * @param inTrash Whether to fetch items in trash or not. Defaults to false.
 * @returns An array of SourceDocument objects.
 */
export async function getSources(inTrash: boolean = false): Promise<SourceDocument[]> {
    let query = supabase
        .from('Sources-Table')
        .select('*')
        .order('created_at', { ascending: false });

    if (inTrash) {
        query = query.eq('inTrash', true);
    } else {
        query = query.eq('inTrash', false);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Supabase Fetch Error:", error);
        throw new Error(`Failed to fetch sources: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        type: item.type as FileType,
        containedTypes: item.type === 'MIXED' ? (item.containedTypes as FileType[]) : undefined,
        dateAdded: item.created_at,
        size: item.type !== 'YOUTUBE' ? item.size : undefined,
        trashDate: item.trashed_at
    }));
}

/**
 * Fetches a single source by ID from the "Sources-Table" in Supabase.
 * This runs on the server.
 * 
 * @param id The ID of the source to fetch.
 * @returns A SourceDocument object or null if not found.
 */
// Helper to get key from URL (duplicate from upload.ts but kept for safety/isolation or export from there)
const extractKey = (url: string) => {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.substring(1);
    } catch (e) {
        return null;
    }
};

import { getPresignedDownloadUrl } from '@/services/upload';

export async function getSourceById(id: string): Promise<SourceDocument | null> {
    const { data, error } = await supabase
        .from('Sources-Table')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Supabase Fetch by ID Error:", error);
        return null;
    }

    if (!data) return null;

    let signedUrl: string | string[] | undefined = undefined;

    if (data.type !== 'YOUTUBE' && data.file_url) {
        const urls = Array.isArray(data.file_url) ? data.file_url : [data.file_url];
        const signedUrls = await Promise.all(urls.map(async (url: string) => {
            const key = extractKey(url);
            if (key) {
                return await getPresignedDownloadUrl(key) || url;
            }
            return url;
        }));
        
        signedUrl = Array.isArray(data.file_url) ? signedUrls : signedUrls[0];
    } else {
        signedUrl = data.youtube_url;
    }

    return {
        id: data.id,
        title: data.title,
        type: data.type as FileType,
        containedTypes: data.type === 'MIXED' ? (data.containedTypes as FileType[]) : undefined,
        dateAdded: data.created_at,
        size: data.type !== 'YOUTUBE' ? data.size : undefined,
        trashDate: data.trashed_at ? data.trashed_at : undefined,
        url: signedUrl
    };
}

export async function toggleTrashSource(id: string, inTrash: boolean) {
    const { error } = await supabase
        .from('Sources-Table')
        .update({ inTrash })
        .eq('id', id);

    if (error) {
        console.error("Supabase Toggle Trash Error:", error);
        throw new Error(`Failed to move source to trash: ${error.message}`);
    }
}

export async function deleteSource(id: string) {
    // Get the source to find file URLs
    const { data, error } = await supabase
        .from('Sources-Table')
        .select('file_url')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Supabase Fetch for Delete Error:", error);
        throw new Error("Failed to fetch source for deletion");
    }

    // Delete files from S3 if they exist
    if (data && data.file_url && Array.isArray(data.file_url)) {
        await deleteFilesFromS3(data.file_url);
    }

    // Delete from Supabase
    const { error: deleteError } = await supabase
        .from('Sources-Table')
        .delete()
        .eq('id', id);

    if (deleteError) {
        console.error("Supabase Delete Error:", deleteError);
        throw new Error(`Failed to delete source: ${deleteError.message}`);
    }
}
