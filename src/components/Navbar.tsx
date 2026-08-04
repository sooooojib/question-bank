"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Upload, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-out
        ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/60 shadow-lg shadow-slate-900/50"
            : "bg-slate-950/40 backdrop-blur-xl"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Left: Brand ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            {/* Book-stack SVG logo */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 shadow-md group-hover:shadow-indigo-500/30 group-hover:border-indigo-500/60 group-hover:scale-105 transition-all duration-300 ease-out shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="2" y="13" width="16" height="3" rx="1" fill="#6366f1" />
                <rect x="3" y="9" width="14" height="3" rx="1" fill="#818cf8" />
                <rect x="4" y="5" width="12" height="3" rx="1" fill="#a5b4fc" />
                <rect x="5" y="5" width="1.5" height="3" rx="0.5" fill="#6366f1" opacity="0.6" />
                <rect x="4.5" y="9" width="1.5" height="3" rx="0.5" fill="#4f46e5" opacity="0.6" />
                <rect x="3.5" y="13" width="1.5" height="3" rx="0.5" fill="#3730a3" opacity="0.6" />
              </svg>
            </div>
            <span className="font-heading text-base font-bold tracking-tight text-slate-100 group-hover:text-indigo-400 transition-colors duration-200">
              Question Bank
            </span>
          </Link>

          {/* ── Right (Desktop): Upload Button ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/upload">
              <Button
                size="sm"
                className="
                  rounded-xl h-9 px-4
                  bg-gradient-to-r from-indigo-500 to-purple-600
                  hover:from-indigo-600 hover:to-purple-700
                  text-white font-medium text-sm
                  shadow-md shadow-indigo-500/25
                  hover:shadow-lg hover:shadow-indigo-500/40
                  hover:scale-[1.03]
                  active:scale-[0.97]
                  transition-all duration-300 ease-out
                  cursor-pointer
                "
              >
                <Upload className="w-4 h-4 mr-1.5" strokeWidth={2} />
                Upload Question
              </Button>
            </Link>
          </div>

          {/* ── Mobile: Hamburger ── */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open menu"
              className="
                flex items-center justify-center
                w-11 h-11 rounded-xl
                bg-slate-800/60
                border border-slate-700/50
                transition-all duration-200
                cursor-pointer
              "
            >
              {mobileOpen ? (
                <X className="w-4 h-4 text-slate-300" strokeWidth={2} />
              ) : (
                <Menu className="w-4 h-4 text-slate-300" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <div
          className={`
            md:hidden overflow-hidden
            transition-all duration-300 ease-out
            ${mobileOpen ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0"}
          `}
        >
          <div className="flex flex-col gap-3 pt-2">
            <Link href="/upload" onClick={() => setMobileOpen(false)}>
              <Button
                className="
                  w-full rounded-xl h-11
                  bg-gradient-to-r from-indigo-500 to-purple-600
                  hover:from-indigo-600 hover:to-purple-700
                  text-white font-medium text-sm
                  cursor-pointer
                "
              >
                <Upload className="w-4 h-4 mr-1.5" strokeWidth={2} />
                Upload Question
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
