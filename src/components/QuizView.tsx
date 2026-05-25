"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle, RefreshCcw, Layout, FileText, GraduationCap } from "lucide-react";
import ScienceText from "./ScienceText";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { submitAsesmenResult } from "@/app/actions/asesmen";

interface QuizViewProps {
  asesmen: {
    id: string;
    title: string;
    questions: {
      id: string;
      text: string;
      options: string; // JSON string
      type: string;
      answer: string;
    }[];
  };
  students?: { id: string, name: string }[];
}

export default function QuizView({ asesmen, students = [] }: QuizViewProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = asesmen.questions.map(q => ({
    ...q,
    options: q.type === "PILGAN" ? JSON.parse(q.options) : []
  }));

  const handleAnswer = (val: string) => {
    setAnswers({ ...answers, [currentIdx]: val });
  };

  // Handle auto-submission when quiz is finished
  const handleFinish = async () => {
    setIsFinished(true);
    if (selectedStudentId) {
      setIsSubmitting(true);
      const score = calculateScore();
      await submitAsesmenResult({
        studentId: selectedStudentId,
        asesmenId: asesmen.id,
        score,
        answers
      });
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleFinish();
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i]?.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (!selectedStudentId && students.length > 0) {
    return (
      <div className="max-w-4xl mx-auto min-h-screen flex items-center justify-center p-4 py-8">
        <div className="glass p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-border/50 w-full space-y-6 md:space-y-8 animate-in zoom-in duration-500">
           <div className="text-center space-y-2">
             <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
               <GraduationCap className="h-8 w-8" />
             </div>
             <h1 className="text-3xl font-black tracking-tight">Siapa namamu?</h1>
             <p className="text-muted-foreground">Pilih namamu dari daftar di bawah untuk memulai kuis.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
             {students.map(s => (
               <button
                 key={s.id}
                 onClick={() => setSelectedStudentId(s.id)}
                 className="p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary hover:bg-primary/5 transition-all text-left font-bold flex items-center justify-between group"
               >
                 <span>{s.name}</span>
                 <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
               </button>
             ))}
           </div>
           
           <div className="pt-4 border-t border-border/50 text-center">
             <p className="text-xs text-muted-foreground italic">Nama tidak ada? Hubungi gurumu untuk didaftarkan.</p>
           </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="w-full min-h-screen lg:h-screen flex flex-col bg-background overflow-y-auto lg:overflow-hidden">
        <div className="max-w-5xl mx-auto w-full h-full flex flex-col gap-6 lg:gap-8 px-4 py-6 md:py-8">
          <div className="flex-grow overflow-visible lg:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 space-y-8 lg:space-y-12">
            <div className="text-center space-y-6 lg:space-y-8 animate-in fade-in zoom-in duration-700">
              <div className="relative inline-block">
                <div className="h-40 w-40 rounded-full border-8 border-primary/10 flex items-center justify-center mx-auto shadow-2xl shadow-primary/20">
                  <span className="text-6xl font-black text-primary tabular-nums">{score}</span>
                </div>
                <div className="absolute -top-4 -right-4 bg-primary text-white p-4 rounded-3xl shadow-2xl animate-bounce">
                   <CheckCircle2 className="h-8 w-8" />
                </div>
              </div>
              
              <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Asesmen Selesai!</h1>
              <p className="text-lg text-muted-foreground font-medium">Bagus sekali! Kamu telah menyelesaikan <span className="text-foreground font-bold">{asesmen.title}</span>.</p>
              {isSubmitting && (
                <div className="flex items-center justify-center gap-2 text-xs text-primary font-bold uppercase tracking-[0.2em] animate-pulse py-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                   <span>Menyimpan Nilai...</span>
                </div>
              )}
            </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <button 
                   onClick={() => {
                     setAnswers({});
                     setCurrentIdx(0);
                     setShowResults(false);
                     setIsFinished(false);
                   }}
                   className="flex items-center justify-center gap-2 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all font-bold border border-border/50 active:scale-95"
                >
                  <RefreshCcw className="h-5 w-5" /> Coba Lagi
                </button>
                <Link 
                   href="/"
                   className="flex items-center justify-center gap-2 p-5 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 transition-all font-bold active:scale-95"
                >
                  Selesai & Beranda
                </Link>
              </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-4">
                 <h3 className="text-2xl font-bold tracking-tight">Review Jawaban</h3>
                 <div className="h-1 flex-grow bg-border/30 rounded-full" />
               </div>
               
               <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {questions.map((q, i) => {
                    const isCorrect = answers[i]?.trim().toLowerCase() === q.answer.trim().toLowerCase();
                    return (
                      <div key={q.id} className="glass p-6 md:p-8 rounded-[2.5rem] border border-border/50 space-y-4 hover:border-primary/20 transition-colors group">
                         <div className="flex items-start justify-between gap-6">
                            <div className="font-bold text-lg md:text-xl flex gap-3 min-w-0 w-full">
                              <span className="text-primary/40 tabular-nums">{(i + 1).toString().padStart(2, '0')}.</span> 
                              <div className="flex-1 min-w-0">
                                <ScienceText text={q.text} />
                              </div>
                            </div>
                           <div className={cn(
                             "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-lg",
                             isCorrect ? "bg-green-500 text-white shadow-green-500/20" : "bg-destructive text-white shadow-destructive/20"
                           )}>
                             {isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                           </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                           <div className={cn(
                             "p-4 rounded-2xl text-sm font-bold flex flex-col gap-1 border",
                             isCorrect ? "bg-green-500/5 border-green-500/20 text-green-600" : "bg-destructive/5 border-destructive/20 text-destructive"
                           )}>
                             <span className="text-[10px] uppercase tracking-widest opacity-60">Jawabanmu</span>
                             <span className="text-base">{answers[i] || "Dilewati"}</span>
                           </div>
                           {!isCorrect && (
                             <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-primary text-sm font-bold flex flex-col gap-1">
                               <span className="text-[10px] uppercase tracking-widest opacity-60">Kunci Jawaban</span>
                               <span className="text-base">{q.answer}</span>
                             </div>
                           )}
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="w-full min-h-screen md:h-screen flex flex-col bg-background md:overflow-hidden">
      <style>{`
        @media (max-height: 720px) {
          .quiz-container {
            gap: 0.5rem !important;
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          .quiz-card-body {
            padding: 0.75rem 1rem !important;
          }
          .quiz-question-container {
            gap: 0.5rem !important;
          }
          .quiz-question-space {
            margin-bottom: 0.5rem !important;
            margin-top: 0.25rem !important;
          }
          .quiz-question-space > div {
            margin-top: 0.25rem !important;
            margin-bottom: 0.25rem !important;
          }
          .quiz-header {
            gap: 0.5rem !important;
          }
          .quiz-footer {
            padding-bottom: 0.5rem !important;
          }
        }
      `}</style>
      <div className="quiz-container max-w-7xl mx-auto w-full md:h-full flex flex-col gap-3 md:gap-4 px-3 py-3 md:py-6">
        {/* Header - Fixed */}
        <div className="quiz-header flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
          <div className="space-y-1 w-full md:w-auto">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{asesmen.title}</h1>
            <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground font-medium">
               <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-lg">
                 <FileText className="h-3.5 w-3.5" /> 
                 <span>Pertanyaan {currentIdx + 1} dari {questions.length}</span>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-48 h-2.5 bg-secondary rounded-full overflow-hidden border border-border/50">
               <div 
                 className="h-full bg-primary transition-all duration-700 ease-out" 
                 style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} 
               />
            </div>
            <span className="text-[10px] font-bold text-primary tabular-nums">
              {Math.round(((currentIdx + 1) / questions.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Main Content - Scrollable on Desktop if needed */}
        <div className="flex-grow md:min-h-0 flex flex-col md:overflow-hidden">
          <div className="glass flex-grow rounded-[1.5rem] md:rounded-[2rem] border border-border/50 flex flex-col md:overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl">
             <div className="quiz-card-body flex-grow md:overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-primary/20">
                <div className="quiz-question-container max-w-6xl mx-auto min-h-full flex flex-col md:grid md:grid-cols-12 justify-between gap-4 md:gap-8 md:items-center">
                  <div className="quiz-question-space space-y-6 md:col-span-7 w-full">
                     <div className="space-y-4">
                        <div className="text-base md:text-lg lg:text-xl font-bold leading-tight tracking-tight">
                          <ScienceText text={q.text} />
                        </div>
                        <div className="h-1 w-12 bg-primary rounded-full shadow-lg shadow-primary/20" />
                     </div>
                  </div>

                  <div className="w-full md:col-span-5">
                    {q.type === "PILGAN" ? (
                      <div className="grid grid-cols-1 gap-2 md:gap-3">
                        {q.options.map((opt: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => handleAnswer(opt)}
                            className={cn(
                            "px-3 py-2 md:px-4 md:py-2.5 rounded-xl border text-left transition-all flex items-center gap-3 group relative overflow-hidden",
                            answers[currentIdx] === opt 
                              ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-1 ring-offset-background" 
                              : "bg-secondary/20 border-border/40 hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
                          )}
                        >
                          <div className={cn(
                            "h-8 w-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-sm transition-all",
                            answers[currentIdx] === opt 
                              ? "bg-white/20 text-white" 
                              : "bg-black/10 group-hover:bg-primary group-hover:text-white"
                          )}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div className="font-medium text-sm md:text-base flex-1 min-w-0 break-words">
                            <ScienceText text={opt} />
                          </div>
                            {answers[currentIdx] === opt && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle2 className="h-4 w-4 text-white/50" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                         <textarea
                           placeholder="Tuliskan jawabanmu di sini..."
                           value={answers[currentIdx] || ""}
                           onChange={(e) => handleAnswer(e.target.value)}
                           className="w-full bg-secondary/20 border border-border/40 rounded-2xl py-3 px-4 md:py-4 md:px-6 focus:ring-4 focus:ring-primary/20 transition-all outline-none resize-none text-base md:text-lg placeholder:text-muted-foreground/30 shadow-inner h-24 md:h-36"
                         />
                      </div>
                    )}
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Controls - Fixed */}
        <div className="quiz-footer flex items-center justify-between gap-4 shrink-0 pb-2 md:pb-4">
          <button
          onClick={prevQuestion}
          disabled={currentIdx === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-sm border border-border/50"
        >
          <ChevronLeft className="h-4 w-4" /> 
          <span>Sebelumnya</span>
        </button>

          {!isFinished ? (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all active:scale-95 group text-sm"
            >
              <span>{currentIdx === questions.length - 1 ? "Selesaikan" : "Selanjutnya"}</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => setShowResults(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-green-500/20 transition-all animate-bounce text-sm"
            >
              <span>Lihat Hasil</span>
              <Layout className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
