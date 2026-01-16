import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Mock service if no API key is present to prevent crash in demo
const mockGenerateInsight = async (topic: string, userTrait: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`[IA Coach] Notei que você tem mostrado traços fortes de ${userTrait} no ${topic}. Lembre-se: "A verdadeira força vem do equilíbrio." Continue explorando!`);
    }, 1500);
  });
};

export const generateMicroInsight = async (topic: string, userTrait: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key not found, using mock insight.");
    return mockGenerateInsight(topic, userTrait);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a wise, mystical, yet pragmatic guide in a gamified self-discovery app called "Espelhar.me". 
      The user is currently exploring the "${topic}".
      Based on their recent answers, they seem to exhibit the trait: "${userTrait}".
      
      Generate a "Micro-Insight" (max 30 words). It should be intriguing, encouraging, and personalized. 
      Use a tone that mixes Yu-kai Chou's gamification enthusiasm with Daniel Cook's system design wisdom.
      Do not be generic. Make them feel seen.`,
    });

    return response.text || "A névoa encobre o futuro, mas seus passos revelam seu caminho.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return mockGenerateInsight(topic, userTrait);
  }
};