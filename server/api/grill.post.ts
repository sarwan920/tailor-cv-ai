import { GoogleGenerativeAI } from '@google/generative-ai';
import { requireSessionUser } from '../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    // 1. Require authentic session user
    await requireSessionUser(event);

    const body = await readBody(event);
    const { bulletPoint, question, userResponse, geminiApiKey } = body;

    if (!bulletPoint) {
      throw createError({
        statusCode: 400,
        statusMessage: 'bulletPoint is required',
      });
    }

    // 2. Resolve Gemini API key
    const apiKey = geminiApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Gemini API Key is missing. Please configure it in Settings or your .env file.',
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    // 3. Check if we need to generate a question, or evaluate a response
    if (!userResponse) {
      // Question generation mode
      const prompt = `
You are an expert technical interviewer and executive recruiter.
Generate one tough, realistic, and probing interview question that a hiring manager would ask a candidate to verify and drill down on this specific resume bullet point:
"${bulletPoint}"

Your question should force the candidate to explain their specific technical actions, metrics justification, architecture, or individual contribution. Do not be overly warm; sound like a professional interviewer.

You must return your response in the following JSON format:
{
  "question": "The tough, realistic interview question"
}
`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text();
      return JSON.parse(textResponse);
    } else {
      // Evaluation / Grading mode
      const prompt = `
You are an expert technical interviewer and executive recruiter. A candidate is presenting a resume bullet point from their CV and has provided a verbal response defending it.

Resume Bullet Point:
"${bulletPoint}"

Interviewer Question:
"${question || 'Explain your contribution and the metrics in this bullet point.'}"

Candidate Response:
"${userResponse}"

Evaluate the candidate's response. Be constructive, professional, and slightly tough. Grade their response based on credibility, specificity, and authenticity.

You must return your response in the following JSON format:
{
  "score": number (1 to 10 scale of interview readiness),
  "strengths": "Detailed summary of what the candidate answered well (e.g. named specific tools, explained context)",
  "weaknesses": "Summary of weak points, buzzwords, or red flags where they lacked depth or sounded evasive",
  "suggestedAnswer": "A highly polished, natural, authentic rephrase of how they should verbally answer this question in a real interview (written in first person 'I...')"
}
`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text();
      return JSON.parse(textResponse);
    }
  } catch (error: any) {
    console.error("Grill API Error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'An error occurred during interview grilling.',
    });
  }
});
