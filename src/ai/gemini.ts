import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateAIResponse(prompt: string, context: string): Promise<string> {
  if (!apiKey) {
    return 'Please set VITE_GEMINI_API_KEY in your .env file to enable AI features. You can get an API key from https://aistudio.google.com/apikey';
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemPrompt = `You are an AI analytics assistant for the UPYOG Property Tax Platform. You analyze property tax data across Indian cities. Answer factually based ONLY on the provided data context. Be professional, concise, and insightful. Format responses with markdown for readability. Use ₹ for currency. Never hallucinate data not present in the context.\n\nDATA CONTEXT:\n${context}\n\nUSER QUESTION: ${prompt}`;
    
    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    if (error?.message?.includes('API_KEY')) {
      return 'Invalid API key. Please check your VITE_GEMINI_API_KEY.';
    }
    return `AI service temporarily unavailable. Error: ${error?.message || 'Unknown error'}`;
  }
}
