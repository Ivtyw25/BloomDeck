import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';
import { z } from "zod";
export async function POST(req: NextRequest) {

    const flashcardSchema = z.object({
        term: z.string().describe("The main text of the flashcard. This can be either: (1) a term extracted from the source, or (2) a question generated from the content. Keep it short, concise, easy to learn, and directly related to the source."),
        definition: z.string().describe("The explanation of the flashcard. This can be either: (1) the definition of the term, or (2) the answer to the question. Keep it short, clear, easy to understand, and directly based on the source."),
    })

    const deckSchema = z.object({
        title: z.string().describe("The title of the flashcard deck, keep the title short, concise, and relatble with the sources"),
        flashcards: z.array(flashcardSchema).min(5).max(40)
    });


    try {
        const { fileSearchStoreID } = await req.json();

        if (!fileSearchStoreID) {
            return NextResponse.json({ error: "fileSearchStoreID is required" }, { status: 400 });
        }

        const systemInstruction = `
        <role>
            You are an AI specialized in understanding the given documents and generating high-quality flashcards based on the content.
            Your purpose is to extract the most important concepts and convert them into concise, accurate study flashcards.
        </role>

        <constraints>
            1. Output strictly valid JSON only. 
            2. Do NOT use markdown formatting (no \`\`\`json blocks). 
            3. Do NOT include any introductory or concluding text. 
            4. The output must be parseable by JSON.parse() directly.
            5. You must generate at least 5 and at most 40 flashcards.
            6. Do NOT include qustion marks in terms (e.g. What is, How does, Why is)
            7. Do cover all the important concepts from the source, Do NOT miss any.
            8. ALL information used to generate the title, terms, and definitions **MUST** come from the retrieved document chunks. 
        </constraints>

        <instructions>
            1. Read and understand the provided file(s) deeply.
            2. Identify key concepts, terms, definitions, facts, processes, formulas, or important notes.
            3. Summarize each concept into clear flashcard pairs.
            4. For each flashcard, use the following keys:
            - "term": The main concept OR a study question. (should be concise)
            - "definition": The explanation of the term OR the answer to the question. (should be understanable)
            5. Avoid adding information not found in the file.
            6. Avoid unnecessary words that lengthen the terms or answers.
            7. Keep answers short, concise, and easy for studying.
            8. Output must follow the exact JSON format shown below.
        </instructions>

        <output_format>
            {
                "title": "Topic Title",
                "flashcards": [
                    { "term": "Concept", "definition": "Explanation" }
                ]
            }
        </output_format>
        `;

        const prompt = `
            Generate a complete flashcard deck containing a title and an array of flashcards between 5 and 40 items.
            only output the JSON
        `;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.59,
                topP: 0.8,
                tools: fileSearchStoreID ? [{
                    fileSearch: {
                        fileSearchStoreNames: [fileSearchStoreID]
                    }
                }] : undefined,
            },
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        let generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!generatedText) {
            throw new Error("No content generated");
        }

        // Clean up code blocks if the model ignores the "no markdown" rule
        generatedText = generatedText.replace(/```json\n?|\n?```/g, "").trim();

        console.log("\nRaw Result:", generatedText);
        const parsedResult = JSON.parse(generatedText);
        const validatedResult = deckSchema.parse(parsedResult);
        const normalizedFlashcards = validatedResult.flashcards.map((card) => ({
            term: card.term,
            definition: card.definition
        }));

        return NextResponse.json({ ...validatedResult, flashcards: normalizedFlashcards });

    } catch (error: any) {
        console.error("Generate Decks API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}   