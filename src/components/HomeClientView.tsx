"use client";

import { useState, useEffect, useMemo } from "react";
import HomeSearchGrid from "@/components/HomeSearchGrid";
import SearchResultsExplorer from "@/components/SearchResultsExplorer";
import { Sparkles, FolderKanban, FileText, Search, CornerDownLeft, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BatchWithCount } from "@/app/page";
import type { QuestionRecord } from "@/app/batch/[id]/page";

interface HomeClientViewProps {
  batches: BatchWithCount[];
  allQuestions: QuestionRecord[];
  totalQuestions: number;
  initialQuery?: string;
}

export default function HomeClientView({
  batches,
  allQuestions,
  totalQuestions,
  initialQuery = "",
}: HomeClientViewProps) {
  // Committed search query that determines which results to show
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  // Input typing state
  const [inputValue, setInputValue] = useState(initialQuery);

  // Sync state if user clicks browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      setSearchQuery(q);
      setInputValue(q);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSearchCommit = (term: string) => {
    const clean = term.trim();
    setSearchQuery(clean);

    // Update browser URL immediately without server roundtrip lag
    const url = clean ? `/?q=${encodeURIComponent(clean)}` : "/";
    window.history.replaceState(null, "", url);
  };

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
    window.history.replaceState(null, "", "/");
  };

  // Instant in-memory filter strictly by course name
  const filteredQuestions = useMemo(() => {
    const clean = searchQuery.trim().toLowerCase();
    if (!clean) return [];
    return allQuestions.filter((q) =>
      q.course_name?.toLowerCase().includes(clean)
    );
  }, [allQuestions, searchQuery]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900/60 dark:bg-slate-900/40 border border-slate-800 px-5 py-8 sm:p-12 lg:p-16 text-center shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>University Question Archive</span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Question{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
              Bank
            </span>
          </h1>

          {/* Centered Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchCommit(inputValue);
              }}
            >
              <div
                className={`
                  relative flex items-center gap-3
                  bg-slate-900/60 backdrop-blur-sm
                  border border-slate-700/50
                  focus-within:border-indigo-500/60
                  focus-within:bg-slate-900/80
                  focus-within:shadow-[0_0_0_1px_rgba(99,102,241,0.3),0_8px_40px_rgba(99,102,241,0.15)]
                  rounded-2xl
                  transition-all duration-300
                  px-4 sm:px-5
                  shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]
                  hover:border-slate-600/70
                  hover:bg-slate-900/70
                `}
              >
                {/* Clickable Search icon button */}
                <button
                  type="submit"
                  aria-label="Search"
                  className="text-indigo-400 hover:text-white transition-colors cursor-pointer shrink-0 p-1 rounded-lg hover:bg-slate-800"
                  title="Press Enter or click to search"
                >
                  <Search className="w-4.5 h-4.5" />
                </button>

                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchCommit(inputValue);
                    }
                  }}
                  placeholder="Search by course name... (Press Enter to search)"
                  className="
                    border-0 shadow-none focus-visible:ring-0 !bg-transparent
                    text-sm text-slate-200
                    placeholder:text-slate-500
                    h-13 px-0 py-4 flex-1
                  "
                />

                {/* Enter key badge when typing (NO clear button inside the box) */}
                {inputValue.trim() && inputValue.trim() !== searchQuery.trim() && (
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-700/60 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-900 cursor-pointer transition-colors shrink-0"
                    title="Press Enter to search"
                  >
                    <span>Enter</span>
                    <CornerDownLeft className="w-3 h-3" />
                  </button>
                )}
              </div>
            </form>

            {/* ONLY ONE Clear Button: The bottom one right under the search bar */}
            {searchQuery && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-center animate-in fade-in duration-200">
                <p className="text-xs text-slate-400">
                  Filtering course:{" "}
                  <span className="font-semibold text-slate-200">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                </p>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/70 border border-indigo-800/50 text-xs font-medium text-indigo-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Clear search and show all batches"
                >
                  <RotateCcw className="w-3 h-3 text-indigo-400" />
                  <span>Clear Search</span>
                </button>
              </div>
            )}
          </div>

          {/* Stat Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <div className="w-[160px] sm:w-[180px] flex items-center gap-2.5 sm:gap-3 bg-slate-900/80 border border-slate-800 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-sm backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-900/60 shrink-0">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-heading text-lg font-bold text-slate-100 leading-tight">
                  {batches.length}
                </div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Batches
                </div>
              </div>
            </div>

            <div className="w-[160px] sm:w-[180px] flex items-center gap-2.5 sm:gap-3 bg-slate-900/80 border border-slate-800 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-sm backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-blue-950/80 text-blue-400 flex items-center justify-center border border-blue-900/60 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-heading text-lg font-bold text-slate-100 leading-tight">
                  {totalQuestions}
                </div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Questions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Conditional Main Section: Search Results OR Batches (Instant 0ms Reactivity) ── */}
      <div className="transition-all duration-200">
        {searchQuery ? (
          <div key={`search-${searchQuery}`} className="animate-in fade-in-50 duration-200">
            <SearchResultsExplorer
              query={searchQuery}
              questions={filteredQuestions}
              onClear={handleClear}
            />
          </div>
        ) : (
          <div key="batches-view" className="animate-in fade-in-50 duration-200">
            <HomeSearchGrid initialBatches={batches} />
          </div>
        )}
      </div>
    </div>
  );
}
