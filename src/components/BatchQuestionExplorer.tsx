"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FileViewer from "@/components/FileViewer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  User,
  Calendar,
  Eye,
  Layers,
  Filter,
  BookOpen,
  FolderKanban,
} from "lucide-react";
import type { QuestionRecord } from "@/app/batch/[id]/page";
import { formatBatchSemesterTag } from "@/lib/courses";

const SEMESTER_ORDER = ["1.1", "1.2", "2.1", "2.2", "3.1", "3.2", "4.1", "4.2"];

const EXAM_FILTER_OPTIONS = [
  { value: "All", label: "All Types" },
  { value: "Mid 1", label: "Mid 1" },
  { value: "Mid 2", label: "Mid 2" },
  { value: "Mid 3", label: "Mid 3" },
  { value: "Final Term", label: "Final Term" },
  { value: "Quiz", label: "Quiz" },
  { value: "Other", label: "Other" },
] as const;

interface BatchQuestionExplorerProps {
  questions: QuestionRecord[];
  batchName?: string;
}

export default function BatchQuestionExplorer({ questions, batchName }: BatchQuestionExplorerProps) {
  // 1. Group questions by semester first so defaultTab can be used in state
  const semesterMap: Record<string, QuestionRecord[]> = {};
  questions.forEach((q) => {
    const sem = q.semester || "General";
    if (!semesterMap[sem]) semesterMap[sem] = [];
    semesterMap[sem].push(q);
  });

  // Strict chronological sorting according to SEMESTER_ORDER
  const semesters = Object.keys(semesterMap).sort((a, b) => {
    const indexA = SEMESTER_ORDER.indexOf(a);
    const indexB = SEMESTER_ORDER.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const defaultTab = semesters[0] || "";

  // Modal state for previewing documents
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionRecord | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  // Exam type filter state
  const [selectedExamType, setSelectedExamType] = useState<string>("All");

  // Active Tab state
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleViewDocument = (q: QuestionRecord) => {
    setSelectedQuestion(q);
    setIsViewerOpen(true);
  };

  // 2. Badge color helper — updated for Mid 1/2/3, Final Term, Quiz, Other
  const getExamBadgeStyle = (examType: string) => {
    const t = examType.toLowerCase().trim();
    if (t === "mid 1" || t === "mid 2" || t === "mid 3" || t.startsWith("mid")) {
      return "bg-blue-950/80 text-blue-300 border-blue-700/60";
    }
    if (t.includes("final")) {
      return "bg-red-950/80 text-red-700 dark:text-red-300 border-red-700/60";
    }
    if (t === "quiz") {
      return "bg-emerald-950/80 text-emerald-300 border-emerald-700/60";
    }
    // Other
    return "bg-slate-800/80 text-slate-400 border-slate-600/60";
  };

  if (semesters.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-900/50 rounded-3xl border border-slate-800">
        <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-100">No Questions Found</h3>
        <p className="text-sm text-slate-500 mt-1">
          There are currently no uploaded question papers for this batch.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Semester Tabs ── */}
      <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Row + Exam Type Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-2">
          {/* Mobile Touch-Scrollable Container */}
          <div className="w-full overflow-x-auto scrollbar-none py-1 flex-1">
            <TabsList className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 inline-flex flex-nowrap shrink-0 gap-1.5 min-w-full sm:min-w-0 h-auto">
              {semesters.map((sem) => (
                <TabsTrigger
                  key={sem}
                  value={sem}
                  className="
                    px-4 sm:px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                    data-[state=active]:bg-slate-800
                    data-[state=active]:text-indigo-400
                    data-[state=active]:shadow-md
                    text-slate-400 hover:text-slate-200
                    cursor-pointer whitespace-nowrap shrink-0
                  "
                >
                  <BookOpen className="w-4 h-4 mr-2 inline shrink-0" />
                  {sem}
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-slate-700/60 text-slate-300 rounded-md text-[11px] px-1.5 py-0 shrink-0"
                  >
                    {selectedExamType === "All" || activeTab !== sem
                      ? semesterMap[sem].length
                      : semesterMap[sem].filter((q) => q.exam_type === selectedExamType).length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Exam Type Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <Select
              value={selectedExamType}
              onValueChange={(val) => { if (val) setSelectedExamType(val); }}
            >
              <SelectTrigger className="h-10 w-[160px] rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <SelectValue placeholder="Filter Exam Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border border-slate-700 text-slate-100 shadow-2xl rounded-xl z-[100]">
                {EXAM_FILTER_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-sm text-slate-200 cursor-pointer rounded-lg focus:bg-slate-800"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Tab Content per Semester ── */}
        {semesters.map((sem) => {
          const filtered =
            selectedExamType === "All" || activeTab !== sem
              ? semesterMap[sem]
              : semesterMap[sem].filter((q) => q.exam_type === selectedExamType);

          return (
            <TabsContent key={sem} value={sem} className="mt-6 space-y-4 focus-visible:outline-none">
              {filtered.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm font-medium">No papers match this filter.</p>
                  <p className="text-slate-600 text-xs mt-1">Try selecting "All Types" to see everything.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filtered.map((q) => (
                    <Card
                      key={q.id}
                      className="
                        relative overflow-hidden rounded-2xl p-5 sm:p-6
                        bg-slate-900/70 backdrop-blur-md
                        border border-slate-800
                        hover:border-indigo-500/50
                        hover:shadow-xl hover:shadow-indigo-500/5
                        transition-all duration-300
                      "
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* LEFT: Course Name & Teacher */}
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-900/60 flex items-center justify-center text-indigo-400 shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-slate-100 truncate">
                              {q.course_name}
                            </h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Faculty: {q.teacher_name}</span>
                            </p>
                          </div>
                        </div>

                        {/* MIDDLE: Exam Type Badge + Batch-Semester Tag + File Type */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          <Badge
                            className={`px-3 py-1 text-xs font-semibold rounded-lg border ${getExamBadgeStyle(q.exam_type)}`}
                          >
                            {q.exam_type}
                          </Badge>

                          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
                            <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{formatBatchSemesterTag(q.batch_name || (Array.isArray(q.batches) ? q.batches[0]?.name : q.batches?.name) || batchName, q.semester)}</span>
                          </div>

                          <Badge variant="outline" className="text-xs uppercase text-slate-400 border-slate-700">
                            {q.file_type || "pdf"}
                          </Badge>
                        </div>

                        {/* RIGHT: View Document Button (PROTECTED) */}
                        <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                          <Button
                            onClick={() => handleViewDocument(q)}
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
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* ── File Viewer Modal (PROTECTED) ── */}
      {selectedQuestion && (
        <FileViewer
          fileUrl={selectedQuestion.file_url}
          fileType={selectedQuestion.file_type}
          title={`${selectedQuestion.course_name} (${selectedQuestion.exam_type} ${selectedQuestion.year})`}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  );
}

