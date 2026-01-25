import React from "react";
import { GlassCard } from "../components/layout/GlassCard";
import { Home, Search, BookOpen } from "lucide-react";

interface NotFoundProps {
  onNavigate: (page: string) => void;
}

export function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <GlassCard className="max-w-2xl w-full text-center space-y-6 p-8 md:p-12">
        {/* 404 Number with glowing effect */}
        <div className="relative">
          <h1 className="text-[120px] md:text-[180px] font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 leading-none">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-30">
            <h1 className="text-[120px] md:text-[180px] font-cinzel font-bold text-amber-400 leading-none">
              404
            </h1>
          </div>
        </div>

        {/* Hindi/Sanskrit Message */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-tiro text-amber-100">
            पृष्ठ नहीं मिला
          </h2>
          <p className="text-lg md:text-xl font-tiro text-slate-300">
            क्षमा करें, यह पृष्ठ उपलब्ध नहीं है
          </p>
        </div>

        {/* English Message */}
        <p className="text-slate-400 font-gotu">
          The page you're looking for seems to have wandered into the cosmic void.
        </p>

        {/* Decorative Quote */}
        <div className="py-6 px-4">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mb-4" />
          <p className="text-sm font-tiro text-amber-200/70 italic break-words">
            "सम्यग्दर्शनज्ञानचारित्राणि मोक्षमार्गः"
          </p>
          <p className="text-xs font-gotu text-slate-500 mt-2 break-words">
            Right faith, right knowledge, and right conduct lead to liberation
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-4" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <button
            onClick={() => onNavigate("landing")}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/30 hover:border-amber-400/50 text-amber-100 font-gotu transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>गृह पृष्ठ</span>
          </button>

          <button
            onClick={() => onNavigate("sadhana")}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-500/30 hover:border-purple-400/50 text-purple-100 font-gotu transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>साधना</span>
          </button>

          <button
            onClick={() => onNavigate("library")}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-500/30 hover:border-blue-400/50 text-blue-100 font-gotu transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>ग्रंथालय</span>
          </button>
        </div>

        {/* Floating particles decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-2 h-2 bg-amber-400/30 rounded-full animate-pulse" />
          <div className="absolute top-20 right-16 w-1 h-1 bg-purple-400/30 rounded-full animate-pulse delay-300" />
          <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-pulse delay-700" />
          <div className="absolute bottom-24 right-12 w-2 h-2 bg-amber-400/20 rounded-full animate-pulse delay-500" />
        </div>
      </GlassCard>
    </div>
  );
}