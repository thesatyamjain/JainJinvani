import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ChevronLeft,
  Share2,
  Bookmark,
  BookOpen,
  List,
  Loader2,
  Type,
  Sparkles,
} from 'lucide-react';
import { getContentByIdAsync } from '../lib/bridge';
import { ContentItem } from '../data/contentData';
import { addFavorite, removeFavorite, isFavorite, addRecentRead } from '../lib/storage';

interface ContentViewerProps {
  onBack: () => void;
  id?: string;
  title?: string;
  type?: string;
}

// 1. HTML View (For History, Vidhi, etc.)
const HtmlView = ({ content, fontSize }: { content: string; fontSize: number }) => {
  return (
    <GlassCard variant="gilded" className="p-6 sm:p-10 md:p-12 min-h-full">
      <div
        style={{ fontSize: `${fontSize}px` }}
        className="prose prose-invert prose-lg max-w-none font-mukta text-slate-200 leading-relaxed
                   prose-headings:font-notoserif prose-headings:text-amber-200 prose-headings:mb-4
                   prose-p:mb-6 prose-strong:text-amber-300 prose-ul:list-disc prose-ul:pl-6
                   prose-li:mb-2 [&_.intro]:text-xl [&_.intro]:font-light [&_.intro]:text-white/90
                   [&_.fact-box]:grid [&_.fact-box]:grid-cols-2 [&_.fact-box]:gap-4 [&_.fact-box]:bg-amber-500/10 [&_.fact-box]:border [&_.fact-box]:border-amber-500/20 [&_.fact-box]:p-6 [&_.fact-box]:rounded-2xl [&_.fact-box]:mb-8
                   [&_.fact-item]:flex [&_.fact-item]:flex-col [&_.fact-item_strong]:text-amber-400 [&_.fact-item_strong]:text-xs [&_.fact-item_strong]:uppercase [&_.fact-item_strong]:tracking-wider
                   [&_.bio-header]:text-center [&_.bio-header]:mb-10 [&_.tirthankara-symbol]:text-6xl [&_.tirthankara-symbol]:block [&_.tirthankara-symbol]:mb-4
                   [&_.mantra-box]:bg-gradient-to-r [&_.mantra-box]:from-amber-500/15 [&_.mantra-box]:via-slate-900/60 [&_.mantra-box]:to-amber-500/15 [&_.mantra-box]:p-6 [&_.mantra-box]:rounded-2xl [&_.mantra-box]:text-center [&_.mantra-box]:border [&_.mantra-box]:border-amber-400/30 [&_.mantra-box]:my-6 [&_.mantra-box]:shadow-[0_0_20px_rgba(245,158,11,0.15)]
                   [&_.steps-grid]:grid [&_.steps-grid]:gap-6 [&_.steps-grid]:md:grid-cols-1
                   [&_.step-card]:bg-slate-900/60 [&_.step-card]:p-6 [&_.step-card]:rounded-2xl [&_.step-card]:border [&_.step-card]:border-white/10
                   [&_.step-number]:text-amber-400 [&_.step-number]:font-bold [&_.step-number]:text-xl [&_.step-number]:mb-2 [&_.step-number]:block"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </GlassCard>
  );
};

// Category translation mapping
const CATEGORY_NAMES_HI: Record<string, string> = {
  puja: 'नित्य पूजा',
  vidhan: 'महामंडल विधान',
  stotra: 'स्तोत्र संग्रह',
  arti: 'आरती संग्रह',
  aarti: 'आरती संग्रह',
  chalisa: 'चालीसा संग्रह',
  bhajan: 'भक्ति भजन',
  path: 'पाठ व स्तुति',
  shastra: 'प्रमुख शास्त्र',
  granthas: 'प्रमुख शास्त्र',
  vidhi: 'विधि',
  philosophy: 'तत्त्व ज्ञान',
  tattva: 'तत्त्व ज्ञान',
  cosmology: 'जैन भूगोल',
  bhugol: 'जैन भूगोल',
  history: 'जैन इतिहास',
  itihas: 'जैन इतिहास',
  parva: 'पर्व व उत्सव',
  sutra: 'सूत्र',
  agamas: 'मूल आगम',
  kids: 'बाल संस्कार',
};

// Helper to sanitize Devanagari text, standardize dandas, and fix encoding typos
const sanitizeDevanagari = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/र्इ/g, 'ई')
    .replace(/र्उ/g, 'उ')
    .replace(/र्ऊ/g, 'ऊ')
    .replace(/र्ए/g, 'ए')
    .replace(/र्ऐ/g, 'ऐ')
    .replace(/र्ओ/g, 'ओ')
    .replace(/र्औ/g, 'औ')
    .replace(/\|\|/g, '॥')
    .replace(/\|/g, '।');
};

// Helper to remove stray English parenthetical glosses/translations from liturgical text
const cleanEnglishAnnotations = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\s*\((?:Water|Sandalwood|Rice|Flower|Flowers|Naivedya|Sweets|Lamp|Incense|Fruit|Fruits|Arghya|Offering|Full Offering|Poorna Arghya|Mantra Japa|Nirvana Laddu|Meaning)\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

// Helper to strip HTML tags and decode entities for clean display/copy
const stripHtml = (html: string): string => {
  if (!html) return '';
  return cleanEnglishAnnotations(
    sanitizeDevanagari(
      html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim()
    )
  );
};

interface ParsedLine {
  type: 'tag' | 'mantra' | 'line';
  text: string;
}

interface ParsedVerse {
  sectionTitle?: string;
  lines: ParsedLine[];
  meanings: string[];
  number?: number | string | null;
  numberDisplay?: string | null;
}

const parseVerseData = (v: any, idx: number, category?: string): ParsedVerse => {
  let rawText = '';
  if (typeof v === 'string') {
    rawText = v;
  } else if (v.lines && Array.isArray(v.lines)) {
    rawText = v.lines.join('\n');
  } else if (v.original && v.hindi && v.original !== v.hindi) {
    const origStr = Array.isArray(v.original) ? v.original.join('\n') : String(v.original);
    const hindiStr = Array.isArray(v.hindi) ? v.hindi.join('\n') : String(v.hindi);
    rawText = `${origStr}\n${hindiStr}`;
  } else if (v.hindi) {
    rawText = Array.isArray(v.hindi) ? v.hindi.join('\n') : String(v.hindi);
  } else if (v.original) {
    rawText = Array.isArray(v.original) ? v.original.join('\n') : String(v.original);
  }

  const rawMeaning = v.meaning || v.translation || v.explanation || '';
  const meanings = Array.isArray(rawMeaning)
    ? rawMeaning.map(stripHtml).filter(Boolean)
    : [stripHtml(rawMeaning)].filter(Boolean);

  let sectionTitle = '';
  if (v.title && typeof v.title === 'string' && !v.title.includes('http')) {
    sectionTitle = stripHtml(v.title);
  } else if (v.heading && typeof v.heading === 'string') {
    sectionTitle = stripHtml(v.heading);
  }

  const secMatch = rawText.match(/<div class=["'](?:section-title|reflection-title|heading|title)["']>([\s\S]*?)<\/div>/i);
  if (secMatch) {
    if (!sectionTitle) sectionTitle = stripHtml(secMatch[1]);
    rawText = rawText.replace(secMatch[0], '').trim();
  } else if (!sectionTitle) {
    const cleanRaw = stripHtml(rawText);
    if (/^\s*॥\s*[^॥\n]+\s*॥\s*$/.test(cleanRaw) && cleanRaw.length < 60) {
      sectionTitle = cleanRaw;
      rawText = '';
    }
  }

  // Check if v.number is actually a section title like "॥ मूल महामंत्र ॥"
  let number = v.number;
  let numberDisplay: string | null = null;
  if (typeof number === 'string' && /॥\s*[^\d॥\s]+\s*॥/.test(number)) {
    if (!sectionTitle) {
      sectionTitle = number.replace(/[॥]/g, '').trim();
    }
    number = null;
  } else if (number) {
    numberDisplay = String(number).replace(/[॥\s]/g, '').trim();
    if (/^\d+$/.test(numberDisplay)) {
      numberDisplay = `#${Number(numberDisplay) < 10 ? '0' : ''}${numberDisplay}`;
    }
  } else if (category === 'stotra' || category === 'chalisa') {
    numberDisplay = `#${idx + 1 < 10 ? '0' : ''}${idx + 1}`;
  }

  // Split lines by <br> tags or newlines
  const rawLineArray = rawText
    .split(/<br\s*\/?>|\r?\n/gi)
    .map((l) => l.trim())
    .filter(Boolean);

  const lines: ParsedLine[] = [];
  for (const line of rawLineArray) {
    const cleanLine = stripHtml(line);
    if (!cleanLine) continue;

    const rawClean = cleanLine.replace(/[:：]/g, '').trim();
    const isExplicitTag =
      /^\s*\(?\s*(दोहा|सोरठा|चौपाई|पद्धति\s*छंद|पद्धरी\s*छंद|रोला\s*छंद|शंभू\s*छंद|गीता\s*छंद|मत्तगयंद|कुसुमल\s*छंद|भुजंगप्रयात|तोमर\s*छंद|अड़िल्ल|स्रग्धरा|शार्दूलविक्रीड़ित|मालिनी|अनुष्टुप्|वसंततिलका|इंद्रवज्रा|उपजाति|उपेंद्रवज्रा|घनाक्षरी|सवैया|छंद[^)]*|जल|चंदन|चन्दन|अक्षत|पुष्प|नैवेद्य|नैवेद्य\s*\(Offering\)|दीप|धूप|फल|अर्घ्य|अर्घ|महा\s*अर्घ|महा\s*अर्घ्य|पूर्णार्घ्य|जयमाला|स्थापना|आह्वानन|सन्निधिकरण|संकल्प|कलश|आरती|पं\.[^)]*|जिनवाणी\s*स्तुति|अंतिम\s*दोहा|पद्य\s*\/?\s*चौपाई|पद्य|अर्घावली|.*भावना.*)\s*\)?\s*$/i.test(
        rawClean
      ) ||
      (/^\s*<b>\s*\(?(.*?)\)?\s*<\/b>\s*$/i.test(line) && rawClean.length < 50) ||
      (/^\s*<strong>\s*\(?(.*?)\)?\s*<\/strong>\s*$/i.test(line) && rawClean.length < 50);

    if (isExplicitTag) {
      let tagText = rawClean.replace(/[()]/g, '').trim();
      lines.push({ type: 'tag', text: tagText });
      continue;
    }

    const isMantra =
      /^(ॐ|ॐ\s*ह्रीं|ॐ\s*नमो|ॐ\s*आ|ॐ\s*श्री)/.test(cleanLine) ||
      /(स्वाहा|स्वाहा।|स्वाहा\.|स्वाहा॥|नमः|नमः।|नमः॥|वषट्!|संवौषट्!|ठ:! ठ:!|ठः ठः स्थापनं|ठ: ठ: स्थापनं|निर्वपामीति\s*स्वाहा[।॥]?)$/.test(cleanLine) ||
      cleanLine.includes('निर्वपामीति स्वाहा') ||
      cleanLine.includes('अत्र अवतर अवतर') ||
      cleanLine.includes('अत्र तिष्ठ तिष्ठ');

    if (isMantra) {
      lines.push({ type: 'mantra', text: cleanLine });
      continue;
    }

    lines.push({ type: 'line', text: cleanLine });
  }

  return {
    sectionTitle,
    lines,
    meanings,
    number,
    numberDisplay,
  };
};

const UnifiedVerseView = ({ item, fontSize }: { item: any; fontSize: number }) => {
  const verses = item.verses || item.lyrics || [];

  return (
    <div className="space-y-6">
      {/* Rich Introduction / Fact Box if present */}
      {item.introHtml && (
        <div
          className="book-content font-gotu text-slate-200 mb-8"
          dangerouslySetInnerHTML={{ __html: item.introHtml }}
        />
      )}
      {verses.map((verse: any, idx: number) => {
        const parsed = parseVerseData(verse, idx, item.category);

        return (
          <React.Fragment key={idx}>
            {/* Render Section Header if present */}
            {parsed.sectionTitle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-5 text-center my-2"
              >
                <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-amber-500/15 border border-amber-400/40 backdrop-blur-md shadow-lg">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-notoserif font-bold text-amber-200 tracking-wide pt-1 pb-0.5">
                    {parsed.sectionTitle}
                  </h3>
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
              </motion.div>
            )}

            {/* Render verse card if lines or meanings exist */}
            {(parsed.lines.length > 0 || parsed.meanings.length > 0) && (
              <GlassCard
                variant="gilded"
                className="p-6 md:p-9 relative group hover:border-amber-400/40 transition-all duration-300"
              >
                {/* Verse Header Row (only when numberDisplay exists) */}
                {parsed.numberDisplay && (
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold flex items-center justify-center">
                        {parsed.numberDisplay}
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-slate-400 font-gotu">
                        पद / श्लोक
                      </span>
                    </div>
                  </div>
                )}

                {/* Sacred Lines & Mantras */}
                <div className="space-y-3.5 text-center my-4">
                  {parsed.lines.map((lineObj: ParsedLine, lIdx: number) => {
                    if (lineObj.type === 'tag') {
                      return (
                        <div key={lIdx} className="pt-1 pb-1">
                          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-gotu text-xs sm:text-sm font-semibold tracking-wide">
                            {lineObj.text}
                          </span>
                        </div>
                      );
                    }

                    if (lineObj.type === 'mantra') {
                      return (
                        <div
                          key={lIdx}
                          style={{ fontSize: `${fontSize + 1}px` }}
                          className="my-3.5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/35 text-amber-100 font-notoserif font-bold text-center shadow-inner tracking-wide leading-relaxed"
                        >
                          {lineObj.text}
                        </div>
                      );
                    }

                    return (
                      <p
                        key={lIdx}
                        style={{ fontSize: `${fontSize + 3}px` }}
                        className="font-notoserif font-semibold text-white leading-relaxed tracking-wide pt-0.5 pb-0.5"
                      >
                        {lineObj.text}
                      </p>
                    );
                  })}
                </div>

                {/* Meanings / Translation */}
                {parsed.meanings.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-amber-500/15 space-y-2 text-center bg-amber-500/[0.03] -mx-6 -mb-6 md:-mx-9 md:-mb-9 p-5 rounded-b-2xl">
                    <span className="text-[11px] uppercase tracking-widest text-amber-300/70 font-cinzel font-bold block mb-1">
                      भावार्थ
                    </span>
                    {parsed.meanings.map((meaningLine: string, lIdx: number) => (
                      <p
                        key={lIdx}
                        style={{ fontSize: `${fontSize}px` }}
                        className="font-mukta text-slate-200 leading-relaxed max-w-3xl mx-auto"
                      >
                        {meaningLine}
                      </p>
                    ))}
                  </div>
                )}
              </GlassCard>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// 3. Article View (For Grantha Chapters)
const ArticleView = ({
  data,
  sectionRefs,
  fontSize,
}: {
  data: ContentItem;
  sectionRefs: any;
  fontSize: number;
}) => {
  if (!data.chapters) return null;
  return (
    <GlassCard variant="gilded" className="p-6 md:p-12 min-h-full">
      <div className="max-w-3xl mx-auto space-y-12 text-slate-200 leading-relaxed font-mukta">
        {data.chapters.map((chapter: any, chapterIdx: number) => (
          <div
            key={chapterIdx}
            ref={(el) => {
              sectionRefs.current[`chapter-${chapterIdx}`] = el;
            }}
            className="scroll-mt-20"
          >
            <h3 className="text-2xl md:text-3xl font-notoserif text-amber-200 mb-6 border-l-4 border-amber-500 pl-4 py-1">
              {chapter.title}
            </h3>
            <div className="space-y-6">
              {chapter.content.map((para: string, pIdx: number) =>
                para === '' ? (
                  <div key={pIdx} className="h-4" />
                ) : (
                  <p
                    key={pIdx}
                    style={{ fontSize: `${fontSize}px` }}
                    className="leading-loose text-justify text-slate-200"
                  >
                    {para}
                  </p>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// Helper to get clean Hindi subtitle and author without English artifacts
const getCleanHindiSubtitle = (sub?: string, author?: string): string => {
  const parts: string[] = [];
  if (sub) {
    const hasDevanagari = /[\u0900-\u097F]/.test(sub);
    const isEnglishOnly = /^[A-Za-z0-9\s\-(),.'"]+$/.test(sub.trim());
    if (hasDevanagari && !isEnglishOnly) {
      parts.push(sub.replace(/\s*\([A-Za-z\s,-]+\)/g, '').trim());
    }
  }
  if (author) {
    parts.push(`रचयिता: ${author}`);
  }
  return parts.filter(Boolean).join(' • ');
};

export const ContentViewer = ({
  onBack,
  id,
  type,
  title,
}: {
  onBack: () => void;
  id?: string;
  type?: string;
  title?: string;
}) => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [fontSize, setFontSize] = React.useState(18);
  const [isFav, setIsFav] = React.useState(false);
  const sectionRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  React.useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const result = await getContentByIdAsync(id);
        if (isMounted) {
          setData(result);
          if (result?.title || title) {
            addRecentRead({
              id,
              title: result?.title || title || '',
              type: type || result?.category || 'stotra',
            });
          }
        }
      } catch (err) {
        console.error('Error loading content:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadContent();
    return () => { isMounted = false; };
  }, [id]);

  React.useEffect(() => {
    if (id) setIsFav(isFavorite(id));
  }, [id]);

  const scrollToSection = (secId: string) => {
    sectionRefs.current[secId]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFavoriteToggle = () => {
    if (!id) return;
    if (isFav) {
      removeFavorite(id);
      setIsFav(false);
    } else {
      addFavorite({
        id,
        title: data?.title || title || 'Content',
        type: type || data?.category || 'scripture',
      });
      setIsFav(true);
    }
  };

  const handleShare = async () => {
    const shareTitle = data?.title || title || 'Jain Jinvani';
    const shareData = { title: shareTitle, text: `${shareTitle} - जैन जिनवाणी`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const hindiSubtitle = getCleanHindiSubtitle(data?.subtitle, data?.author);

  return (
    <div className="w-full max-w-5xl mx-auto pt-14 md:pt-16 pb-36 px-3 sm:px-4 md:px-6 flex flex-col min-h-full overflow-x-hidden">
      {/* Unified Top Header Bar - 100% Single-Row & Responsive across Mobile & Desktop */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-8"
      >
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/40 transition-all backdrop-blur-xl shrink-0 group shadow-md"
            title="वापस जाएँ"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300 group-hover:text-amber-200 transition-colors" />
          </button>
          
          <div className="min-w-0 flex-1 py-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-notoserif font-bold text-white truncate pt-2 pb-1.5 leading-[1.35] drop-shadow-[0_2px_10px_rgba(251,191,36,0.15)]">
                {data?.title || title || 'स्वाध्याय'}
              </h1>
              {data?.category && (
                <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] sm:text-xs font-bold text-amber-200 shrink-0 font-cinzel">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  {CATEGORY_NAMES_HI[data.category] || data.category}
                </span>
              )}
            </div>
            {hindiSubtitle ? (
              <p className="text-slate-400 text-[11px] sm:text-xs md:text-sm font-gotu truncate mt-0.5">
                {hindiSubtitle}
              </p>
            ) : null}
          </div>
        </div>

        {/* Right: Action Controls (Font Size, Favorite, Share) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center bg-slate-900/80 border border-white/10 rounded-xl sm:rounded-2xl p-0.5 sm:p-1.5 backdrop-blur-xl shadow-inner">
            <button
              onClick={() => setFontSize((f) => Math.max(14, f - 2))}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs text-slate-300 hover:text-white font-mono hover:bg-white/10 rounded-lg sm:rounded-xl transition-all"
              title="अक्षर छोटा करें"
            >
              A-
            </button>
            <span className="text-[11px] sm:text-xs text-amber-300 font-mono font-semibold px-1 sm:px-2">{fontSize}</span>
            <button
              onClick={() => setFontSize((f) => Math.min(26, f + 2))}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs text-slate-300 hover:text-white font-mono hover:bg-white/10 rounded-lg sm:rounded-xl transition-all"
              title="अक्षर बड़ा करें"
            >
              A+
            </button>
          </div>

          <button
            onClick={handleFavoriteToggle}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-center backdrop-blur-xl group shrink-0 ${
              isFav
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-amber-500/20 hover:border-amber-500/40'
            }`}
            title="संग्रह में जोड़ें"
          >
            <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isFav ? 'fill-current text-rose-300' : 'group-hover:text-amber-200'}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-center backdrop-blur-xl group shrink-0"
            title="साझा करें"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-amber-200 transition-colors" />
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
            <p className="text-amber-200/70 font-gotu">सामग्री लोड हो रही है...</p>
          </div>
        ) : data ? (
          <div className="w-full space-y-6">
            {/* Table of Contents for Articles with Chapters */}
            {data.chapters && data.chapters.length > 0 && (
              <GlassCard variant="gilded" className="p-6 mb-8">
                <div className="flex items-center gap-2 mb-4 text-amber-300">
                  <List className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] font-cinzel">
                    विषय सूची (अध्याय)
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {data.chapters.map((chapter: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(`chapter-${idx}`)}
                      className="text-left text-slate-300 hover:text-amber-200 text-sm font-gotu p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 transition-all truncate"
                    >
                      {chapter.title}
                    </button>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Body Content */}
            {data.type === 'html' ? (
              <HtmlView content={data.content} fontSize={fontSize} />
            ) : data.type === 'structured' ||
              data.type === 'stotra' ||
              data.verses ||
              data.lyrics ? (
              <UnifiedVerseView item={data} fontSize={fontSize} />
            ) : data.chapters ? (
              <ArticleView data={data} sectionRefs={sectionRefs} fontSize={fontSize} />
            ) : (
              <div className="text-center text-slate-400 py-16">प्रारूप समर्थित नहीं है</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-white/30" />
            </div>
            <h1 className="text-3xl md:text-5xl font-rozha text-white mb-4">
              {title || 'सामग्री उपलब्ध नहीं है'}
            </h1>
            <p className="text-slate-400 font-gotu text-base">यह रचना अभी उपलब्ध नहीं है।</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
