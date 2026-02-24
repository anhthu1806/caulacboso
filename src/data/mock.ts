export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown content or JSON for quiz
  type: 'video' | 'text' | 'interactive' | 'quiz';
  duration: string;
  quizData?: {
    questions: Question[];
    timeLimit: number; // seconds
  };
}

export interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  lessons: Lesson[];
}

export interface UserProgress {
  completedLessons: string[]; // Lesson IDs
  quizScores: { [quizId: string]: number };
  totalTimeSpent: number; // Minutes
  streakDays: number;
  lastActiveDate: string;
}

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'ai-basics',
    name: 'Nhập môn AI Sáng tạo',
    icon: 'fa-robot',
    description: 'Tìm hiểu cơ bản về AI và cách sử dụng các công cụ AI phổ biến.',
    lessons: [
      {
        id: 'ai-101',
        title: 'AI là gì?',
        content: '# AI là gì?\n\nTrí tuệ nhân tạo (AI) là...',
        type: 'text',
        duration: '10 phút'
      },
      {
        id: 'ai-tools',
        title: 'Các công cụ AI phổ biến',
        content: '# Các công cụ AI\n\n- ChatGPT\n- Gemini\n- Midjourney',
        type: 'text',
        duration: '15 phút'
      },
      {
        id: 'ai-quiz-1',
        title: 'Kiểm tra kiến thức',
        content: 'Quiz',
        type: 'quiz',
        duration: '5 phút',
        quizData: {
          timeLimit: 300,
          questions: [
            {
              id: 'q1',
              content: 'AI là viết tắt của từ gì?',
              options: ['Artificial Intelligence', 'Automated Interface', 'Apple Inc', 'Advanced Internet'],
              correctAnswer: 0,
              explanation: 'AI là viết tắt của Artificial Intelligence (Trí tuệ nhân tạo).'
            },
            {
              id: 'q2',
              content: 'Công cụ nào sau đây là của Google?',
              options: ['ChatGPT', 'Gemini', 'Claude', 'Llama'],
              correctAnswer: 1,
              explanation: 'Gemini là mô hình AI đa phương thức của Google.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'copyright',
    name: 'Bản quyền & Đạo đức số',
    icon: 'fa-scale-balanced',
    description: 'Hiểu về luật bản quyền và cách sử dụng nội dung hợp pháp.',
    lessons: [
      {
        id: 'copy-101',
        title: 'Bản quyền là gì?',
        content: '# Bản quyền\n\nQuyền tác giả là...',
        type: 'text',
        duration: '10 phút'
      },
      {
        id: 'ethics-101',
        title: 'Đạo đức số cơ bản',
        content: '# Đạo đức số là gì?\n\nĐạo đức số (Digital Ethics) là hệ thống các nguyên tắc đạo đức và chuẩn mực ứng xử trên môi trường số.\n\n## Nguyên tắc vàng:\n1. **Tôn trọng:** Tôn trọng người khác như cách bạn muốn được tôn trọng.\n2. **Trung thực:** Không lan truyền tin giả (Fake News).\n3. **Trách nhiệm:** Chịu trách nhiệm về hành vi của mình trên mạng.\n\n## Ứng xử văn minh:\n- Không bắt nạt qua mạng (Cyberbullying).\n- Bảo vệ thông tin cá nhân của mình và người khác.\n- Suy nghĩ kỹ trước khi chia sẻ (Think before you click).',
        type: 'text',
        duration: '15 phút'
      }
    ]
  },
  {
    id: 'multimedia',
    name: 'Sáng tạo Đa phương tiện',
    icon: 'fa-photo-film',
    description: 'Kỹ năng tạo ảnh, video và âm thanh với sự hỗ trợ của AI.',
    lessons: []
  }
];

export const INITIAL_PROGRESS: UserProgress = {
  completedLessons: [],
  quizScores: {},
  totalTimeSpent: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString()
};
