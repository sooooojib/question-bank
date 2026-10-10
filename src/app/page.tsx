import { supabase } from "@/utils/supabase";
import HomeClientView from "@/components/HomeClientView";
import type { QuestionRecord } from "@/app/batch/[id]/page";

export const revalidate = 60; // Incremental Static Regeneration: serve cached in <20ms, revalidates every 60s or on-demand

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
  } catch {
    return [];
  }
}

async function getAllQuestions(): Promise<QuestionRecord[]> {
  try {
    const { data: questions, error } = await supabase
      .from("questions")
      .select("id, batch_id, course_name, teacher_name, semester, exam_type, year, file_url, file_type, created_at, batches(name)")
      .order("created_at", { ascending: false });


    if (error || !questions) {
      return [];
    }

    return questions.map((q: any) => ({
      ...q,
      batch_name: Array.isArray(q.batches) ? q.batches[0]?.name : q.batches?.name || "",
    }));
  } catch {
    return [];
  }
}

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q?.trim() || "";

  const [batches, allQuestions] = await Promise.all([
    getBatches(),
    getAllQuestions(),
  ]);

  const totalQuestions = batches.reduce(
    (acc, b) => acc + (b.question_count || 0),
    0
  );

  return (
    <HomeClientView
      batches={batches}
      allQuestions={allQuestions}
      totalQuestions={totalQuestions}
      initialQuery={query}
    />
  );
}
