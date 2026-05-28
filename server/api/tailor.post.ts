import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { profileId, jobTitle, company, jobDescription, geminiApiKey, options } = body;

    if (!profileId || !jobTitle || !company || !jobDescription) {
      throw createError({
        statusCode: 400,
        statusMessage: 'profileId, jobTitle, company, and jobDescription are required',
      });
    }

    // Get the base CV profile
    const profile = await prisma.cvProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'CV profile not found',
      });
    }

    // Resolve API key: either provided in request, or in environment variables
    const apiKey = geminiApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Gemini API Key is missing. Please provide it in settings or your .env file.',
      });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
You are an expert executive resume writer and career coach. Your task is to tailor a job applicant's base CV to align perfectly with a target job description while maintaining complete factual honesty.

Target Job Information:
- Job Title: ${jobTitle}
- Company: ${company}

Base CV (Markdown):
\`\`\`markdown
${profile.content}
\`\`\`

Target Job Description:
\`\`\`text
${jobDescription}
\`\`\`

Instructions for Tailoring:
1. **Fact Fidelity**: DO NOT invent any new jobs, degrees, certifications, skills, or achievements that are not explicitly stated or implied by the original CV. Keep all dates, company names, and credentials exactly as they are in the original.
2. **Keyword Optimization**: Identify critical skills, technologies, and action verbs from the Job Description and seamlessly integrate them into the CV (especially in the summary and experience bullet points) where the applicant's existing experience supports it.
3. **Professional Summary**: Rewrite the professional summary at the top to highlight the specific experience and passion that directly matches the target job.
4. **Experience Bullets**: Rephrase, reorder, or emphasize the achievements in the applicant's experience to showcase impact relative to the job requirements. Use the CAR (Context, Action, Result) or STAR method. Focus on quantifiable metrics where possible.
5. **Formatting**: Output the tailored CV using clean, professional Markdown. Use standard headings (e.g. # Summary, # Experience, # Skills, # Education).
6. **Custom Directives**: ${options?.customDirectives || 'None specified.'}

You must return your response in the following JSON format:
{
  "tailoredContent": "A string containing the fully tailored CV in professional Markdown format.",
  "aiAnalysis": {
    "matchedSkills": ["A list of top key skills from the job description that were successfully matched and highlighted in the tailored CV."],
    "keywordsHighlighted": ["A list of important keywords/phrases from the job description that were integrated."],
    "adjustmentsMade": ["A list of specific modifications made to the CV (e.g. 'Rewrote summary to focus on cloud migration', 'Emphasized React Native experience')."]
  }
}
`;

    console.log("Calling Gemini API...");
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    console.log("Gemini API response received.");

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", textResponse);
      throw createError({
        statusCode: 500,
        statusMessage: 'AI returned an invalid JSON response structure. Please try again.',
      });
    }

    const { tailoredContent, aiAnalysis } = parsedResponse;

    if (!tailoredContent) {
      throw createError({
        statusCode: 500,
        statusMessage: 'AI failed to generate CV content.',
      });
    }

    // Save the tailored CV to the database
    const savedTailoredCv = await prisma.tailoredCv.create({
      data: {
        profileId,
        jobTitle,
        company,
        jobDescription,
        originalContent: profile.content,
        tailoredContent,
        aiAnalysis: JSON.stringify(aiAnalysis || {}),
      },
    });

    return savedTailoredCv;
  } catch (error: any) {
    console.error("Tailor API Error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'An error occurred during AI tailoring.',
    });
  }
});
