import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { term, definition } = await req.json();

        // 1. Validate Input
        if (!term || !definition) {
            return NextResponse.json({ error: 'Term and definition are required' }, { status: 400 });
        }

        const systemInstruction = "You are a friendly, enthusiastic teacher explaining concepts to a student. Your goal is to make complex ideas simple, relatable, and easy to understand. Use analogies, everyday examples, and a conversational tone. Avoid jargon where possible, or explain it simply if necessary. Keep the explanation concise but engaging. Keep your responses concise and to the point.";
        const prompt = `Explain the following concept:\n\nTerm: ${term}\nDefinition: ${definition}`;

        const result = await genAI.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.65,
                topK: 35,
                maxOutputTokens: 1500,
            }
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    const streamSource = result;
                    // @ts-ignore
                    for await (const chunk of streamSource) {
                        let text = '';
                        const c = chunk as any;
                        if (c.candidates?.[0]?.content?.parts?.[0]?.text) {
                            text = c.candidates[0].content.parts[0].text;
                        }
                        else if (typeof c.text === 'function') {
                            text = c.text();
                        }
                        else if (c.text) {
                            text = c.text;
                        }
                        if (text) {
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
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
