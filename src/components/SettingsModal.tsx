import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, X, Key, Save, Moon, Sun } from 'lucide-react';
import Swal from 'sweetalert2';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-3-flash-preview');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    const storedModel = localStorage.getItem('gemini_model');
    const storedTheme = localStorage.getItem('theme');
    if (storedKey) setApiKey(storedKey);
    if (storedModel) setModel(storedModel);
    if (storedTheme) setTheme(storedTheme);
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      Swal.fire('Lỗi', 'Vui lòng nhập API Key!', 'error');
      return;
    }
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('gemini_model', model);
    localStorage.setItem('theme', theme);
    
    // Apply theme immediately if needed (though usually handled by a context or global effect)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('settingsChanged'));

    Swal.fire({
      title: 'Thành công!',
      text: 'Đã lưu cài đặt.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-500" />
            Cài đặt
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gemini API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Nhập API Key của bạn..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-slate-700 dark:text-white"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              API Key được lưu an toàn trong trình duyệt của bạn.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Mô hình AI (Model)
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
            >
              <option value="gemini-3-flash-preview">Gemini 3 Flash (Nhanh nhất)</option>
              <option value="gemini-3-pro-preview">Gemini 3 Pro (Thông minh nhất)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ổn định)</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Giao diện
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${theme === 'light' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Sun className="w-4 h-4" /> Sáng
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'bg-slate-700 border-blue-500 text-blue-400' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Moon className="w-4 h-4" /> Tối
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Lưu Cài Đặt
          </button>
        </div>
      </div>
    </div>
  );
};
