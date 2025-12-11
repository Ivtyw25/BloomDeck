import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    throw new Error('Missing GOOGLE_API_KEY environment variable. Please add it to your .env.local file.');
}

export const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY});
