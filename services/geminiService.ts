
import { GoogleGenAI } from "@google/genai";
import { PRODUCT_CONTEXT } from "../constants";

// Inicialização Segura: Verifica se a chave existe antes de tentar criar a instância
// Isso previne que o site trave (Tela Preta) se a variável de ambiente não estiver definida.
const apiKey = process.env.API_KEY;
let ai: any = null;

if (apiKey && apiKey !== 'undefined' && apiKey !== '') {
    try {
        ai = new GoogleGenAI({ apiKey: apiKey });
    } catch (error) {
        console.error("Erro ao inicializar Gemini AI (Chave inválida?):", error);
    }
}

export const getStylingAdvice = async (userQuery: string): Promise<string> => {
  // Se a IA não foi inicializada (sem chave), retorna mensagem amigável sem quebrar o app
  if (!ai) {
      console.warn("Tentativa de uso da IA sem API KEY configurada.");
      return "O estilista virtual está em manutenção no momento (Configuração de API pendente). Por favor, navegue pelas categorias!";
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

    return response.text || "Desculpe, estou tendo um bloqueio criativo agora. Tente novamente!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao consultar nosso estilista virtual. Verifique sua conexão.";
  }
};
