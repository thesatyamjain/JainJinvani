import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { ChevronLeft, Share2, Bookmark, BookOpen, List, Copy } from 'lucide-react';
import { getContentById } from '../data/jinvani-bridge';
import { ContentItem } from '../data/contentData';

interface ContentViewerProps {
  onBack: () => void;
  id?: string;
  title?: string;
  type?: string;
}

// 1. HTML View (For History, Vidhi, etc.)
const HtmlView = ({ content }: { content: string }) => {
  return (
    <GlassCard className="p-8 md:p-12 min-h-full">
      <div
        className="prose prose-invert prose-lg max-w-none font-gotu text-blue-50/90 leading-loose
                   prose-headings:font-rozha prose-headings:text-amber-200 prose-headings:mb-4
                   prose-p:mb-6 prose-strong:text-amber-100 prose-ul:list-disc prose-ul:pl-6
                   prose-li:mb-2 [&_.intro]:text-xl [&_.intro]:font-light [&_.intro]:text-white/80
                   [&_.fact-box]:grid [&_.fact-box]:grid-cols-2 [&_.fact-box]:gap-4 [&_.fact-box]:bg-white/5 [&_.fact-box]:p-6 [&_.fact-box]:rounded-xl [&_.fact-box]:mb-8
                   [&_.fact-item]:flex [&_.fact-item]:flex-col [&_.fact-item_strong]:text-amber-400/80 [&_.fact-item_strong]:text-sm [&_.fact-item_strong]:uppercase
                   [&_.bio-header]:text-center [&_.bio-header]:mb-10 [&_.tirthankara-symbol]:text-6xl [&_.tirthankara-symbol]:block [&_.tirthankara-symbol]:mb-4
                   [&_.mantra-box]:bg-amber-500/10 [&_.mantra-box]:p-6 [&_.mantra-box]:rounded-lg [&_.mantra-box]:text-center [&_.mantra-box]:border [&_.mantra-box]:border-amber-500/20 [&_.mantra-box]:my-6
                   [&_.steps-grid]:grid [&_.steps-grid]:gap-6 [&_.steps-grid]:md:grid-cols-1
                   [&_.step-card]:bg-black/20 [&_.step-card]:p-6 [&_.step-card]:rounded-xl [&_.step-card]:border [&_.step-card]:border-white/5
                   [&_.step-number]:text-amber-500 [&_.step-number]:font-bold [&_.step-number]:text-xl [&_.step-number]:mb-2 [&_.step-number]:block"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </GlassCard>
  );
};

// 2. Unified Verse/Lyrics View (For Stotra, Aarti, Chalisa, Bhajan)
const UnifiedVerseView = ({ item }: { item: any }) => {
  const verses = item.verses || item.lyrics || [];

  // Helper to normalize verse content
  const getVerseContent = (v: any) => {
    if (typeof v === 'string') return [v];
    if (v.lines && Array.isArray(v.lines)) return v.lines;
    if (v.hindi) return v.hindi.split('\n');
    if (v.original) return v.original;
    return [];
  };

  const getTranslation = (v: any) => {
    if (v.meaning) return [v.meaning];
    if (v.translation) return v.translation;
    if (v.explanation) return [v.explanation];
    return [];
  };

  return (
    <div className="space-y-6">
      {verses.map((verse: any, idx: number) => {
        const lines = getVerseContent(verse);
        const meanings = getTranslation(verse);
        const number = verse.number || (item.category === 'stotra' ? idx + 1 : null);

        if (lines.length === 0 && meanings.length === 0) return null;

        return (
          <GlassCard key={idx} className="p-6 md:p-8 border-white/10 hover:border-amber-500/30 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              {number && (
                <span className="text-amber-500/50 font-gotu text-sm font-bold border border-amber-500/20 px-2 py-0.5 rounded">
                  {number}
                </span>
              )}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                <button className="text-blue-200 hover:text-white"><Copy className="w-4 h-4" /></button>
              </div>
            </div>

            <div className={`mb-6 space-y-2 text-center`}>
              {lines.map((line: string, lIdx: number) => (
                <p key={lIdx} className="text-xl md:text-2xl font-rozha text-white leading-relaxed">
                  {line}
                </p>
              ))}
            </div>

            {meanings.length > 0 && (
              <div className="pt-6 border-t border-white/5 space-y-2 text-center">
                {meanings.map((line: string, lIdx: number) => (
                  <p key={lIdx} className="text-lg font-gotu text-blue-100/80 leading-loose">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
};

// 3. Legacy Article View
const ArticleView = ({ data, sectionRefs }: { data: ContentItem, sectionRefs: any }) => {
  if (!data.chapters) return null;
  return (
    <GlassCard className="p-8 md:p-16 min-h-full">
      <div className="max-w-3xl mx-auto space-y-12 text-blue-50 leading-loose text-xl font-tiro">
        {data.chapters.map((chapter: any, chapterIdx: number) => (
          <div
            key={chapterIdx}
            ref={(el) => { sectionRefs.current[`chapter-${chapterIdx}`] = el; }}
            className="scroll-mt-6"
          >
            <h3 className="text-3xl font-rozha text-amber-200 mb-6 border-l-4 border-amber-500 pl-4">
              {chapter.title}
            </h3>
            <div className="space-y-6">
              {chapter.content.map((para: string, pIdx: number) => (
                para === "" ? <div key={pIdx} className="h-4" /> : <p key={pIdx} className="drop-shadow-md text-justify">{para}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export const ContentViewer = ({ onBack, id, title, type }: ContentViewerProps) => {
  const data = id ? getContentById(id) : undefined;
  const isDemoArticle = !id || id === 'anekantavada' || id === 'tattva';
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
          {data ? (
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
