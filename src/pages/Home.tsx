import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_SUBJECTS } from '../data/mock';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Home() {
  const { progress } = useApp();

  const stats = [
    { label: 'Khóa học hoàn thành', value: progress.completedLessons.length, icon: 'fa-check-circle', color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Ngày liên tiếp', value: progress.streakDays, icon: 'fa-fire', color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Thời gian học (phút)', value: progress.totalTimeSpent, icon: 'fa-clock', color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const chartData = [
    { name: 'Đã hoàn thành', value: progress.completedLessons.length },
    { name: 'Chưa hoàn thành', value: 10 - progress.completedLessons.length }, // Assuming 10 total for demo
  ];
  const COLORS = ['#10b981', '#e2e8f0'];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Xin chào, Học sinh! 👋</h2>
          <p className="text-blue-100 max-w-xl">
            Chào mừng bạn đến với CLB Sáng Tạo Số. Hãy bắt đầu hành trình khám phá AI và sáng tạo nội dung an toàn ngay hôm nay.
          </p>
          <Link to="/courses" className="inline-block mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition-colors">
            Bắt đầu học ngay
          </Link>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <i className="fa-solid fa-robot text-9xl"></i>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.bg} ${stat.color}`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Subjects */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-blue-500"></i>
            Chủ đề nổi bật
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_SUBJECTS.map((subject) => (
              <Link key={subject.id} to={`/courses/${subject.id}`} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${subject.icon}`}></i>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{subject.name}</h4>
                <p className="text-slate-500 text-sm line-clamp-2">{subject.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Tiến độ học tập</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Đã xong
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              Chưa học
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
