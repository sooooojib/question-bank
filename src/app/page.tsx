import Link from "next/link";
import { supabase } from "@/utils/supabase";
import HomeSearchGrid from "@/components/HomeSearchGrid";
import SearchBar from "@/components/SearchBar";
import SearchResultsExplorer from "@/components/SearchResultsExplorer";
import { Sparkles, FolderKanban, FileText, Layers } from "lucide-react";
import type { QuestionRecord } from "@/app/batch/[id]/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type BatchWithCount = {
  id: string;
  name: string;
  created_at: string;
  question_count?: number;
};

async function getBatches(): Promise<BatchWithCount[]> {
  try {
    const { data: batches, error } = await supabase
      .from("batches")
      .select("id, name, created_at, questions(count)")
      .order("created_at", { ascending: false });

    if (error || !batches) {
      return [];
    }

    return batches.map((b: any) => ({
      id: b.id,
      name: b.name,
      created_at: b.created_at,
      question_count: b.questions?.[0]?.count ?? 0,
    }));
  } catch (err) {
    return [];
  }
}

async function searchQuestions(searchQuery: string): Promise<QuestionRecord[]> {
  if (!searchQuery) return [];

  try {
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*, batches(name)")
      .ilike("course_name", `%${searchQuery}%`)
      .order("created_at", { ascending: false });

    if (error || !questions) {
      return [];
    }

    return questions.map((q: any) => ({
      ...q,
      batch_name: Array.isArray(q.batches) ? q.batches[0]?.name : q.batches?.name || "",
    }));
  } catch (err) {
    return [];
  }
}

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q?.trim() || "";

  const [batches, matchingQuestions] = await Promise.all([
    getBatches(),
    query ? searchQuestions(query) : Promise.resolve([]),
  ]);

  const totalQuestions = batches.reduce(
    (acc, b) => acc + (b.question_count || 0),
    0
  );

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
          <div className="pt-2">
            <SearchBar />
          </div>

          {/* Stat Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-900/80 border border-slate-800 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-sm backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-900/60">
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

            <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-900/80 border border-slate-800 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-sm backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-blue-950/80 text-blue-400 flex items-center justify-center border border-blue-900/60">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-heading text-lg font-bold text-slate-100 leading-tight">
                  {totalQuestions}
                </div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Indexed Papers
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-900/80 border border-slate-800 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-sm backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center border border-cyan-900/60">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-heading text-lg font-bold text-slate-100 leading-tight">
                  8
                </div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Semesters
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Conditional Main Section: Search Results OR Batches ── */}
      {query ? (
        <SearchResultsExplorer
          query={query}
          questions={matchingQuestions}
        />
      ) : (
        <HomeSearchGrid initialBatches={batches} />
      )}
    </div>
  );
}
