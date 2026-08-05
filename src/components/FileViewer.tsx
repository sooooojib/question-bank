"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  ExternalLink,
  FileSpreadsheet,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

interface FileViewerProps {
  fileUrl: string;
  fileType: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

type WindowSize = "medium" | "full";

export default function FileViewer({
  fileUrl,
  fileType,
  isOpen,
  onClose,
  title = "Question Document Preview",
}: FileViewerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [windowSize, setWindowSize] = useState<WindowSize>("medium");

  const normalizedType = (fileType || "pdf").toLowerCase().trim();
  const isPdf = normalizedType === "pdf" || fileUrl.endsWith(".pdf");
  const isImage =
    ["jpg", "jpeg", "png", "webp", "image"].includes(normalizedType) ||
    /\.(jpg|jpeg|png|webp)$/i.test(fileUrl);
  const isDoc =
    ["doc", "docx", "word"].includes(normalizedType) ||
    /\.(doc|docx)$/i.test(fileUrl);

  // Derive a clean filename from the title + type
  const safeTitle = title.replace(/[^a-zA-Z0-9_\- ]/g, "").replace(/\s+/g, "_");
  const ext = isPdf ? "pdf" : isImage ? normalizedType : isDoc ? "docx" : normalizedType;
  const downloadFilename = `${safeTitle}.${ext}`;

  const badgeLabel = isPdf
    ? "PDF"
    : isImage
    ? normalizedType.toUpperCase()
    : isDoc
    ? "DOCX"
    : normalizedType.toUpperCase();

  const badgeColor = isPdf
    ? "bg-red-500/10 text-red-400 border-red-500/25"
    : isImage
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
    : isDoc
    ? "bg-blue-500/10 text-blue-400 border-blue-500/25"
    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/25";

  const HeaderIcon = isPdf
    ? FileText
    : isImage
    ? ImageIcon
    : isDoc
    ? FileSpreadsheet
    : AlertCircle;

  const sizeClasses: Record<WindowSize, string> = {
    medium: "sm:max-w-4xl max-w-4xl w-[92vw] sm:w-[85vw] h-[82vh] !max-h-[82vh]",
    full: "!max-w-[98vw] w-[98vw] h-[96vh] !max-h-[96vh]",
  };

  // ── Direct blob download (prevents opening in new tab) ──────────────────────
  async function handleDownload() {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = downloadFilename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      // Fallback: open in new tab if fetch fails (CORS etc.)
      window.open(fileUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* ── Floating Modal Dialog (hides default absolute close button) ── */}
      <DialogContent className={`${sizeClasses[windowSize]} [&>button]:hidden bg-slate-900 border border-slate-800 p-0 flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl z-[100] transition-all duration-300 ease-out`}>

        {/* ── Header Bar ─────────────────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between pl-3 sm:pl-5 pr-4 sm:pr-6 py-2.5 sm:py-3 border-b border-slate-800 bg-slate-900/95 gap-2 sm:gap-4">
          {/* Left: Icon + Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 pr-1 sm:pr-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0">
              <HeaderIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-slate-100 truncate leading-tight">
                {title}
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                Department Question Bank Archive
              </p>
            </div>
          </div>

          {/* Right: Clean flex row with Format Badge + Resize + Download + ExternalLink + Close X */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Item 1: Format Badge */}
            <span
              className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeColor}`}
            >
              {badgeLabel}
            </span>

            {/* Item 2: Window Size Switcher (Standard vs Full Screen) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setWindowSize("medium")}
                title="Standard Size"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  windowSize === "medium"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setWindowSize("full")}
                title="Full Screen"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  windowSize === "full"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Item 3: Download Button */}
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="h-9 px-3 sm:px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 sm:mr-1.5 animate-spin" />
                  <span className="hidden sm:inline">Downloading…</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline">Download</span>
                </>
              )}
            </Button>

            {/* Item 4: External Link Button */}
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" title="Open in New Tab">
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 text-xs transition-all flex items-center justify-center cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>

            {/* Item 5: Dedicated Close Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              title="Close Modal"
              className="h-9 w-9 p-0 rounded-xl border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 transition-all flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ── Preview Body (fills all remaining space) ────────────────────────── */}
        <div className="flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-slate-950">

          {/* PDF: full-area iframe */}
          {isPdf && (
            <iframe
              src={fileUrl}
              className="w-full h-full border-0 rounded-b-2xl"
              title="PDF Question Paper Viewer"
            />
          )}

          {/* Image: object-contain, centered */}
          {isImage && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={fileUrl}
                alt={title}
                className="max-w-full max-h-full object-contain mx-auto rounded-xl shadow-xl"
              />
            </div>
          )}

          {/* Word Document: centered download card */}
          {isDoc && (
            <div className="flex items-center justify-center p-6">
              <div className="max-w-sm w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-10 text-center space-y-5">
                <div className="w-20 h-20 rounded-2xl bg-blue-950/80 border border-blue-900/60 text-blue-400 mx-auto flex items-center justify-center">
                  <FileSpreadsheet className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">
                    Word Document
                  </h4>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Word documents can't be previewed in the browser. Click below to download and open in Microsoft Word or Google Docs.
                  </p>
                </div>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Downloading…
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Document
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Fallback */}
          {!isPdf && !isImage && !isDoc && (
            <div className="flex items-center justify-center p-6">
              <div className="max-w-sm w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-10 text-center space-y-5">
                <div className="w-20 h-20 rounded-2xl bg-indigo-950/80 border border-indigo-900/60 text-indigo-400 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">
                    Document Preview
                  </h4>
                  <p className="text-sm text-slate-400 mt-2">
                    This file type cannot be previewed directly.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    {isDownloading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Downloading…</>
                    ) : (
                      <><Download className="w-4 h-4 mr-2" />Download</>
                    )}
                  </Button>
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full h-11 rounded-2xl border-slate-700 text-slate-200 hover:bg-slate-800">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
