import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { concept, fileSearchStoreID, sourceTitle, url } = await req.json();

        if (!concept || (!fileSearchStoreID && !url)) {
            return NextResponse.json({ error: "Concept and (fileSearchStoreID or url) are required" }, { status: 400 });
        }

        let systemInstruction = `
            <role>
            You are an expert in ${sourceTitle || 'these documents'}. You are a specialized assistant for Education and Document Comprehension.
            You help users understand their documents or video sources with simple and straight forward explanation.
            </role>

            <instructions>
            1. **Analyze**: Identify the core concept "${concept}" and relevant information from the file search results or video source.
            2. **Execute**: Explain the concept simply and relatably. Use analogies when appropriate.
            3. **Validate**: Ensure answers are accurate to the provided text and the file search results or video source.
            4. **Format**: Present the final answer in the default requested structure (Markdown summary), or requested from user.
            5. **Follow Up**: If the user asks for clarification, provide additional information or ask for more details. you may include your thoughts that is not directly related to the question.
            6.  **Missing Info:** If the concept is not found in the source, clearly state: "I could not find information about '${concept}' in the provided source."
            </instructions>

            <constraints>
            - Verbosity: Medium
            - Tone: Friendly, Enthusiastic
            </constraints>

            <output_format>
            Structure your response in markdown.
            you may include certain elements in your response including bullet points, summary, detailed explanation, and any other elements that you think is appropriate.
            </output_format>
        `;

        if (url) {
            systemInstruction += `
            <youtube_instructions>
            - The provided content is a YouTube video.
            - Explain the concept "${concept}" based on the video content.
            </youtube_instructions>
            `;
        }

        const prompt = `Please summarize the concept: "${concept}"`;

        const userContentParts: any[] = [{ text: prompt }];
        if (url) {
            userContentParts.push({
                fileData: {
                    mimeType: "video/mp4",
                    fileUri: url
                }
            });
        }

        const result = await genAI.models.generateContentStream({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.5, // Lower temperature for more factual summary
                topP: 0.95,
                tools: (fileSearchStoreID && !url) ? [{
                    fileSearch: {
                        fileSearchStoreNames: [fileSearchStoreID]
                    }
                }] : undefined,
            },
            contents: [{ role: 'user', parts: userContentParts }]
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                for await (const chunk of result) {
                    const text = chunk.text;
                    if (text) {
                        controller.enqueue(encoder.encode(text));
                    }
                }
                controller.close();
            }
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });

    } catch (error: any) {
        console.error("Concept Summary API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
