import { GoogleGenAI } from "@google/genai";
import Swal from 'sweetalert2';

// Define available models in priority order for fallback
export const MODELS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Dự phòng 1)' },
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Mặc định)' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Dự phòng 2)' },
];

export interface AIResponse {
  text: string;
  error?: string;
}

export const getGeminiApiKey = (): string | null => {
  return localStorage.getItem('gemini_api_key');
};

export const setGeminiApiKey = (key: string) => {
  localStorage.setItem('gemini_api_key', key);
};

export const getSelectedModel = (): string => {
  return localStorage.getItem('gemini_model') || MODELS[1].id; // Default to Gemini 2.0 Flash
};

export const setSelectedModel = (modelId: string) => {
  localStorage.setItem('gemini_model', modelId);
};

// Fallback logic implementation
export async function callGeminiAI(prompt: string, attemptIndex = 0): Promise<string | null> {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    Swal.fire({
      icon: 'warning',
      title: 'Thiếu API Key',
      text: 'Vui lòng nhập Gemini API Key trong phần Cài đặt để sử dụng tính năng AI.',
      confirmButtonText: 'Đã hiểu'
    });
    return null;
  }

  // Construct the list of models to try in order: 
  // 1. User selected model
  // 2. Fallback models (the rest of the list in order)
  const userSelectedId = getSelectedModel();
  const candidateModels = [
    userSelectedId,
    ...MODELS.map(m => m.id).filter(id => id !== userSelectedId)
  ];

  // If we've run out of models to try
  if (attemptIndex >= candidateModels.length) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi AI',
      text: 'Tất cả các model đều không phản hồi (Đã thử hết danh sách fallback). Vui lòng kiểm tra API key hoặc thử lại sau.',
    });
    return "Đã dừng do lỗi: Cạn kiệt model fallback (RESOURCE_EXHAUSTED or API Error)";
  }

  const currentModelId = candidateModels[attemptIndex];

  try {
    const ai = new GoogleGenAI(apiKey);
    const model = ai.getGenerativeModel({ model: currentModelId });
    
    // Using the official SDK generateContent call
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || '';
  } catch (error: any) {
    console.error(`Error calling model ${currentModelId}:`, error);

    // Check for specific errors that warrant a retry (429, 503, 500, etc.)
    const errorMsg = error.message || "";
    const isRetryable = errorMsg.includes('429') || 
                        errorMsg.includes('503') || 
                        errorMsg.includes('500') ||
                        errorMsg.includes('fetch failed') ||
                        errorMsg.includes('deadline exceeded');

    if (isRetryable && attemptIndex < candidateModels.length - 1) {
      console.log(`Model ${currentModelId} failed with retryable error. Retrying with next model...`);
      return callGeminiAI(prompt, attemptIndex + 1);
    }

    // If it's a non-retryable error (e.g. invalid key 400), or we've exhausted retries, show error
    Swal.fire({
      icon: 'error',
      title: 'Lỗi AI',
      text: `Lỗi kết nối với ${currentModelId}: ${error.message}`,
    });
    return `Đã dừng do lỗi tại ${currentModelId}: ${error.message}`;
  }
}
