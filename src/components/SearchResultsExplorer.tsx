"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FileViewer from "@/components/FileViewer";
import { useRouter } from "next/navigation";
import { FileText, User, Eye, FolderKanban, RotateCcw } from "lucide-react";
import type { QuestionRecord } from "@/app/batch/[id]/page";
import { formatBatchSemesterTag } from "@/lib/courses";
import { getFacultyFullName } from "@/lib/faculty";

interface SearchResultsExplorerProps {
  questions: QuestionRecord[];
  query: string;
  onClear?: () => void;
}

export default function SearchResultsExplorer({
  questions,
  query,
  onClear,
}: SearchResultsExplorerProps) {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionRecord | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const getExamBadgeStyle = (examType: string) => {
    const normalized = examType.toLowerCase().replace(/[^a-z]/g, "");

    if (normalized.includes("mid")) {
      return "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    }
    if (normalized.includes("final")) {
      return "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
    }
    if (normalized.includes("quiz") || normalized.includes("assign") || normalized.includes("class")) {
      return "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    }
    return "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      router.push("/");
    }
  };

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-5 shadow-xl backdrop-blur-md animate-in fade-in-50 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-900/60 mx-auto flex items-center justify-center text-indigo-400">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-slate-100">No questions found</h3>
          <p className="text-sm text-slate-400">
            No past papers found for course &ldquo;<span className="text-slate-200 font-semibold">{query}</span>&rdquo;.
          </p>
        </div>
        <Button
          onClick={handleClear}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium cursor-pointer px-6 h-10 shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Show All Batches
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/80 pb-3">
        <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          <span>Found Questions for &ldquo;{query}&rdquo;</span>
        </h3>
        <div>
          <Badge variant="outline" className="px-3 py-1 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium">
            {questions.length} Question{questions.length === 1 ? "" : "s"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {questions.map((q) => {
          const batchName = q.batch_name || (Array.isArray(q.batches) ? q.batches[0]?.name : q.batches?.name);
          const tag = formatBatchSemesterTag(batchName, q.semester);

          return (
            <Card
              key={q.id}
              className="
                relative overflow-hidden rounded-2xl p-5 sm:p-6
                bg-white/80 dark:bg-slate-900/70 backdrop-blur-md
                border border-slate-200/80 dark:border-slate-800
                hover:border-indigo-400/60 dark:hover:border-indigo-500/50
                hover:shadow-xl hover:shadow-indigo-500/5
                transition-all duration-300
              "
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* LEFT: Course Name (Bold) & Teacher Name (Subtext) */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                      {q.course_name}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Faculty: {getFacultyFullName(q.teacher_name)}</span>
                    </p>
                  </div>
                </div>

                {/* MIDDLE: Badge for Exam Type + Batch-Semester Tag */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Badge
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border ${getExamBadgeStyle(
                      q.exam_type
                    )}`}
                  >
                    {q.exam_type}
                  </Badge>

                  <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                    <FolderKanban className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{tag}</span>
                  </div>
                </div>

                {/* RIGHT: View Document Button */}
                <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <Button
                    onClick={() => {
                      setSelectedQuestion(q);
                      setIsViewerOpen(true);
                    }}
                    className="
                      w-full md:w-auto rounded-xl px-5 h-10
                      bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm
                      shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30
                      hover:scale-[1.02] active:scale-[0.98]
                      transition-all duration-200 cursor-pointer
                    "
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Document
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedQuestion && (
        <FileViewer
          fileUrl={selectedQuestion.file_url}
          fileType={selectedQuestion.file_type}
          title={selectedQuestion.course_name}
          examType={selectedQuestion.exam_type}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  );
}
