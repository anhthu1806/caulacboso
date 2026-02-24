import React, { useState } from 'react';
import { MOCK_SUBJECTS } from '../data/mock';
import { Link } from 'react-router-dom';

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = MOCK_SUBJECTS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Thư viện Khóa học</h2>
          <p className="text-slate-500">Nâng cao kỹ năng số với các bài học được thiết kế riêng cho bạn.</p>
        </div>
        <div className="relative">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group flex flex-col">
            <div className="p-6 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <i className={`fa-solid ${subject.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{subject.name}</h3>
              <p className="text-slate-500 text-sm mb-4">{subject.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <i className="fa-regular fa-file-lines"></i>
                  {subject.lessons.length} bài học
                </span>
                <span className="flex items-center gap-1">
                  <i className="fa-regular fa-clock"></i>
                  ~45 phút
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <Link 
                to={`/courses/${subject.id}`}
                className="block w-full py-2 text-center bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
