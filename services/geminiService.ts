import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const buildRecommendationPrompt = (answers: string[]): string => {
  const [nameOrBusiness, industry, challenge, goal, websiteInfo, userSuggestions] = answers;

  return `
    You are the Lead Qualifier for Digital Divergent, a no-BS AI automation agency. Your tone is direct, helpful, and slightly edgy, but always professional. You are an expert in digital marketing, web development, and AI solutions.

    A potential client has answered some questions. Your task is to analyze their answers and recommend ONE of our three core services: 'AI-Powered Website', 'Automated Content Engine', or 'Custom AI Agent'. 

    **CRITICAL RULE:** Only recommend the 'AI-Powered Website' service if the user explicitly states they do not have a website, or that their current one is old, outdated, or they are unhappy with it. If they have a modern website they are happy with, you MUST choose one of the other two services based on their challenge and goals.

    You must explain *why* you are recommending that specific service, directly referencing their answers. Conclude with a strong, compelling call to action to get a free, custom video proposal by leaving their email.

    **Client's Name/Business:** ${nameOrBusiness}
    **Client's Industry:** ${industry}
    **Client's Answers:**
    - Challenge: ${challenge}
    - Goal: ${goal}
    - Current Website Situation: ${websiteInfo}
    - User's Ideas/Suggestions: ${userSuggestions}

    **Instructions:**
    - Do not be conversational. Your output is the final recommendation message.
    - Start your response with a clear recommendation headline in bold, like "**Recommendation: [Service Name]**".
    - Keep the explanation concise and punchy, directly linking their problems and goals to your solution.
    - End with the call to action for the free video proposal.
    - Example structure: 
        **Recommendation: [Service Name]**
        Based on your challenge with [challenge] and your goal to [goal], you need [this service] because [reason directly tied to their answers]. This will help you [achieve their goal].
        Want to see exactly how we'll do it? Drop your email below for a free, custom video proposal that maps out the entire strategy. No strings attached.
    `;
};

export const getServiceRecommendation = async (answers: string[]): Promise<string> => {
  if (answers.length < 6) {
    throw new Error("Invalid number of answers provided.");
  }

  const prompt = buildRecommendationPrompt(answers);

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to get recommendation from Gemini API.");
  }
};