import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AlgorithmCard } from './components/AlgorithmCard';
import { Visualizer } from './components/Visualizer';
import { Algorithm } from './types';
import { Search, Binary } from 'lucide-react';

const ALGORITHMS: Algorithm[] = [
  {
    id: 'linear',
    name: 'Tìm kiếm Tuyến tính (Linear Search)',
    description: 'Thuật toán đơn giản nhất, duyệt qua từng phần tử của mảng cho đến khi tìm thấy giá trị cần tìm hoặc hết mảng.',
    icon: 'Search',
    complexity: {
      time: 'O(n)',
      space: 'O(1)'
    }
  },
  {
    id: 'binary',
    name: 'Tìm kiếm Nhị phân (Binary Search)',
    description: 'Thuật toán hiệu quả cho mảng đã sắp xếp. Chia đôi khoảng tìm kiếm sau mỗi bước so sánh.',
    icon: 'Binary',
    complexity: {
      time: 'O(log n)',
      space: 'O(1)'
    }
  }
];

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-3-flash-preview');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    const storedModel = localStorage.getItem('gemini_model');
    if (storedKey) setApiKey(storedKey);
    if (storedModel) setModel(storedModel);

    // Listen for storage changes (e.g. from SettingsModal)
    const handleStorageChange = () => {
      const newKey = localStorage.getItem('gemini_api_key');
      const newModel = localStorage.getItem('gemini_model');
      if (newKey) setApiKey(newKey);
      if (newModel) setModel(newModel);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('settingsChanged', handleStorageChange);
    
    // Initial theme check
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settingsChanged', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!selectedAlgorithm ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-600">
                Khám phá Thuật toán Tìm kiếm
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Mô phỏng trực quan, giải thích chi tiết và học tập tương tác với sự hỗ trợ của AI.
                Chọn một thuật toán để bắt đầu!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ALGORITHMS.map((algo) => (
                <AlgorithmCard 
                  key={algo.id} 
                  algorithm={algo} 
                  onSelect={setSelectedAlgorithm} 
                />
              ))}
            </div>

            {!apiKey && (
              <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl flex items-start gap-4">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full text-yellow-600 dark:text-yellow-400">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                    Cần API Key để sử dụng tính năng AI
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    Để nhận được giải thích chi tiết và hỗ trợ từ AI Tutor, vui lòng nhập Gemini API Key trong phần Cài đặt (biểu tượng bánh răng ở góc trên bên phải).
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Visualizer 
            algorithm={selectedAlgorithm} 
            onBack={() => setSelectedAlgorithm(null)}
            apiKey={apiKey}
            model={model}
          />
        )}
      </main>
    </div>
  );
}

export default App;
