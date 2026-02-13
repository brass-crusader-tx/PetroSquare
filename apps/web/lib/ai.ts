import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.AI_API_KEY;

// Use requested models as defaults if env vars are not set
const TARGET_MODEL = process.env.AI_MODEL || "gemini-2.5-pro";
const FALLBACK_MODEL = process.env.AI_MODEL_FALLBACK || "gemini-2.5-flash";

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

function sanitizeOutput(text: string): string {
  if (!text) return "";
  // Remove bold markdown (** or __)
  let clean = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/__(.*?)__/g, '$1');
  // Remove italic markdown (* or _) - Be careful not to remove single * as bullet
  // Only remove * if it wraps text: *text*
  clean = clean.replace(/([^*])\*([^*]+)\*([^*])/g, '$1$2$3');

  // Remove headers
  clean = clean.replace(/^#+\s*/gm, '');

  // Remove placeholders
  clean = clean.replace(/US_STATE/g, 'Region');
  clean = clean.replace(/\[.*?\]/g, '');

  return clean.trim();
}

export async function generateInsight(prompt: string, context?: string): Promise<string> {
  if (!genAI) {
    return "AI insights unavailable (API Key missing).";
  }

  const finalPrompt = context ? `Context:\n${context}\n\nTask:\n${prompt}` : prompt;

  try {
    const model = genAI.getGenerativeModel({ model: TARGET_MODEL });
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    return sanitizeOutput(response.text());
  } catch (error) {
    console.warn(`Primary model ${TARGET_MODEL} failed. Switching to fallback ${FALLBACK_MODEL}.`);
    try {
      // Fallback logic
      const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
      const result = await fallbackModel.generateContent(finalPrompt);
      const response = await result.response;
      return sanitizeOutput(response.text());
    } catch (fallbackError) {
      console.error("AI Generation failed.", fallbackError);
      return "Unable to generate insights at this time.";
    }
  }
}

export const isAIEnabled = !!API_KEY;
