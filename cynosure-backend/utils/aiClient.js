// cynosure-backend/utils/aiClient.js
// Purpose:
// - Communicate with external AI (Perplexity / Gemini-like APIs)
// - Generate SAFE, REALISTIC career guidance for Indian students (Classes 10–12)
// - Explicitly BLOCK gambling, betting, speculative trading careers

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/* -------------------------------------------------- */
/* Axios Client Setup */
/* -------------------------------------------------- */

const aiApi = axios.create({
  baseURL: process.env.AI_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/* -------------------------------------------------- */
/* Utility: Strong JSON Extractor */
/* -------------------------------------------------- */

const extractJSON = (text) => {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Empty AI response');
    }

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error('Invalid JSON structure');
    }

    const jsonString = text.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON Parsing Failed');
    console.error('Raw AI Output:', text);
    throw new Error('AI failed to return valid structured career data.');
  }
};

/* -------------------------------------------------- */
/* AI ANALYSIS: Quiz + Resume → Structured Career JSON */
/* -------------------------------------------------- */

export const getAIAnalysis = async (quizAnswers, resumeText, hasResume) => {
  const safeQuizAnswers = JSON.stringify(quizAnswers || {});
  const safeResumeText = (resumeText || '').toString().substring(0, 4000);

  const prompt = `
You are a senior, ethical career counselor for Indian students studying in classes 10 to 12.

Your responsibility is to suggest REAL, SAFE, and LONG-TERM career paths that exist in the real world
and are suitable for a school student’s academic journey.

ABSOLUTE RULES (NON-NEGOTIABLE):

- Use very simple English.
- Be realistic and honest.
- Never promise quick money or shortcuts.
- Never invent marks, skills, or achievements.
- NEVER suggest or promote gambling, betting, speculative trading, or luck-based careers.

STRICTLY FORBIDDEN CAREERS (DO NOT MENTION AT ALL):
- Trader / Day Trader / Crypto Trader
- Stock Market Gambling
- Betting / Casino / Gambling
- High-risk speculation-based professions
- “Quick money” finance roles

ALLOWED CAREER DOMAINS (EXAMPLES, NOT LIMITS):

• Engineering: Computer, Civil, Mechanical, Electrical, Electronics
• Medicine & Healthcare: Doctor, Nurse, Pharmacist, Physiotherapist
• Defence & Services: Army, Navy, Air Force, Police, IPS
• Government & Civil Services: IAS, IPS, State Services
• Science & Research: Scientist, Research Assistant
• Commerce & Finance (REGULATED ONLY):
  Chartered Accountant (CA), Company Secretary (CS),
  Cost Accountant (CMA), Banker, Finance Analyst (NOT trader)
• Law: Lawyer, Legal Advisor, Judiciary (long-term)
• Education: Teacher, Professor, Academic Trainer
• Design & Media: Graphic Design, UI/UX, Animation, Journalism
• Business & Entrepreneurship: Startup founder, MSME owner, shop/business
• Other Stable Fields: Architecture, Psychology, HR, Marketing, Operations

INPUT DATA

1. QUIZ ANSWERS (interests, subjects, thinking style, preferences):
${safeQuizAnswers}

2. RESUME TEXT:
${hasResume ? safeResumeText : 'No resume provided yet.'}

ANALYSIS RULES

- Every career MUST be connected to quiz answers.
- Clearly think in school-to-college path:
  • Stream after 10th (Science / Commerce / Arts)
  • Degree / diploma / certification after 12th
- Avoid foreign or unrealistic paths unless clearly justified.
- Exactly THREE career options only.

OUTPUT FORMAT
Return ONLY a valid JSON object. No markdown. No commentary.

REQUIRED JSON STRUCTURE:

{
  "personalityTraits": [
    { "trait": "Logical Thinking", "score": 0 },
    { "trait": "Creativity", "score": 0 },
    { "trait": "People Skills", "score": 0 },
    { "trait": "Planning Ability", "score": 0 },
    { "trait": "Discipline & Consistency", "score": 0 }
  ],
  "recommendedCareers": [
    {
      "title": "Real-world career name",
      "matchScore": 0,
      "description": "2–3 simple sentences explaining why this career fits the student.",
      "recommended_skills": ["Skill 1", "Skill 2", "Skill 3"],
      "nextSteps": [
        "Action the student can take now",
        "Next clear step",
        "One habit or practice to build"
      ]
    }
  ],
  "resumeFeedback": [
    "If resume exists: how to improve it",
    "If not: how to start a basic student resume"
  ],
  "actionItems": [
    "3–5 actions for the next 3–6 months"
  ],
  "personalizedMessage": "Warm, calm, and realistic message directly addressed to the student."
}

FINAL CHECK:
If ANY forbidden career appears → you have failed.
`;

  try {
    const response = await aiApi.post('', {
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content:
            'You are a strict JSON-only generator and a responsible career counselor for school students.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.25,
    });

    const content = response.data?.choices?.[0]?.message?.content;
    return extractJSON(content);
  } catch (error) {
    console.error('AI Analysis Error:', error.response?.data || error.message);
    throw new Error(
      'Career analysis service is currently unavailable. Please try again later.',
    );
  }
};

/* -------------------------------------------------- */
/* AI CHAT: Conversational Career Guidance */
/* -------------------------------------------------- */

export const getAIChatResponse = async (messages, resumeText, quizContext) => {
  const systemPrompt = `
You are Cynosure, a calm, ethical career guide for Indian students in classes 10 to 12.

You help students understand careers clearly and responsibly.
You NEVER suggest gambling, betting, trading, or speculative careers.

AVAILABLE CONTEXT

Resume / Background:
"${(resumeText || '').substring(0, 1500)}"

Quiz Profile:
"${(quizContext || '').substring(0, 500)}"

RULES

- Simple English only.
- Practical, step-by-step guidance.
- Mention streams after 10th when relevant.
- Mention education path after 12th.
- Never invent student details.
- If information is missing, say so clearly.

FORBIDDEN:
Trader, Crypto, Betting, Gambling, Quick-money careers.

STRUCTURE

1. Short friendly opening
2. Student interests (from context)
3. Up to 3 safe career options
4. Education path
5. Practical next steps
6. Calm, realistic closing

Use at most 2–3 light emojis.
You are a guide, not a motivator.
`;

  const rawMessages = messages
    .map((msg) => ({
      role: msg.sender === 'bot' ? 'assistant' : 'user',
      content: msg.text,
    }))
    .filter((msg) => msg.content && msg.content.trim() !== '');

  while (rawMessages.length && rawMessages[0].role === 'assistant') {
    rawMessages.shift();
  }

  const sanitizedMessages = [];
  for (const msg of rawMessages) {
    const last = sanitizedMessages[sanitizedMessages.length - 1];
    if (last && last.role === msg.role) {
      last.content += '\n\n' + msg.content;
    } else {
      sanitizedMessages.push({ ...msg });
    }
  }

  try {
    const response = await aiApi.post('', {
      model: 'sonar',
      messages: [{ role: 'system', content: systemPrompt }, ...sanitizedMessages],
      temperature: 0.6,
    });

    return response.data?.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('AI Chat Error:', error.response?.data || error.message);
    return 'I am having trouble responding right now. Please try again shortly.';
  }
};
