"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (val: string) => {
    setQuery(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("q", val.trim());
    } else {
      params.delete("q");
    }
    router.push(`/?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
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
          px-5
          shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]
          hover:border-slate-600/70
          hover:bg-slate-900/70
        `}
      >
        {/* Search icon with subtle indigo tint */}
        <Search className="w-4.5 h-4.5 text-indigo-400/70 shrink-0" />

        <Input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by course name  (e.g. Algorithm, Data Structure, Physics...)"
          className="
            border-0 shadow-none focus-visible:ring-0 !bg-transparent
            text-sm text-slate-200
            placeholder:text-slate-500
            h-13 px-0 py-4
          "
        />

        {query && (
          <button
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
      {query && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          Showing results for{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            &ldquo;{query}&rdquo;
          </span>
        </p>
      )}
    </div>
  );
}
