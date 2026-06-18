import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

// Initialize OpenAI only if key is available to avoid startup crashes in demo mode
export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export const hasApiKey = !!apiKey;
