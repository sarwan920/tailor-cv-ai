import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Resolves the Gemini API key from settings (request body) or environment variables.
 * Throws a 400 bad request error if the key is missing.
 */
export function resolveGeminiApiKey(requestBodyApiKey?: string): string {
  const apiKey = requestBodyApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Gemini API Key is missing. Please configure it in Settings or your .env file.',
    });
  }
  return apiKey;
}

/**
 * Helper to instantiate and configure the standard Gemini model instance.
 * Centralizes the model and response type configuration.
 */
export function getGeminiModel(apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'gemini-3.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
}

/**
 * Resolves the API key and returns the configured Gemini model in one step.
 */
export function getModelForRequest(requestBodyApiKey?: string) {
  const apiKey = resolveGeminiApiKey(requestBodyApiKey);
  return getGeminiModel(apiKey);
}
