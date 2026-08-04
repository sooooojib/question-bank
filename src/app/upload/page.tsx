"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { uploadQuestion } from "@/app/actions";
import { COURSE_LIST, SEMESTER_LABELS, type Course } from "@/lib/courses";
import { supabase } from "@/utils/supabase";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Upload,
  KeyRound,
  FolderPlus,
  BookOpen,
  User,
  GraduationCap,
  Loader2,
  ChevronLeft,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";

// ─── Types & constants ────────────────────────────────────────────────────────
interface Batch {
  id: string;
  name: string;
}

type SemesterCode = Course["semester"];

const SEMESTER_OPTIONS: SemesterCode[] = [
  "1.1", "1.2", "2.1", "2.2", "3.1", "3.2", "4.1", "4.2",
];

const EXAM_TYPES = ["Mid 1", "Mid 2", "Mid 3", "Final Term", "Quiz", "Other"] as const;

// ─── Shared styling tokens ────────────────────────────────────────────────────
const inputCls =
  "w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-colors text-sm px-3";

const triggerCls =
  "w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm px-3 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 opacity-100";

const contentCls =
  "bg-slate-900 border border-slate-700 text-slate-100 shadow-2xl z-[100] opacity-100 backdrop-blur-none max-h-60 overflow-y-auto w-[var(--radix-select-trigger-width)] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100";

const labelCls =
  "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5";

// ─── Component ────────────────────────────────────────────────────────────────
export default function UploadQuestionPage() {
  const router = useRouter();

  // State: Batch Selection
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");

  // State: Semester & Course
  const [selectedSemester, setSelectedSemester] = useState<SemesterCode | "">("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  // State: Other Fields
  const [examType, setExamType] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // ── File size validation (1MB max) ────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      // Reject: reset input and open warning modal
      e.target.value = "";
      setSelectedFileName("");
      setShowSizeModal(true);
      return;
    }
    setSelectedFileName(file.name);
  };

  // ── Fetch batches from Supabase ───────────────────────────────────────────
  useEffect(() => {
    async function fetchBatches() {
      try {
        const { data, error } = await supabase
          .from("batches")
          .select("id, name")
          .order("name", { ascending: true });

        if (!error && data) {
          setBatches(data as Batch[]);
        }
      } catch {
        setBatches([]);
      }
    }
    fetchBatches();
  }, []);

  // ── Derived Values ────────────────────────────────────────────────────────
  const filteredCourses: Course[] = selectedSemester
    ? COURSE_LIST.filter((c) => c.semester === selectedSemester)
    : [];

  const handleSemesterChange = (val: string) => {
    setSelectedSemester(val as SemesterCode);
    setSelectedCourse(""); // Reset course when semester changes
  };

  // ── Form Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedBatch) {
      toast.error("Please select a batch.");
      return;
    }
    if (!selectedSemester) {
      toast.error("Please select a semester.");
      return;
    }
    if (!selectedCourse) {
      toast.error("Please select a course.");
      return;
    }
    if (!examType) {
      toast.error("Please select an exam type.");
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    formData.set("batch_name", selectedBatch);
    formData.set("semester", selectedSemester);
    formData.set("course_name", selectedCourse);
    formData.set("exam_type", examType);

    setIsUploading(true);
    try {
      const result = await uploadQuestion(formData);
      if (result.success) {
        toast.success(result.message ?? "Question paper uploaded successfully!");
        formElement.reset();
        setSelectedBatch("");
        setSelectedSemester("");
        setSelectedCourse("");
        setExamType("");
        setSelectedFileName("");
        setTimeout(() => router.push("/"), 1200);
      } else {
        toast.error(result.error ?? "Upload failed. Please try again.");
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col justify-center">

      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors group mb-6 w-fit"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Question Bank
      </Link>

      {/* Page Heading */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
          <Upload className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Upload Question Paper
        </h1>
      </div>

      {/* ── Main Card ── */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
        <form id="upload-form" onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">

            {/* ── 1. SECRET ACCESS KEY (Full Width) ── */}
            <div>
              <Label className={labelCls}>
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                Secret Access Key
              </Label>
              <Input
                type="password"
                name="access_key"
                required
                autoComplete="off"
                placeholder="Enter secret authorization key (e.g. admin123)"
                className={inputCls}
              />
            </div>

            {/* ── 2. BATCH NAME (Select Existing Only) ── */}
            <div>
              <Label className={labelCls}>
                <FolderPlus className="w-3.5 h-3.5 text-violet-400" />
                Batch Name
              </Label>
              <Select
                value={selectedBatch}
                onValueChange={(val) => { if (val) setSelectedBatch(val); }}
              >
                <SelectTrigger className={triggerCls}>
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent className={contentCls}>
                  {batches.map((b) => (
                    <SelectItem
                      key={b.id}
                      value={b.name}
                      className="text-sm rounded-lg text-slate-100 hover:bg-slate-800 cursor-pointer"
                    >
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ── 3. SEMESTER & COURSE NAME (2-Column Row) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Semester */}
              <div>
                <Label className={labelCls}>
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  Semester
                </Label>
                <Select
                  value={selectedSemester}
                  onValueChange={(val) => { if (val) handleSemesterChange(val); }}
                >
                  <SelectTrigger className={triggerCls}>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className={contentCls}>
                    {SEMESTER_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="text-sm rounded-lg text-slate-100 cursor-pointer">
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-indigo-400 font-semibold shrink-0">{s}</span>
                          <span className="text-slate-200 truncate">{SEMESTER_LABELS[s]}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Course Name — disabled until semester is chosen */}
              <div>
                <Label className={labelCls}>
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  Course Name
                </Label>
                <Select
                  value={selectedCourse}
                  onValueChange={(val) => { if (val) setSelectedCourse(val); }}
                  disabled={!selectedSemester}
                >
                  <SelectTrigger
                    className={
                      triggerCls +
                      (!selectedSemester ? " opacity-50 cursor-not-allowed" : "")
                    }
                  >
                    <SelectValue
                      placeholder={
                        selectedSemester
                          ? `${filteredCourses.length} courses available`
                          : "Select Semester First"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className={contentCls}>
                    {filteredCourses.map((c) => (
                      <SelectItem
                        key={c.code}
                        value={`${c.code} - ${c.title}`}
                        className="text-sm rounded-lg text-slate-100 cursor-pointer"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-indigo-400 text-xs shrink-0">[{c.code}]</span>
                          <span className="truncate text-slate-200">{c.title}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── 4. TEACHER / FACULTY NAME & EXAM YEAR (2-Column Row) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Teacher Name */}
              <div>
                <Label className={labelCls}>
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Teacher / Faculty Name
                </Label>
                <Input
                  type="text"
                  name="teacher_name"
                  required
                  placeholder="e.g. UKA"
                  className={inputCls}
                />
              </div>

              {/* Exam Year */}
              <div>
                <Label className={labelCls}>
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  Exam Year
                </Label>
                <Input
                  type="number"
                  name="year"
                  required
                  min={2000}
                  max={2100}
                  defaultValue={new Date().getFullYear()}
                  className={inputCls}
                />
              </div>
            </div>

            {/* ── 5. EXAM TYPE (Full Width) ── */}
            <div>
              <Label className={labelCls}>
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Exam Type
              </Label>
              <Select
                value={examType}
                onValueChange={(val) => { if (val) setExamType(val); }}
              >
                <SelectTrigger className={triggerCls}>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent className={contentCls}>
                  {EXAM_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="text-sm rounded-lg text-slate-100 cursor-pointer">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ── 6. QUESTION DOCUMENT (Full Width Drag & Drop Box) ── */}
            <div>
              <Label className={labelCls}>
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                Question Document (PDF, Image, or Doc)
              </Label>
              <div
                className={`
                  group relative flex flex-col items-center justify-center
                  w-full min-h-[140px] rounded-xl border-2 border-dashed
                  transition-all duration-200 cursor-pointer
                  ${selectedFileName
                    ? "border-indigo-500 bg-indigo-950/30"
                    : "border-slate-800 bg-slate-950/50 hover:border-indigo-500/70 hover:bg-indigo-950/20"
                  }
                `}
              >
                <input
                  type="file"
                  name="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-2 pointer-events-none text-center px-6">
                  <div className="w-11 h-11 rounded-xl bg-indigo-900/60 text-indigo-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  {selectedFileName ? (
                    <>
                      <p className="text-sm font-semibold text-indigo-400 break-all">{selectedFileName}</p>
                      <p className="text-xs text-slate-500">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-300">
                        Drag & drop here, or{" "}
                        <span className="text-indigo-400 font-semibold underline underline-offset-2">browse</span>
                      </p>
                      <p className="text-xs text-slate-500">Supports PDF, PNG, JPG, or DOC (Max File Size: 1MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── 7. UPLOAD BUTTON (Full Width Submit) ── */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isUploading}
                className="
                  w-full h-12 rounded-xl text-base font-semibold
                  bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700
                  hover:from-indigo-500 hover:to-purple-600
                  text-white shadow-lg shadow-indigo-500/20
                  hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99]
                  transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Question Paper
                  </span>
                )}
              </Button>
            </div>

          </div>
        </form>
      </div>
      {/* ── Oversized File Warning Modal ── */}
      <Dialog open={showSizeModal} onOpenChange={setShowSizeModal}>
        <DialogContent className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl max-w-md w-[92vw] shadow-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-2xl">⚠️</span> File Too Large (Limit: 1MB)
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm mt-2 leading-relaxed">
              Your file size is over <span className="text-white font-semibold">1MB</span>. To ensure fast downloads and save server storage, please compress your PDF before uploading.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mt-1">
            <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Recommended Free Tool</p>
            <a
              href="https://www.ilovepdf.com/compress_pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center justify-center gap-2 w-full h-11 rounded-xl
                bg-gradient-to-r from-rose-600 to-orange-500
                hover:from-rose-500 hover:to-orange-400
                text-white text-sm font-semibold
                shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40
                hover:scale-[1.02] active:scale-[0.99]
                transition-all duration-200
              "
            >
              Compress PDF on ilovepdf.com
            </a>
          </div>

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setShowSizeModal(false)}
              className="w-full h-10 rounded-xl border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
