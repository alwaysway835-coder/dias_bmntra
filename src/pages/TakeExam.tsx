import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Exam, Question, Answer, UserProfile } from '../types';
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TakeExamProps {
  profile: UserProfile | null;
}

export default function TakeExam({ profile }: TakeExamProps) {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ score: number, correct: number, total: number } | null>(null);

  useEffect(() => {
    if (examId) {
      fetchExamContent();
    }
  }, [examId]);

  async function fetchExamContent() {
    setLoading(true);
    try {
      // Fetch Exam
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select('*')
        .eq('id', examId)
        .single();
      
      if (examError) throw examError;
      setExam(examData);

      // Fetch Questions
      const { data: qData, error: qError } = await supabase
        .from('questions')
        .select('*')
        .eq('exam_id', examId);
      
      if (qError) throw qError;
      setQuestions(qData || []);
    } catch (error) {
      console.error('Error fetching exam content:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSelect = (optionIdx: number) => {
    const qId = questions[currentIdx].id;
    setAnswers({ ...answers, [qId]: optionIdx });
  };

  const handleSubmit = async () => {
    if (!exam || questions.length === 0 || !profile) return;
    
    setSubmitting(true);
    let correctCount = 0;
    
    questions.forEach(q => {
      if (answers[q.id] !== undefined && answers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });

    const score = (correctCount / questions.length) * 100;

    try {
      const { error } = await supabase.from('exam_results').insert({
        exam_id: exam.id,
        user_id: profile.id,
        user_role: profile.role,
        score: score,
        total_questions: questions.length,
        correct_answers: correctCount
      });

      if (error) throw error;

      setResult({ score, correct: correctCount, total: questions.length });
      setFinished(true);
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Gagal mengirim hasil ujian. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Menyiapkan Lembar Jawaban...</p>
      </div>
    );
  }

  if (finished && result) {
    const isPassed = result.score >= (exam?.kkm || 50);
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-zinc-200 p-12 rounded-[3.5rem] shadow-2xl max-w-2xl w-full text-center"
        >
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8",
            isPassed ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
          )}>
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-zinc-950 mb-2">Ujian Selesai!</h2>
          <p className="text-zinc-500 font-medium text-lg mb-10">Hasil Anda telah dikirim dan tercatat di sistem.</p>
          
          <div className="grid grid-cols-3 gap-6 mb-12">
             <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Skor Akhir</p>
                <p className={cn("text-3xl font-black", isPassed ? "text-emerald-500" : "text-red-500")}>{Math.round(result.score)}</p>
             </div>
             <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Jawaban Benar</p>
                <p className="text-3xl font-black text-zinc-950">{result.correct}</p>
             </div>
             <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Soal</p>
                <p className="text-3xl font-black text-zinc-950">{result.total}</p>
             </div>
          </div>

          <div className={cn(
            "p-6 rounded-3xl mb-12 flex items-center gap-4 text-left",
            isPassed ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"
          )}>
            <div className="shrink-0">
               {isPassed ? <Trophy className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
            </div>
            <div>
               <p className="font-black text-lg">{isPassed ? 'SELAMAT! ANDA LULUS' : 'MAAF, BELUM LULUS'}</p>
               <p className="text-sm opacity-80">{isPassed ? 'Pertahankan prestasi Anda.' : 'Silakan hubungi pengajar untuk remedial.'}</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/app')}
            className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all"
          >
            KEMBALI KE DASHBOARD
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-6">
           <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center font-bold text-primary">S</div>
           <div>
              <h1 className="text-sm font-black text-zinc-950 truncate max-w-[200px] md:max-w-md">{exam?.title}</h1>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Kategori: {exam?.category}</p>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden md:flex flex-col items-end">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Progress</p>
              <p className="text-sm font-black text-zinc-950">{currentIdx + 1} / {questions.length}</p>
           </div>
           <div className="w-32 h-1.5 bg-zinc-100 rounded-full overflow-hidden hidden md:block">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary" 
              />
           </div>
           <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl flex items-center gap-2 border border-orange-100 shadow-sm">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-black tracking-widest">60:00</span>
           </div>
        </div>
      </header>

      {/* Question Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="bg-white border border-zinc-200 p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden min-h-[400px] flex flex-col">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
              
              <div className="flex-1">
                <span className="inline-block bg-zinc-100 text-zinc-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6">
                  Pertanyaan {currentIdx + 1}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-zinc-950 leading-relaxed mb-12">
                  {currentQ?.question_text}
                </h3>

                <div className="grid gap-4">
                  {currentQ?.options.map((option, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={cn(
                        "w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4 group",
                        answers[currentQ.id] === i 
                          ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" 
                          : "bg-white border-zinc-100 hover:border-zinc-200"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all",
                        answers[currentQ.id] === i 
                          ? "bg-primary text-zinc-950" 
                          : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                      )}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={cn(
                        "flex-1 font-bold",
                        answers[currentQ.id] === i ? "text-zinc-950" : "text-zinc-600"
                      )}>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pb-20">
               <button 
                 disabled={currentIdx === 0}
                 onClick={() => setCurrentIdx(currentIdx - 1)}
                 className="flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors disabled:opacity-30 disabled:hover:text-zinc-400 font-bold"
               >
                 <ChevronLeft className="w-5 h-5" />
                 SEBELUMNYA
               </button>

               {currentIdx === questions.length - 1 ? (
                 <button 
                   onClick={handleSubmit}
                   disabled={submitting || Object.keys(answers).length < questions.length}
                   className="bg-primary text-zinc-950 px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 active:scale-100 transition-all shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
                 >
                   {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                   SELESAIKAN UJIAN
                 </button>
               ) : (
                 <button 
                   onClick={() => setCurrentIdx(currentIdx + 1)}
                   className="flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors font-bold group"
                 >
                   SELANJUTNYA
                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
               )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
