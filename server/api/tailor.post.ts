import { prisma } from '../utils/db';
import { requireSessionUser } from '../utils/auth';
import { getModelForRequest } from '../utils/gemini';

export default defineEventHandler(async (event) => {
  try {
    const user = await requireSessionUser(event);
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

    if (profile.userId !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden. You do not own this CV profile.',
      });
    }

    // Resolve API key and initialize Gemini API model
    const model = getModelForRequest(geminiApiKey);

    const prompt = `
You are an expert executive resume writer. Your task is to tailor a job applicant's base CV to align with a target job description while maintaining complete factual honesty and writing in a natural, authentic, human-like voice.

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

Style Guidelines (CRITICAL for a natural, non-AI feel):
1. **Avoid AI Buzzwords & Cliches**: Do NOT use overused AI vocabulary. Strictly ban words like: "spearhead", "leverage", "utilize", "orchestrate", "harness", "synergize", "delve", "testament", "tapestry", "seamless", "robust", "transformative", "innovative", "passionate-driven", "result-oriented".
2. **Use Simple, Direct Verbs**: Write in a plain, confident tone. Use strong, direct action verbs instead of flowery jargon. For example, use "built", "designed", "created", "led", "managed", "rewrote", "optimized", "reduced", "scaled".
3. **Natural Professional Tone**: The tone must sound like a seasoned industry professional writing for their peers. Avoid marketing fluff, clinical summaries, or over-the-top enthusiasm (e.g., do not use adjectives like "highly successful", "groundbreaking", or "unprecedented"). Let the technical details and metrics speak for themselves.
4. **Vary Sentence Structure**: Avoid repetitive bullet structures (e.g., starting every bullet with a verb followed by a formulaic "resulting in X%..."). Keep bullet points punchy, direct, and varied.
5. **Brief, Grounded Summary**: The summary at the top should be brief and honest (2-3 sentences max). Describe the candidate's core expertise, background, and focus areas without generic buzzwords.

Instructions for Tailoring:
1. **Fact Fidelity**: DO NOT invent any new jobs, degrees, certifications, skills, or achievements that are not explicitly stated or implied by the original CV. Keep all dates, company names, and credentials exactly as they are in the original.
2. **Keyword Optimization**: Identify critical skills and technologies from the Job Description and integrate them naturally into the CV (especially in the summary and experience bullet points) where the applicant's existing experience supports it.
3. **Experience Bullets**: Rephrase, reorder, or emphasize the achievements in the applicant's experience to highlight impact relative to the job requirements, focusing on quantifiable metrics where possible.
4. **Formatting & Structure**: Output the tailored CV using clean, professional Markdown with standard headings in the exact following section order: # Summary, # Experience, # Education, and # Skills (with # Skills strictly placed as the final section of the resume).
5. **Custom Directives**: ${options?.customDirectives || 'None specified.'}

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
