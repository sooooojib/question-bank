"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBatch } from "@/app/actions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  FolderKanban,
  ArrowRight,
  Calendar,
  Plus,
  Loader2,
  FolderPlus,
} from "lucide-react";
import type { BatchWithCount } from "@/app/page";

interface HomeSearchGridProps {
  initialBatches: BatchWithCount[];
}

// ── Ordinal helper ────────────────────────────────────────────────────────
function getOrdinalSuffix(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function formatBatchName(num: number): string {
  const suffix = getOrdinalSuffix(num);
  return `CSE ${num}${suffix} Batch`;
}

export default function HomeSearchGrid({ initialBatches }: HomeSearchGridProps) {
  const router = useRouter();
  const [batches, setBatches] = useState<BatchWithCount[]>(initialBatches);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [batchNumber, setBatchNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live preview of formatted name
  const parsedNum = parseInt(batchNumber, 10);
  const previewName = batchNumber && !isNaN(parsedNum) && parsedNum > 0
    ? formatBatchName(parsedNum)
    : null;

  // Sync state if initialBatches prop updates
  useEffect(() => {
    setBatches(initialBatches);
  }, [initialBatches]);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewName) {
      toast.error("Please enter a valid batch number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBatch(previewName);
      if (result.success) {
        toast.success(result.message || "Batch created successfully!");

        const newBatchId = result.batchId || `batch-${Date.now()}`;
        const newBatchItem: BatchWithCount = {
          id: newBatchId,
          name: previewName,
          created_at: new Date().toISOString(),
          question_count: 0,
        };
        setBatches((prev) => [
          newBatchItem,
          ...prev.filter((b) => b.id !== newBatchId),
        ]);

        setBatchNumber("");
        setIsAddModalOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create batch.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while creating batch.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Deduplicate batches by ID to prevent duplicate React key errors
  const uniqueBatches = Array.from(
    new Map(batches.map((b) => [b.id, b])).values()
  );

  return (
    <div className="space-y-6">
      {/* ── Header Label & Add Batch Button ── */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-4 gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Available Question Batches
          </h2>
        </div>

        {/* Right side action controls */}
        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant="outline"
            className="px-3 py-1 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium hidden sm:inline-flex"
          >
            {uniqueBatches.length} Batches
          </Badge>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="
              rounded-xl h-10 px-4
              bg-gradient-to-r from-indigo-600 to-blue-600
              hover:from-indigo-700 hover:to-blue-700
              text-white font-semibold text-xs sm:text-sm
              shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30
              hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200 cursor-pointer
            "
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Batch
          </Button>
        </div>
      </div>

      {/* ── Batch Card Grid ── */}
      {uniqueBatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueBatches.map((batch) => {
            const formattedDate = new Date(batch.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });

            return (
              <Link key={batch.id} href={`/batch/${batch.id}`} className="group block focus:outline-none">
                <Card className="h-full relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400/60 dark:hover:border-indigo-500/50 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300">
                  {/* Accent Top Border Glow on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardHeader className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <Badge className="bg-indigo-100/80 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-0 text-xs font-semibold rounded-lg px-2.5 py-1">
                        {batch.question_count ?? 0} {batch.question_count === 1 ? "Paper" : "Papers"}
                      </Badge>
                    </div>

                    <CardTitle className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
                      {batch.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Added {formattedDate}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto bg-slate-50/50 dark:bg-slate-900/40">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-indigo-600 dark:text-indigo-400 font-semibold group-hover:bg-indigo-100/60 dark:group-hover:bg-indigo-950/60 rounded-xl transition h-9 text-sm"
                    >
                      <span>View Questions</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-200/60 dark:border-slate-800 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 mx-auto flex items-center justify-center mb-4">
            <FolderPlus className="w-7 h-7" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-100">No Batches Available</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click &ldquo;+ Add Batch&rdquo; to create your first question batch.
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add First Batch
          </Button>
        </div>
      )}

      {/* ── Add Batch Modal ── */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => { setIsAddModalOpen(open); if (!open) setBatchNumber(""); }}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <DialogHeader className="text-left space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-900/60 text-indigo-400 flex items-center justify-center">
              <FolderPlus className="w-6 h-6" />
            </div>
            <DialogTitle className="font-heading text-xl font-bold text-slate-100">
              Add New Question Batch
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Batches are auto-formatted as <span className="text-indigo-400 font-semibold">CSE [Number][st/nd/rd/th] Batch</span>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBatch} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Batch Number
              </label>
              <Input
                type="number"
                min={1}
                max={99}
                required
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. 14"
                className="rounded-xl h-11 bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600 text-sm focus-visible:ring-indigo-500"
              />

              {/* Live preview */}
              <div className={`
                flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200
                ${
                  previewName
                    ? "bg-indigo-950/60 border-indigo-800/60"
                    : "bg-slate-800/40 border-slate-700/50"
                }
              `}>
                <span className="text-[11px] text-slate-500 font-medium">Preview:</span>
                <span className={`text-sm font-bold ${ previewName ? "text-indigo-300" : "text-slate-600" }`}>
                  {previewName ?? "CSE ??th Batch"}
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                Enter just the number — the name is generated automatically.
              </p>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => { setIsAddModalOpen(false); setBatchNumber(""); }}
                className="rounded-xl h-11 text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !previewName}
                className="rounded-xl h-11 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-indigo-600/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating…
                  </span>
                ) : (
                  "Create Batch"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
