import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import BatchQuestionExplorer from "@/components/BatchQuestionExplorer";
import { ChevronLeft, FolderKanban, BookOpen, Layers } from "lucide-react";

export interface QuestionRecord {
  id: string;
  batch_id: string;
  course_name: string;
  teacher_name: string;
  semester: string;
  exam_type: string;
  year: number;
  file_url: string;
  file_type: string;
  created_at: string;
}

export interface BatchData {
  id: string;
  name: string;
  created_at: string;
}

async function getBatchData(id: string): Promise<{ batch: BatchData; questions: QuestionRecord[] }> {
  try {
    // 1. Fetch batch
    const { data: batch, error: batchError } = await supabase
      .from("batches")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (batchError || !batch) {
      return {
        batch: {
          id: id,
          name: "Department Batch Archive",
          created_at: new Date().toISOString(),
        },
        questions: [],
      };
    }

    // 2. Fetch questions for this batch
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("batch_id", id)
      .order("year", { ascending: false });

    return {
      batch,
      questions: questions || [],
    };
  } catch (err) {
    return {
      batch: {
        id: id,
        name: "Department Batch Archive",
        created_at: new Date().toISOString(),
      },
      questions: [],
    };
  }
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { batch, questions } = await getBatchData(id);

  const totalQuestions = questions.length;
  const uniqueCourses = new Set(questions.map((q) => q.course_name)).size;
  const uniqueSemesters = new Set(questions.map((q) => q.semester)).size;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* ── Top Navigation / Back Link ── */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors group mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Question Batches
        </Link>
      </div>

      {/* ── Batch Header Banner ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 px-5 py-6 sm:p-8 md:p-10 shadow-xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">

            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {batch.name}
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="text-center px-2">
              <div className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalQuestions}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Papers
              </div>
            </div>

            <div className="text-center px-2">
              <div className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
                {uniqueCourses}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <FolderKanban className="w-3 h-3" />
                Courses
              </div>
            </div>

            <div className="text-center px-2">
              <div className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
                {uniqueSemesters}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Semesters
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Question Explorer (Shadcn Tabs & Cards) ── */}
      <BatchQuestionExplorer questions={questions} />
    </div>
  );
}
