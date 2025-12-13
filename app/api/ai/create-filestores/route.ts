import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';
import { updateFileSearchStoresID } from '@/services/source';
import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';

export async function POST(req: NextRequest) {
    try {

        const { fileSearchStoreName, sourceId, file_urls } = await req.json();
        const fileSearchStore = await genAI.fileSearchStores.create({
            config: {
                displayName: fileSearchStoreName,
            }
        });

        if (file_urls && Array.isArray(file_urls)) {
            for (const url of file_urls) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        console.error(`Failed to fetch file from ${url}`);
                        continue;
                    }

                    const arrayBuffer = await response.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    // Create a temp file
                    const tempDir = os.tmpdir();
                    const fileName = path.basename(new URL(url).pathname) || 'temp_file';
                    const tempFilePath = path.join(tempDir, fileName);

                    await fs.writeFile(tempFilePath, buffer);

                    // Upload to File Search Store
                    let operation = await genAI.fileSearchStores.uploadToFileSearchStore({
                        file: tempFilePath,
                        fileSearchStoreName: fileSearchStore.name as string,
                        config: {
                            displayName: fileName,
                        }
                    });

                    let attempts = 0;
                    while (!operation.done && attempts < 30) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        operation = await genAI.operations.get({ operation });
                        attempts++;
                    }

                    // Cleanup temp file
                    try {
                        await fs.unlink(tempFilePath);
                    } catch (e) {
                        // Ignore error if file doesn't exist
                    }

                } catch (innerError) {
                    console.error("Error processing file URL:", url, innerError);
                }
            }
        }

        const fileSearchStoreID = fileSearchStore?.name as string;
        await updateFileSearchStoresID(sourceId, fileSearchStoreID);

        return NextResponse.json({ success: true, fileSearchStoreID });
    } catch (error: any) {
        console.error("Failed to create filestore:", error);
        return NextResponse.json({ error: "Failed to create filestore" }, { status: 500 });
    }
}