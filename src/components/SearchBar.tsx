"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X, CornerDownLeft } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(activeQuery);

  const executeSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    const currentQ = (searchParams.get("q") || "").trim();
    if (trimmed === currentQ) return;

    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    const targetUrl = params.toString() ? `/?${params.toString()}` : "/";
    router.push(targetUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    if (searchParams.get("q")) {
      router.push("/");
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <form onSubmit={handleSubmit}>
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                executeSearch(query);
              }
            }}
            placeholder="Search by course or faculty name... (Press Enter)"
            className="
              border-0 shadow-none focus-visible:ring-0 !bg-transparent
              text-sm text-slate-200
              placeholder:text-slate-500
              h-13 px-0 py-4 flex-1
            "
          />

          {/* Quick Enter key badge */}
          {query.trim() && query.trim() !== activeQuery.trim() && (
            <button
              type="submit"
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-700/60 text-[10px] font-semibold text-indigo-300 hover:bg-indigo-900 cursor-pointer transition-colors shrink-0"
              title="Press Enter to search"
            >
              <span>Enter</span>
              <CornerDownLeft className="w-2.5 h-2.5" />
            </button>
          )}

          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="
                flex items-center justify-center w-6 h-6
                rounded-lg text-slate-500 hover:text-slate-200
                hover:bg-slate-700/60
                transition-colors cursor-pointer shrink-0
              "
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {activeQuery && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          Showing results for{" "}
          <span className="font-semibold text-slate-200">
            &ldquo;{activeQuery}&rdquo;
          </span>
        </p>
      )}
    </div>
  );
}
