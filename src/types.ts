export type UserRole = 'admin' | 'guru' | 'tenaga_kependidikan';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
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

export interface ExamResult {
  id: string;
  exam_id: string;
  user_id: string;
  user_role: UserRole;
  score: number;
  completed_at: string;
}
