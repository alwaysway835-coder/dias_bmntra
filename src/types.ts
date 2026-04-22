export type UserRole = 'admin' | 'guru' | 'tenaga_kependidikan' | 'siswa';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  nisn?: string;
  jurusan?: string;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  class_name: string;
  created_at: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  category: 'karyawan' | 'siswa';
  kkm?: number;
  created_by: string;
  created_at: string;
}

export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
}

export interface Answer {
  question_id: string;
  selected_option: number;
}

export interface ExamResult {
  id: string;
  exam_id: string;
  user_id: string;
  user_role: UserRole;
  score: number;
  total_questions: number;
  correct_answers: number;
  completed_at: string;
  exam?: Exam;
  profile?: UserProfile;
}
