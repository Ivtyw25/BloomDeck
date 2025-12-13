import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';
import { z } from "zod";
import { cleanJsonString } from '@/lib/ai-utils';

export async function POST(req: NextRequest) {
    // Schema for validation
    const notesSchema = z.object({
        title: z.string().describe("A short, clear title for the study notes."),
        content: z.string().describe("Markdown-formatted study notes. Use bullet points, bold text, headings, and clear formatting."),
        preview: z.string().describe("text review of the study notes.")
    });

    let generatedText = "";

    try {
        const { fileSearchStoreID, url } = await req.json();

        if (!fileSearchStoreID && !url) {
            return NextResponse.json({ error: "fileSearchStoreID or url is required" }, { status: 400 });
        }

        let systemInstruction = `
        <role>
            You are an educator specialized in reading, understanding, and summarizing documents and videos into structured study guides. 
            Your purpose is to extract the essential ideas, main concepts, and key takeaways from the provided files and rewrite 
            them into clear, concise Markdown-formatted notes that help users grasp the content quickly.
        </role>

        <constraints>
            1. Output strictly valid JSON only. 
            2. Do NOT include any introductory or concluding text. 
            3. The output must be parseable by JSON.parse() directly.
            4. Do cover all the important concepts from the source, Do NOT miss any.
            5. Do NOT include double quotes inside the content field. use single quotes instead.
            6. ALL information used to generate the title, terms, and definitions **MUST** come from the retrieved document chunks or video content. 
        </constraints>

        <instructions>
            1. Read and deeply understand the content provided in the file(s) or video.
            2. Identify the most important concepts, definitions, arguments, examples, and insights.
            3. Rewrite the content into a structured study guide using Markdown formatting.
            4. formatting rules:
               - Use # for main titles (though the JSON has a separate title field).
               - Use ## and ### for subheadings.
               - Use bullet points (-) for lists.
               - Use **bold** for key terms.
               - Use *italics* for emphasis.
            5. Output must be a VALID JSON object with exactly three keys: "title", "content", and "preview".
            6. "title": A concise title for the notes.
            7. "content": A single string containing the entire Markdown-formatted note. use \\n for newlines.
            8. "preview": A short text summary (2-3 sentences) of what these notes cover, suitable for a card preview.
            9. Do not output markdown code blocks wrapping the JSON. Just the raw JSON string is preferred, but code blocks are acceptable if parsed correctly.
        </instructions>

        <output_format>
        {
            "title": "Title of the Notes",
            "content": "# Heading\\n\\n* Point 1\\n* Point 2\\n\\n## Subheading\\n\\nDetails...",
            "preview": "These notes cover the fundamental concepts of..."
        }
        </output_format>
        `;

        if (url) {
            systemInstruction += `
            <youtube_instructions>
            - The provided content is a YouTube video.
            - Extract key concepts visually shown or verbally explained in the video.
            </youtube_instructions>
            `;
        }

        const prompt = `
            Generate structured study notes based on the provided files. 
            Focus on clarity and comprehensive coverage of key topics.
        `;

        const userContentParts: any[] = [{ text: prompt }];
        if (url) {
            userContentParts.push({
                fileData: {
                    mimeType: "video/mp4",
                    fileUri: url
                }
            });
        }

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.6,
                topP: 0.8,
                maxOutputTokens: 10000,
                tools: (fileSearchStoreID && !url) ? [{
                    fileSearch: {
                        fileSearchStoreNames: [fileSearchStoreID]
                    }
                }] : undefined,
            },
            contents: [{ role: 'user', parts: userContentParts }]
        });

        generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!generatedText) {
            throw new Error("No content generated");
        }

        // Clean up code blocks if the model ignores the "no markdown" rule
        const cleanedText = cleanJsonString(generatedText);
        const parsedResult = JSON.parse(cleanedText);
        const validatedResult = notesSchema.parse(parsedResult);

        return NextResponse.json({ ...validatedResult });
    } catch (error: any) {
        console.error("Create Notes API error:", error);
        try {
            console.log("Attempting to fix JSON format with AI...");

            const fixPrompt = `
            The following text is intended to be a JSON object but it is invalid. 
            Please repair it to be valid JSON. 
            Focus specifically on the "content" field string, ensuring all newlines are escaped correctly (\\n) and double quotes are handled properly.
            
            Invalid JSON:
            ${generatedText}
            `;

            const fixResult = await genAI.models.generateContent({
                model: "gemini-2.5-flash",
                config: {
                    responseMimeType: "application/json",
                    systemInstruction: `You are a JSON repair expert. Your task is to take invalid JSON text and output a strictly valid, 
                    parseable JSON object. Ensure the 'content' field is a valid single string with properly escaped characters and double quotes, 
                    without violating the actual contents. Make sure the content field is a valid markdown string.`
                },
                contents: [{ role: 'user', parts: [{ text: fixPrompt }] }]
            });

            const fixedText = fixResult.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!fixedText) {
                throw new Error("Failed to generate fixed JSON");
            }

            console.log("Fixed JSON:", fixedText);
            const parsedFixed = JSON.parse(fixedText);
            const validatedFixed = notesSchema.parse(parsedFixed);
            return NextResponse.json({ ...validatedFixed });

        } catch (recoveryError: any) {
            console.error("Recovery failed:", recoveryError);
            return NextResponse.json({ error: "Failed to generate valid notes after recovery attempt." }, { status: 500 });
        }
    }
}
