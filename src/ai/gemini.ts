import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateAIResponse(prompt: string, context: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('UPYOG_GEMINI_API_KEY') || '';
  
  if (!apiKey) {
    return 'Cognitive Analytics Assistant is offline. Please enter a valid API access key in the configuration panel below or in the Platform Settings to enable intelligent analytics queries.';
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemPrompt = `You are an expert municipal analytics assistant for the UPYOG Property Tax Platform. You analyze property tax data, compliance rates, municipal registrations, and collections across Indian cities. Answer factually based ONLY on the provided data context. Be professional, concise, and insightful. Format responses with clean markdown tables and bullet points for readability. Use ₹ for currency. Never hallucinate data not present in the context.\n\nDATA CONTEXT:\n${context}\n\nUSER QUESTION: ${prompt}`;
    
    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    if (error?.message?.includes('API_KEY')) {
      return 'Configuration Error: The provided API access key is invalid. Please double-check your key in the Platform Settings or Chat setup panel.';
    }
    return `Assistant Service temporarily unavailable. Details: ${error?.message || 'Unknown network error'}`;
  }
}
