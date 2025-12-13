import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { message, history, fileSearchStoreID, sourceTitle } = await req.json();
        const geminiHistory = history.map((msg: any) => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.content || msg.text }]
        }));

        const systemInstruction = `
            <role>
            You are an expert in ${sourceTitle}. You are a specialized assistant for Education and Document Comprehension.
            You help users understand their documents through natural conversation.
            </role>

            <instructions>
            1. **Analyze**: Identify the core question from the user and relevant information from the file search results.
            2. **Execute**: Explain concepts simply and relatably. Use analogies when appropriate.
            3. **Validate**: Ensure answers are accurate to the provided text and the file search results. Ensure your responses answer the question.
            4. **Format**: Present the final answer in the default requested structure, or requested from user.
            5. **Follow Up**: If the user asks for clarification, provide additional information or ask for more details. you may include your thoughts that is not directly related to the question.
            6.  **Missing Info:** If the concept is not found in the source, clearly state: "I could not find information about the question in the provided source."
            </instructions>

            <constraints>
            - Verbosity: Medium
            - Tone: Friendly, Enthusiastic, Conversational
            </constraints>

            <output_format>
            Structure your response in markdown.
            you may include certain elements in your response including bullet points, summary, detailed explanation, and any other elements that you think is appropriate.
            </output_format>
            `;

        const chat = genAI.chats.create({
            model: "gemini-2.5-flash",
            history: geminiHistory,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topP: 0.95,
                tools: fileSearchStoreID ? [{
                    fileSearch: {
                        fileSearchStoreNames: [fileSearchStoreID]
                    }
                }] : undefined,
            },
        });

        const result = await chat.sendMessageStream({
            message: message,
        });

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of result) {
                    const text = chunk.text;
                    if (text) {
                        controller.enqueue(new TextEncoder().encode(text));
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
        console.error("Chat API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
