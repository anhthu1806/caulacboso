import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import Swal from 'sweetalert2';
import { MODELS, setSelectedModel, getSelectedModel } from '../services/gemini';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { apiKey, setApiKey } = useApp();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleApiKeySave = () => {
    Swal.fire({
      title: 'Cài đặt API Key',
      html: `
        <div class="mb-4 text-sm font-bold text-red-600">Lấy API key để sử dụng app</div>
        <input type="password" id="swal-input1" class="swal2-input" placeholder="Nhập Gemini API Key" value="${apiKey || ''}">
        <label class="block mt-4 text-sm font-medium text-slate-700 text-left">Chọn Model AI:</label>
        <select id="swal-input2" class="swal2-input w-full mt-1">
          ${MODELS.map(m => `<option value="${m.id}" ${getSelectedModel() === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
        </select>
        <div class="mt-4 text-sm text-gray-600">
          <a href="https://aistudio.google.com/api-keys" target="_blank" class="text-blue-600 hover:underline">Lấy API Key tại đây</a>
        </div>
      `,
      focusConfirm: false,
      allowOutsideClick: !!apiKey, // Only allow outside click if key already exists
      showCancelButton: !!apiKey,
      confirmButtonText: 'Lưu cài đặt',
      preConfirm: () => {
        const key = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const model = (document.getElementById('swal-input2') as HTMLSelectElement).value;
        if (!key) {
          Swal.showValidationMessage('Vui lòng nhập API Key!');
          return false;
        }
        return { key, model };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setApiKey(result.value?.key || '');
        setSelectedModel(result.value?.model || MODELS[1].id);
        Swal.fire('Đã lưu!', 'Cài đặt của bạn đã được cập nhật.', 'success');
      }
    });
  };

  // Mandatory Modal if no API Key
  React.useEffect(() => {
    if (!apiKey) {
      handleApiKeySave();
    }
  }, [apiKey]);

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: 'fa-home' },
    { path: '/courses', label: 'Khóa học', icon: 'fa-book-open' },
    { path: '/creative-space', label: 'Không gian Sáng tạo', icon: 'fa-wand-magic-sparkles' },
    { path: '/copyright-check', label: 'Kiểm tra Bản quyền', icon: 'fa-shield-halved' },
    { path: '/ethics', label: 'Đạo đức số', icon: 'fa-scale-balanced' },
    { path: '/community', label: 'Cộng đồng', icon: 'fa-users' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              CLB Sáng Tạo
            </h1>
            <p className="text-xs text-slate-500 mt-1">Vươn tới tương lai số</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 italic">
            <button
              onClick={handleApiKeySave}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors group"
            >
              <i className="fa-solid fa-gear w-5 text-center"></i>
              <div className="flex flex-col items-start">
                <span>Cài đặt API</span>
                <span className="text-[10px] text-red-500 font-bold">Lấy API key để sử dụng app</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {!apiKey && (
                <button
                  onClick={handleApiKeySave}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors animate-pulse"
                >
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  Cần nhập API Key
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                HS
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
