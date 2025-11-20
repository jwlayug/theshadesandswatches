import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const getDesignAdvice = async (userQuery: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: "You are a world-class interior designer specializing in curtains, blinds, and furniture covers (sofa covers, chair covers). Provide brief, elegant, and practical advice on fabric choices, color coordination, and styles. Keep your tone sophisticated and helpful. Limit responses to 3 sentences max.",
      },
    });
    
    return response.text || "I couldn't generate advice at the moment. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our design AI is currently taking a break. Please try again later.";
  }
};