import { GoogleGenAI } from "@google/genai";

const FALLBACK_MODELS = ['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-2.5-flash'];

export async function callGeminiAI(prompt: string, apiKey: string, preferredModel: string = 'gemini-3-flash-preview'): Promise<string | null> {
  if (!apiKey) {
    throw new Error('Vui lòng nhập API Key!');
  }

  // Try the preferred model first
  try {
    return await generateContent(apiKey, preferredModel, prompt);
  } catch (error: any) {
    console.warn(`Model ${preferredModel} failed, trying fallbacks...`, error);
    
    // Try fallbacks
    for (const model of FALLBACK_MODELS) {
      if (model === preferredModel) continue; // Skip if already tried
      try {
        console.log(`Trying fallback model: ${model}`);
        return await generateContent(apiKey, model, prompt);
      } catch (fallbackError) {
        console.warn(`Fallback model ${model} failed.`, fallbackError);
        continue;
      }
    }
    
    throw new Error(`Lỗi API: Không thể kết nối với bất kỳ model nào. Vui lòng kiểm tra API Key hoặc thử lại sau.`);
  }
}

async function generateContent(apiKey: string, model: string, prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    }
  });
  return response.text || '';
}

export const generateExplanationPrompt = (algorithm: string, array: number[], target: number, stepDescription: string) => {
  return `
    Bạn là một gia sư thuật toán thân thiện và dễ hiểu.
    Hãy giải thích ngắn gọn (dưới 50 từ) về bước hiện tại của thuật toán ${algorithm}.
    
    Dữ liệu hiện tại:
    - Mảng: [${array.join(', ')}]
    - Giá trị cần tìm: ${target}
    - Hành động: ${stepDescription}
    
    Hãy giải thích tại sao thuật toán lại làm như vậy và điều gì sẽ xảy ra tiếp theo. Dùng tiếng Việt tự nhiên.
  `;
};

export const generateQuizPrompt = (algorithm: string) => {
  return `
    Tạo 1 câu hỏi trắc nghiệm (4 đáp án) về thuật toán ${algorithm} bằng tiếng Việt.
    Trả về định dạng JSON thuần túy (không markdown) như sau:
    {
      "question": "Nội dung câu hỏi?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0, // index của đáp án đúng (0-3)
      "explanation": "Giải thích ngắn gọn tại sao đúng."
    }
  `;
};
