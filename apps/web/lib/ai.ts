import { GoogleGenerativeAI } from '@google/generative-ai';

const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gemini-2.5-pro';
const AI_MODEL_FALLBACK = process.env.AI_MODEL_FALLBACK || 'gemini-2.0-flash';

// Helper to sanitize markdown (basic)
function sanitize(text: string): string {
    return text.replace(/```markdown/g, '').replace(/```/g, '').trim();
}

/**
 * Generates an AI insight/summary based on the provided prompt.
 * Returns null if AI is not configured or generation fails.
 */
export async function generateInsight(prompt: string, systemInstruction?: string): Promise<{ text: string; model: string } | null> {
    if (!AI_API_KEY) {
        console.warn("AI_API_KEY is missing. Skipping AI generation.");
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(AI_API_KEY);

        // Try primary model
        try {
            const model = genAI.getGenerativeModel({ model: AI_MODEL });
            const result = await model.generateContent(
                systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt
            );
            const response = await result.response;
            return { text: sanitize(response.text()), model: AI_MODEL };
        } catch (primaryError) {
            console.warn(`Primary model ${AI_MODEL} failed, trying fallback ${AI_MODEL_FALLBACK}`, primaryError);

            // Try fallback model
            const fallbackModel = genAI.getGenerativeModel({ model: AI_MODEL_FALLBACK });
             const result = await fallbackModel.generateContent(
                systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt
            );
            const response = await result.response;
            return { text: sanitize(response.text()), model: AI_MODEL_FALLBACK };
        }

    } catch (error) {
        console.error("AI Generation failed:", error);
        return null;
    }
}
