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
You are a world-class resume strategist who has placed hundreds of candidates into top roles. Your writing is indistinguishable from a real human professional — direct, confident, and free of any AI fingerprint.

Your task: rewrite this candidate's resume so it reads like they sat down and carefully tailored it themselves for this exact role. The result should feel personal, grounded, and impossible to flag as AI-generated.

---

TARGET ROLE CONTEXT:
- Position: ${jobTitle}
- Company: ${company}

---

CANDIDATE'S ORIGINAL RESUME (Markdown):
\`\`\`markdown
${profile.content}
\`\`\`

---

JOB DESCRIPTION:
\`\`\`text
${jobDescription}
\`\`\`

---

RESUME REWRITING FRAMEWORK:

Apply these techniques behind the scenes — never reference them in the output.

**1. Achievement Transformation (CAR + PAR Method)**
Rewrite every experience bullet as a micro-story: what the challenge or problem was, what the candidate actually did, and what measurably changed. Do NOT use this structure robotically — vary the format so some bullets lead with the result, some with the action, some with context. The goal is variety, not a template.

**2. Metrics — Only Use What's Real**
DO NOT invent, estimate, or fabricate any numbers, percentages, dollar amounts, or metrics that are not explicitly stated in the original resume. If the original says "improved performance" without a number, keep it qualitative — say "significantly improved" or describe the nature of the improvement without attaching a made-up percentage. The only numbers allowed in the output are numbers that already exist in the candidate's original resume. A bullet without metrics is infinitely better than a bullet with fake metrics — fake numbers are the #1 reason resumes get flagged as AI-generated.

**3. Professional Summary (VSP Approach)**
Write a 2–3 sentence summary that answers: "What value do I bring, what do I specialize in, and what proves it?" No fluff. No "passionate professional" garbage. State the candidate's years of experience, core domain, and one or two defining achievements. Write it in a way that a hiring manager reads it and thinks "this person knows exactly who they are."

**4. Skills Mapping (PIE Framework)**
Identify the high-priority skills from the job description. Map them against the candidate's real experience. Cluster skills into logical groups (e.g., "Frontend", "Backend", "Cloud & DevOps", "Leadership"). Only include skills the candidate actually has evidence of — never pad the list with skills from the JD that aren't in the original resume.

**5. Keyword Integration**
Extract critical ATS keywords from the job description (tools, frameworks, methodologies, certifications, soft skills). Weave them naturally into the summary, experience bullets, and skills section. Never stuff keywords — each mention must feel earned and contextual.

**6. Transferable Skill Bridging (TBS Method)**
If the candidate's background doesn't perfectly match the target role, identify transferable skills and frame existing achievements in language that bridges the gap. For example, if applying for a product role from an engineering background, reframe "built internal dashboard" as "designed and shipped an internal product used by 40+ stakeholders."

**7. Education & Credentials (RPG Framework)**
Highlight relevant coursework, certifications, or projects only if they strengthen the application. Don't over-inflate academic credentials. If the candidate has strong work experience, keep education brief.

---

ANTI-AI DETECTION RULES (NON-NEGOTIABLE):

These rules exist to make the resume feel human-written. Violating any of them is a failure.

1. **BANNED WORDS** — Never use these words under any circumstances:
   spearhead, leverage, utilize, orchestrate, harness, synergize, delve, tapestry, testament, seamless, robust, transformative, innovative, cutting-edge, groundbreaking, unprecedented, passionate, result-oriented, mission-critical, best-in-class, thought leader, paradigm, holistic, ecosystem, empower, elevate, drive (as in "drive results"), champion (as a verb), foster, cultivate, navigate (metaphorically), landscape, realm, deep dive, streamline (overused — use "simplified" or "reduced" instead), comprehensive

2. **USE REAL VERBS** — Write like a human engineer/manager/designer would actually talk:
   built, wrote, designed, ran, led, managed, set up, created, fixed, rewrote, reworked, moved, shipped, launched, maintained, automated, migrated, refactored, debugged, tested, documented, reviewed, hired, trained, cut, reduced, grew, doubled, improved, simplified, removed, replaced, integrated, deployed, configured, monitored, scaled

3. **VARY BULLET STRUCTURE** — Do NOT start every bullet with "[Verb] [object] resulting in [metric]." Mix it up:
   - Some should tell a brief story: "The checkout flow had a high drop-off rate — redesigned the UX and brought it down significantly."
   - Some should be matter-of-fact: "Owned the entire auth system: OAuth2, SSO, MFA, session management."
   - Some should be short and punchy: "Migrated 3 legacy services from Ruby to Go."
   - Some should describe scope: "Managed end-to-end delivery for the payments platform across 4 engineering squads."

4. **NO FLUFF** — Every word must earn its place. If a bullet doesn't convey a skill, a result, or a concrete responsibility, cut it. Never pad.

5. **DO NOT FABRICATE METRICS** — This is the most important rule. Never generate percentages (30%, 40%, 60%), dollar amounts ($2M, $500K), or specific counts that don't appear in the original resume. If the original bullet has a number, keep it. If it doesn't, leave it out. Hiring managers and recruiters can tell when numbers are made up — round percentages like "30%" and "40%" in every bullet are the clearest sign of an AI-written resume.

6. **NATURAL IMPERFECTION** — Real resumes aren't perfectly polished. It's okay to:
   - Use sentence fragments in bullets (normal for resumes)
   - Use informal-but-professional phrasing ("set up" instead of "established", "ran" instead of "orchestrated")
   - Have bullets of varying length (some 1 line, some 2 lines)
   - Have most bullets WITHOUT any metrics — this is normal and expected

7. **TENSE CONSISTENCY** — Current role in present tense, past roles in past tense. Basic, but important.

---

STRUCTURAL RULES:
- Output clean, professional Markdown
- Section order: # Summary, # Experience, # Education, # Skills
- # Skills must always be the final section
- Keep the same job titles, company names, dates, and degrees from the original — never invent or modify these
- Do NOT add jobs, degrees, certifications, or skills that aren't in the original resume
- ${options?.customDirectives || 'No additional directives.'}

---

Return your response in this exact JSON format:
{
  "tailoredContent": "The fully rewritten resume in clean Markdown format.",
  "aiAnalysis": {
    "matchedSkills": ["Skills from the JD that were matched and highlighted in the tailored resume"],
    "keywordsHighlighted": ["ATS keywords from the JD that were naturally woven in"],
    "adjustmentsMade": ["Specific changes made, e.g. 'Rewrote summary to emphasize cloud infrastructure experience', 'Added metrics to 4 experience bullets', 'Reordered skills to prioritize JD requirements'"]
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
