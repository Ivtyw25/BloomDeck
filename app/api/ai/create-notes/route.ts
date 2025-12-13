import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export async function POST(req: NextRequest) {

    const notesSchema = z.object({
    title: z.string().describe(
        "A short, clear section title summarizing the topic of the notes segment. It must be concise, meaningful, and relevant to the source."
    ),
    content: z.string().describe(
        "Markdown-formatted study notes for this section. Use bullet points, short lines, and structured formatting such as bold, italics, and headings. Content must be concise and directly based on the source."
    )
    });
    
    try {
        const { fileSearchStoreID } = await req.json();

        if (!fileSearchStoreID) {
            return NextResponse.json({ error: "fileSearchStoreID is required" }, { status: 400 });
        }

        const systemInstruction = `
        <role>
            You are an AI specialized in reading, understanding, and summarizing documents into structured study guides. 
            Your purpose is to extract the essential ideas, main concepts, and key takeaways from the provided files and rewrite 
            them into clear, concise Markdown-formatted notes that help users grasp the content quickly.
        <role>

        <instructions>
            1. Read and deeply understand the content provided in the file(s).
            2. Identify the most important concepts, definitions, arguments, examples, and insights.
            3. Rewrite the content into a structured study guide using Markdown formatting, including:
            - bullet points
            - numbered lists (when appropriate)
            - short subheadings
            - bold for key terms
            - italics for emphasis
            4. Prioritize clarity, simplicity, and relevance.
            5. Avoid unnecessary storytelling, long paragraphs, or unrelated details.
            6. Do not add information that is not present in the source.
            7. Maintain the original meaning while simplifying the explanations.
            8. Make sure to cover all the important points from the source.
            9. Output must strictly follow the required JSON structure shown below.
        <instructions>

        <output>
            follow the schema format that has been provided
        <output>
        `;
        
        const prompt = `
            Generate structured study notes with bullet points and key takeaways based on the files from the file search store.
            <context>
                files from the file search store
            </context>

            <final_instruction>
                Remember to think step-by-step before give the final response.
            </final_instruction>
        `;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.5,
                topK: 40,
                topP: 0.85,
                maxOutputTokens: 3000,
                tools: fileSearchStoreID ? [{   
                    fileSearch: {
                        fileSearchStoreNames: [fileSearchStoreID]
                    }
                }] : undefined,
                responseMimeType: "application/json",
                responseJsonSchema: zodToJsonSchema(notesSchema as any),
            },
            contents: prompt
        });

    } catch (error: any) {
        console.error("Create Notes API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
