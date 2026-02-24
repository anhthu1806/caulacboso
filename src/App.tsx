import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CreativeSpace from './pages/CreativeSpace';
import CopyrightCheck from './pages/CopyrightCheck';

// Placeholder components for routes not yet fully implemented
const Ethics = () => <div className="p-8 text-center text-slate-500">Tính năng Đạo đức số đang phát triển...</div>;
const Community = () => <div className="p-8 text-center text-slate-500">Tính năng Cộng đồng đang phát triển...</div>;

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/creative-space" element={<CreativeSpace />} />
            <Route path="/copyright-check" element={<CopyrightCheck />} />
            <Route path="/ethics" element={<Navigate to="/courses/copyright" replace />} />
            <Route path="/community" element={<Community />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}
