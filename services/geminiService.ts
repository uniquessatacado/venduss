import { GoogleGenAI } from "@google/genai";
import { PRODUCT_CONTEXT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStylingAdvice = async (userQuery: string): Promise<string> => {
  try {
    const systemInstruction = `
      Você é um consultor de estilo de moda especialista e moderno para a loja 'Lumina Fashion'.
      Seu tom é prestativo, curto, moderno e estiloso.
      Use emojis ocasionalmente.
      
      Aqui está a lista de produtos disponíveis na loja:
      ${PRODUCT_CONTEXT}

      Quando o usuário perguntar sobre roupas, ocasiões ou combinações, sugira APENAS produtos desta lista.
      Não invente produtos. Se não houver algo específico, sugira uma alternativa criativa da lista.
      Mantenha a resposta curta (máximo de 3 frases).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Desculpe, estou tendo um bloqueio criativo agora. Tente novamente!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao consultar nosso estilista virtual. Verifique sua conexão.";
  }
};