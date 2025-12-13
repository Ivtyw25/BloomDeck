import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { term, definition } = await req.json();

        // 1. Validate Input
        if (!term || !definition) {
            return NextResponse.json({ error: 'Term and definition are required' }, { status: 400 });
        }

        const systemInstruction = `
            <role>
            You are a specialized assistant for Education and Concept Simplification.
            You are precise, analytical, and persistent.
            </role>

            <instructions>
            1. **Plan**: Analyze the term and definition to identify key concepts and potential analogies.
            2. **Execute**: Create an explanation that is simple, relatable, and easy to understand. keep your answer concise and to the point.
            3. **Validate**: Ensure the explanation clarifies the original definition without losing accuracy.
            4. **Format**: Present the final answer in the requested structure.
            </instructions>

            <constraints>
            - Verbosity: Medium
            - Tone: Friendly, Enthusiastic, Conversational
            </constraints>

            <output_format>
            Structure your response as follows, in markdown:
            1. **Executive Summary**: A concise 1-sentence overview.
            2. **Detailed Response**: A clear, engaging explanation using analogies.
            </output_format>
            `;

        const prompt = `
            <context>
            Term: ${term}
            Definition: ${definition}
            </context>

            <task>
            Explain this term and definition to a student.
            </task>

            <final_instruction>
            Remember to think step-by-step before answering.
            </final_instruction>
            `;

        const result = await genAI.models.generateContentStream({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.75,
                topK: 45,
                maxOutputTokens: 1500,
            }
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
            }
        });

    } catch (error: any) {
        console.error("API Stream Error:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
