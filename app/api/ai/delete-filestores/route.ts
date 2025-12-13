import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';
import { updateFileSearchStoresID } from '@/services/source';

export async function POST(req: NextRequest) {
    try {

        const { sourceId, fileStoresId } = await req.json();
        await genAI.fileSearchStores.delete({
            name: fileStoresId,
            config: {
                force: true,
            }
        })

        await updateFileSearchStoresID(sourceId, null);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete filestore:", error);
        return NextResponse.json({ error: "Failed to delete filestore" }, { status: 500 });
    }
}