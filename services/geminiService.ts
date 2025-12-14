
import { GoogleGenAI } from "@google/genai";
import { PRODUCT_CONTEXT } from "../constants";

// Obtém a chave da variável de ambiente injetada pelo Vite
// Se não houver chave, a variável será uma string vazia ou undefined
const apiKey = process.env.API_KEY;

let ai: any = null;

// Inicialização condicional: Só cria a instância se houver uma chave válida
if (apiKey && apiKey.length > 10 && apiKey !== 'undefined') {
    try {
        ai = new GoogleGenAI({ apiKey: apiKey });
    } catch (error) {
        console.warn("Gemini AI: Falha na inicialização silenciosa.", error);
    }
} else {
    console.log("Gemini AI: Modo offline (Sem API Key).");
}

export const getStylingAdvice = async (userQuery: string): Promise<string> => {
  // Fallback imediato se a IA não estiver ativa
  if (!ai) {
      return "O estilista virtual está offline no momento. Por favor, navegue pelas categorias para ver nossas novidades!";
  }

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

    return response.text || "Não consegui formular uma dica agora. Tente novamente!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro de conexão com o estilista. Tente novamente mais tarde.";
  }
};
