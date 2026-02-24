import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_SUBJECTS, Lesson } from '../data/mock';
import ReactMarkdown from 'react-markdown';
import { useApp } from '../context/AppContext';
import Swal from 'sweetalert2';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { progress, updateProgress } = useApp();
  const subject = MOCK_SUBJECTS.find(s => s.id === id);
  
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  // Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !quizSubmitted) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted && !quizSubmitted) {
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, quizSubmitted]);

  const startQuiz = (lesson: Lesson) => {
    if (lesson.type === 'quiz' && lesson.quizData) {
      setQuizStarted(true);
      setTimeLeft(lesson.quizData.timeLimit);
      setAnswers({});
      setQuizSubmitted(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    // Calculate score
    if (activeLesson?.quizData) {
      let correctCount = 0;
      activeLesson.quizData.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) correctCount++;
      });
      
      const score = Math.round((correctCount / activeLesson.quizData.questions.length) * 100);
      
      Swal.fire({
        icon: score >= 80 ? 'success' : 'info',
        title: `Kết quả: ${score}/100`,
        text: score >= 80 ? 'Tuyệt vời! Bạn đã vượt qua bài kiểm tra.' : 'Hãy ôn tập thêm và thử lại nhé.',
      });

      if (score >= 80) {
        handleCompleteLesson(activeLesson.id);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!subject) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy khóa học</h2>
        <Link to="/courses" className="text-blue-600 hover:underline mt-4 inline-block">Quay lại danh sách</Link>
      </div>
    );
  }

  const handleCompleteLesson = (lessonId: string) => {
    if (!progress.completedLessons.includes(lessonId)) {
      updateProgress({
        completedLessons: [...progress.completedLessons, lessonId],
      });
      if (activeLesson?.type !== 'quiz') {
        Swal.fire({
          icon: 'success',
          title: 'Chúc mừng!',
          text: 'Bạn đã hoàn thành bài học này.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
      {/* Sidebar: Lesson List */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <button onClick={() => navigate('/courses')} className="text-slate-500 hover:text-blue-600 mb-4 flex items-center gap-2 text-sm">
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
              <i className={`fa-solid ${subject.icon}`}></i>
            </div>
            <div>
              <h2 className="font-bold text-slate-800">{subject.name}</h2>
              <p className="text-xs text-slate-500">{subject.lessons.length} bài học</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {subject.lessons.length === 0 ? (
            <p className="text-center text-slate-400 py-8 text-sm">Chưa có bài học nào.</p>
          ) : (
            subject.lessons.map((lesson, index) => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              const isActive = activeLesson?.id === lesson.id;
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setActiveLesson(lesson);
                    setQuizStarted(false);
                    setQuizSubmitted(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                    isActive 
                      ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' 
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? <i className="fa-solid fa-check"></i> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      {lesson.type === 'quiz' ? <i className="fa-solid fa-stopwatch"></i> : <i className="fa-regular fa-clock"></i>} 
                      {lesson.duration}
                    </p>
                  </div>
                  <i className={`fa-solid fa-chevron-right text-xs ${isActive ? 'text-blue-400' : 'text-slate-300'}`}></i>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Content: Lesson View */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {activeLesson ? (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">{activeLesson.title}</h3>
              <div className="flex items-center gap-3">
                {activeLesson.type === 'quiz' && quizStarted && !quizSubmitted && (
                  <span className={`px-3 py-1 rounded-full text-sm font-mono font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {formatTime(timeLeft)}
                  </span>
                )}
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium uppercase">
                  {activeLesson.type}
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
              {activeLesson.type === 'quiz' && activeLesson.quizData ? (
                !quizStarted ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 text-4xl">
                      <i className="fa-solid fa-clipboard-question"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Bài kiểm tra kiến thức</h2>
                    <p className="text-slate-500 mb-8">
                      Thời gian làm bài: {Math.floor(activeLesson.quizData.timeLimit / 60)} phút<br/>
                      Số câu hỏi: {activeLesson.quizData.questions.length} câu
                    </p>
                    <button
                      onClick={() => startQuiz(activeLesson)}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
                    >
                      Bắt đầu làm bài
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8 max-w-2xl mx-auto">
                    {activeLesson.quizData.questions.map((q, qIndex) => (
                      <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-4 flex gap-3">
                          <span className="text-blue-600">Câu {qIndex + 1}:</span>
                          {q.content}
                        </h4>
                        <div className="space-y-3">
                          {q.options.map((opt, optIndex) => {
                            let optionClass = "w-full text-left p-3 rounded-lg border transition-all ";
                            if (quizSubmitted) {
                              if (optIndex === q.correctAnswer) optionClass += "bg-green-100 border-green-300 text-green-800 font-medium";
                              else if (answers[q.id] === optIndex) optionClass += "bg-red-100 border-red-300 text-red-800";
                              else optionClass += "bg-slate-50 border-slate-200 opacity-60";
                            } else {
                              if (answers[q.id] === optIndex) optionClass += "bg-blue-50 border-blue-300 text-blue-800 ring-1 ring-blue-300";
                              else optionClass += "bg-white border-slate-200 hover:bg-slate-50";
                            }

                            return (
                              <button
                                key={optIndex}
                                onClick={() => handleAnswerSelect(q.id, optIndex)}
                                disabled={quizSubmitted}
                                className={optionClass}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {quizSubmitted && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                            <strong>Giải thích:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {!quizSubmitted && (
                      <div className="flex justify-center pt-4">
                        <button
                          onClick={handleSubmitQuiz}
                          className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all"
                        >
                          Nộp bài
                        </button>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-blue-600">
                  <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {activeLesson.type !== 'quiz' && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => handleCompleteLesson(activeLesson.id)}
                  disabled={progress.completedLessons.includes(activeLesson.id)}
                  className={`px-6 py-3 rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2 ${
                    progress.completedLessons.includes(activeLesson.id)
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {progress.completedLessons.includes(activeLesson.id) ? (
                    <>
                      <i className="fa-solid fa-check-circle"></i>
                      Đã hoàn thành
                    </>
                  ) : (
                    <>
                      Hoàn thành bài học
                      <i className="fa-solid fa-arrow-right"></i>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <i className="fa-solid fa-book-open text-4xl text-slate-300"></i>
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">Chưa chọn bài học</h3>
            <p className="max-w-xs text-center">Vui lòng chọn một bài học từ danh sách bên trái để bắt đầu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
