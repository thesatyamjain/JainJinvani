import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ChevronLeft, Share2, Bookmark, BookOpen, List, Copy, Loader2 } from 'lucide-react';
import { getContentByIdAsync, getContentById } from '../lib/bridge';
import { ContentItem } from '../data/contentData';

interface ContentViewerProps {
  onBack: () => void;
  id?: string;
  title?: string;
  type?: string;
}

// ... helper views remain the same ...

export const ContentViewer = ({ onBack, id, title, type }: ContentViewerProps) => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const isDemoArticle = !id || id === 'anekantavada' || id === 'tattva';
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  React.useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      if (!id) {
        if (mounted) setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Try async first
        const result = await getContentByIdAsync(id);
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        console.error("Error loading content:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadContent();
    return () => { mounted = false; };
  }, [id]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full h-screen flex flex-col relative bg-[#050a14]">

      {/* Fixed Sticky Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8 shadow-2xl"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-blue-200 hover:text-white transition-all px-2 py-2 rounded-lg hover:bg-white/5 group"
        >
          <div className="p-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-gotu text-sm font-medium tracking-wide hidden md:block group-hover:text-amber-200 transition-colors">वापस</span>
        </button>

        {/* Optional: Show Title in Header when scrolled (omitted for now to keep clean) */}

        <div className="flex gap-2">
          <button className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Main Content Container with Top Padding for Header */}
      <div className="flex-1 overflow-hidden pt-16 flex w-full max-w-7xl mx-auto px-4 md:px-6">

        {(isDemoArticle || (data?.chapters && data.chapters.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-72 flex-shrink-0 overflow-y-auto px-2 py-6 custom-scrollbar"
          >
            <GlassCard className="p-6 h-full border-none bg-white/5 sticky top-6">
              <div className="flex items-center gap-2 mb-6 text-blue-300">
                <List className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-cinzel">विषय सूची</h4>
              </div>
              <ul className="space-y-4 text-base font-gotu">
                {data?.chapters ? (
                  data.chapters.map((chapter: any, idx: number) => (
                    <li
                      key={idx}
                      onClick={() => scrollToSection(`chapter-${idx}`)}
                      className="text-blue-100/60 hover:text-white cursor-pointer pl-4 py-1 transition-colors border-l-2 border-transparent hover:border-amber-500"
                    >
                      {chapter.title}
                    </li>
                  ))
                ) : (
                  <>
                    <li className="text-amber-200 font-medium cursor-pointer border-l-2 border-amber-500 pl-4 py-1">भूमिका</li>
                    <li className="text-blue-100/60 hover:text-white cursor-pointer pl-4.5 py-1 transition-colors">शब्द व्युत्पत्ति</li>
                    <li className="text-blue-100/60 hover:text-white cursor-pointer pl-4.5 py-1 transition-colors">ऐतिहासिक संदर्भ</li>
                  </>
                )}
              </ul>
            </GlassCard>
          </motion.div>
        )}

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-y-auto custom-scrollbar pb-24 px-2 md:px-8"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <p className="text-blue-200/50 font-gotu">Loading content...</p>
            </div>
          ) : data ? (
            <div className="max-w-4xl mx-auto py-10">
              {/* Header Info */}
              <div className="text-center mb-12">
                {data.category && (
                  <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-blue-200/80 shadow-lg backdrop-blur-sm">
                    {data.category}
                  </div>
                )}
                <h1 className="text-4xl md:text-6xl font-rozha text-white mb-4 leading-tight text-shadow-lg">
                  {data.title}
                </h1>
                {data.subtitle && (
                  <h2 className="text-xl md:text-2xl font-gotu text-blue-200/80 mb-2 font-light">{data.subtitle}</h2>
                )}
                {data.author && (
                  <span className="text-amber-400 font-rozha text-lg block opacity-80 mt-4">रचयिता: {data.author}</span>
                )}
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-8 rounded-full"></div>
              </div>

              {data.type === 'html' ? (
                <HtmlView content={data.content} />
              ) : (data.type === 'structured' || data.type === 'stotra' || data.verses || data.lyrics) ? (
                <UnifiedVerseView item={data} />
              ) : data.chapters ? (
                <ArticleView data={data} sectionRefs={sectionRefs} />
              ) : (
                <div className="text-center text-white/50">Format not supported</div>
              )}
            </div>
          ) : isDemoArticle ? (
            <GlassCard className="p-8 md:p-16 min-h-full flex items-center justify-center">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl text-white">Demonstration Mode</h1>
                <p className="text-blue-200 mt-4">Select content from the menu.</p>
              </div>
            </GlassCard>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8">
                <BookOpen className="w-10 h-10 text-white/30" />
              </div>
              <h1 className="text-4xl md:text-6xl font-rozha text-white mb-6">
                {title || "Content Not Found"}
              </h1>
              <p className="text-blue-200/50 font-gotu text-lg">Content unavailable.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
