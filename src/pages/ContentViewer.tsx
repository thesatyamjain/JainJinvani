import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { TiltCard } from '../components/layout/TiltCard';
import {
  Share2,
  BookOpen,
  List,
  Loader2,
  Type,
  Sparkles,
  Scroll,
  Check,
  FileEdit,
  Volume2,
} from 'lucide-react';
import { getContentByIdAsync } from '../lib/bridge';
import { ContentItem } from '../data/contentData';
import { addFavorite, removeFavorite, isFavorite, addRecentRead } from '../lib/storage';
import { getCanonicalShareUrl } from '../utils/urlHelper';
import { updateContentSeo } from '../utils/seoHelper';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { FeedbackModal } from '../components/features/FeedbackModal';
import { requestScreenWakeLock, releaseScreenWakeLock } from '../utils/pwaManager';
import { AudioPlayer } from '../components/features/AudioPlayer';
import { getContentAudioTrack } from '../config/media';

interface ContentViewerProps {
  onBack: () => void;
  id?: string;
  title?: string;
  type?: string;
}

// 1. HTML View (For History, Vidhi, etc.)
const HtmlView = ({ content, fontSize }: { content: string; fontSize: number }) => {
  return (
    <GlassCard variant="gilded" tilt={{ maxTilt: 3, glareMaxOpacity: 0.08, glareColor: 'gold' }} className="p-6 sm:p-10 md:p-12 min-h-full">
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
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
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
  vrat: '१०५ व्रत एवं उद्यापन',
  '105-vrat': '१०५ व्रत एवं उद्यापन',
  'vrat-vidhi': '१०५ व्रत एवं उद्यापन',
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
  let meanings = Array.isArray(rawMeaning)
    ? rawMeaning.map(stripHtml).filter(Boolean)
    : [stripHtml(rawMeaning)].filter(Boolean);

  let sectionTitle = '';
  if (v.title && typeof v.title === 'string' && !v.title.includes('http')) {
    sectionTitle = stripHtml(v.title);
  } else if (v.heading && typeof v.heading === 'string') {
    sectionTitle = stripHtml(v.heading);
  }

  // Extract <div class="shloka-title"> or other title classes from raw HTML
  let number = v.number;
  const secMatch = rawText.match(/<div class=["'](?:shloka-title|section-title|reflection-title|heading|title)["']>([\s\S]*?)<\/div>/i);
  if (secMatch) {
    const titleText = stripHtml(secMatch[1]);
    rawText = rawText.replace(secMatch[0], '').trim();
    const numMatch = titleText.match(/^॥?\s*([०-९\d]+)\s*॥?$/);
    if (numMatch && (number === undefined || number === null)) {
      number = numMatch[1];
    } else if (!sectionTitle) {
      sectionTitle = titleText;
    }
  } else if (!sectionTitle) {
    const cleanRaw = stripHtml(rawText);
    if (/^\s*॥\s*[^॥\n]+\s*॥\s*$/.test(cleanRaw) && cleanRaw.length < 60) {
      sectionTitle = cleanRaw;
      rawText = '';
    }
  }

  // Extract <div class="hindi-meaning"> or similar meaning blocks from raw HTML if meanings is empty
  if (meanings.length === 0) {
    const meaningMatch = rawText.match(/<div class=["'](?:hindi-meaning|meaning|translation|explanation)["']>([\s\S]*?)<\/div>/i);
    if (meaningMatch) {
      const extractedMeaning = stripHtml(meaningMatch[1]);
      if (extractedMeaning) {
        meanings = [extractedMeaning];
      }
      rawText = rawText.replace(meaningMatch[0], '').trim();
    }
  }

  // Check if v.number is actually a section title like "॥ मूल महामंत्र ॥"
  let numberDisplay: string | null = null;
  if (typeof number === 'string' && /॥\s*[^\d०-९॥\s]+\s*॥/.test(number)) {
    if (!sectionTitle) {
      sectionTitle = number.replace(/[॥]/g, '').trim();
    }
    number = null;
  } else if (number !== undefined && number !== null) {
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
    const isTagLength = rawClean.length <= 35 && !/[।॥|,;]/.test(rawClean);
    const isExplicitTag =
      isTagLength &&
      (/^\s*\(?\s*(दोहा|सोरठा|चौपाई|पद्धति\s*छंद|पद्धरी\s*छंद|रोला\s*छंद|शंभू\s*छंद|गीता\s*छंद|मत्तगयंद|कुसुमल\s*छंद|भुजंगप्रयात|तोमर\s*छंद|अड़िल्ल|स्रग्धरा|शार्दूलविक्रीड़ित|मालिनी|अनुष्टुप्|वसंततिलका|इंद्रवज्रा|उपजाति|उपेंद्रवज्रा|घनाक्षरी|सवैया|छंद(?:\s*[-:]?\s*[\u0900-\u097F\w]+)?|जल|चंदन|चन्दन|अक्षत|पुष्प|नैवेद्य|नैवेद्य\s*\(Offering\)|दीप|धूप|फल|अर्घ्य|अर्घ|महा\s*अर्घ|महा\s*अर्घ्य|पूर्णार्घ्य|जयमाला|स्थापना|आह्वानन|सन्निधिकरण|संकल्प|कलश|आरती|पं\.\s*[\u0900-\u097F\w\s.]+|जिनवाणी\s*स्तुति|अंतिम\s*दोहा|पद्य\s*\/?\s*चौपाई|पद्य|अर्घावली|(?:\S+\s+)?(?:द्वादश|बारह|सोलह\s*कारण|[^\s]+)?\s*भावना)\s*\)?\s*$/i.test(
        rawClean
      ) ||
      (/^\s*<b>\s*\(?(.*?)\)?\s*<\/b>\s*$/i.test(line) && rawClean.length < 50) ||
      (/^\s*<strong>\s*\(?(.*?)\)?\s*<\/strong>\s*$/i.test(line) && rawClean.length < 50));

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

const UnifiedVerseView = ({
  item,
  fontSize,
  onShareVerse,
}: {
  item: any;
  fontSize: number;
  onShareVerse?: (numberDisplay?: string | null, lines?: ParsedLine[], meanings?: string[]) => void;
}) => {
  const verses = item.verses || item.lyrics || [];

  return (
    <div className="space-y-6">
      {/* Rich Introduction / Fact Box if present */}
      {item.introHtml && (
        <div
          className="book-content font-gotu text-slate-200 mb-8"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.introHtml) }}
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
                tilt={{ maxTilt: 3.5, glareMaxOpacity: 0.1, glareColor: 'gold' }}
                className="p-5 sm:p-7 md:p-9 relative group hover:border-amber-400/50 transition-all duration-300 rounded-2xl sm:rounded-3xl border border-amber-500/25 shadow-[0_16px_44px_rgba(6,3,1,0.7)]"
              >
                {/* Traditional Sacred Margin Lines (हशिया) */}
                <div className="absolute left-2.5 sm:left-3.5 inset-y-4 w-[1px] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent pointer-events-none" />
                <div className="absolute right-2.5 sm:right-3.5 inset-y-4 w-[1px] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent pointer-events-none" />

                {/* Verse Header Row (only when numberDisplay exists) */}
                {parsed.numberDisplay ? (
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-amber-500/15">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-400/40 text-amber-200 font-mono text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                        {parsed.numberDisplay}
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-amber-300/80 font-gotu font-medium">
                        पद / श्लोक
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {onShareVerse && (
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          onClick={() => onShareVerse(parsed.numberDisplay, parsed.lines, parsed.meanings)}
                          className="flex items-center justify-center w-7 h-7 rounded-lg text-amber-400/60 hover:text-amber-200 hover:bg-amber-500/15 border border-transparent hover:border-amber-400/30 transition-colors cursor-pointer"
                          title="यह पद साझा करें"
                          aria-label="यह पद साझा करें"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </motion.button>
                      )}
                      <span className="text-amber-400/40 text-xs">❖</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-3 text-amber-400/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-400/30" />
                      <span>❖</span>
                    </div>
                    {onShareVerse && (
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        onClick={() => onShareVerse(null, parsed.lines, parsed.meanings)}
                        className="flex items-center justify-center w-7 h-7 rounded-lg text-amber-400/60 hover:text-amber-200 hover:bg-amber-500/15 border border-transparent hover:border-amber-400/30 transition-colors cursor-pointer"
                        title="यह भाग साझा करें"
                        aria-label="यह भाग साझा करें"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Sacred Lines & Mantras */}
                <div className="space-y-3 text-center my-3 sm:my-4 px-2 sm:px-4">
                  {parsed.lines.map((lineObj: ParsedLine, lIdx: number) => {
                    if (lineObj.type === 'tag') {
                      return (
                        <div key={lIdx} className="pt-1 pb-1">
                          <span className="inline-block px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 font-gotu text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
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
                          className="my-3.5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-600/20 to-amber-500/15 border border-amber-400/40 text-amber-100 font-notoserif font-bold text-center shadow-[inset_0_1px_10px_rgba(245,158,11,0.15)] tracking-wide leading-relaxed"
                        >
                          {lineObj.text}
                        </div>
                      );
                    }

                    return (
                      <p
                        key={lIdx}
                        style={{ fontSize: `${fontSize + 3}px` }}
                        className="font-notoserif font-bold text-amber-50/95 leading-[1.65] tracking-wide pt-0.5 pb-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                      >
                        {lineObj.text}
                      </p>
                    );
                  })}
                </div>

                {/* Meanings / Translation */}
                {parsed.meanings.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-amber-500/20 space-y-2 text-center bg-gradient-to-b from-amber-950/20 to-slate-950/40 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 md:-mx-9 md:-mb-9 p-4 sm:p-6 rounded-b-2xl sm:rounded-b-3xl">
                    <span className="text-[11px] uppercase tracking-widest text-amber-300 font-cinzel font-bold inline-flex items-center gap-2 mb-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20">
                      <span>॥</span> भावार्थ <span>॥</span>
                    </span>
                    {parsed.meanings.map((meaningLine: string, lIdx: number) => (
                      <p
                        key={lIdx}
                        style={{ fontSize: `${fontSize}px` }}
                        className="font-mukta text-slate-200/90 leading-relaxed max-w-3xl mx-auto text-sm sm:text-base font-normal"
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
    <GlassCard variant="gilded" tilt={{ maxTilt: 3, glareMaxOpacity: 0.08, glareColor: 'gold' }} className="p-6 md:p-12 min-h-full">
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
  let cleanSub = '';
  if (sub) {
    const hasDevanagari = /[\u0900-\u097F]/.test(sub);
    const isEnglishOnly = /^[A-Za-z0-9\s\-(),.'"]+$/.test(sub.trim());
    if (hasDevanagari && !isEnglishOnly) {
      cleanSub = sub.replace(/\s*\([A-Za-z\s,-]+\)/g, '').trim();
      parts.push(cleanSub);
    }
  }
  if (author) {
    const authorBase = author.replace(/(स्वामी|आचार्य|मुनि|पं\.|पंडित|श्री)/g, '').trim();
    if (!cleanSub || !cleanSub.includes(authorBase)) {
      parts.push(`रचयिता: ${author}`);
    }
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
  const [isAutoScrolling, setIsAutoScrolling] = React.useState(false);
  const [scrollSpeed, setScrollSpeed] = React.useState(1);
  const [showFeedbackModal, setShowFeedbackModal] = React.useState(false);
  const [isAudioPlayerActive, setIsAudioPlayerActive] = React.useState(false);
  const audioTrack = React.useMemo(() => getContentAudioTrack(id), [id]);
  const sectionRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
  const autoScrollRafRef = React.useRef<number | null>(null);
  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

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
          if (result) {
            updateContentSeo({
              id,
              title: result.title || title,
              subtitle: result.subtitle,
              author: result.author,
              category: type || result.category,
              description: result.description,
            });
          }
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

  // Screen Wake Lock: Keep display awake during scripture recitation
  React.useEffect(() => {
    requestScreenWakeLock();
    return () => {
      releaseScreenWakeLock();
    };
  }, [id, isAutoScrolling]);

  // Smooth Auto-Scroll Engine using requestAnimationFrame
  React.useEffect(() => {
    if (!isAutoScrolling) {
      if (autoScrollRafRef.current) cancelAnimationFrame(autoScrollRafRef.current);
      return;
    }

    const container = document.querySelector('main') || document.documentElement;
    let lastTime = performance.now();

    const scrollStep = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (container) {
        // ~35px/second at speed 1, smooth fluid reading rate
        const pixelsToScroll = (35 * scrollSpeed * delta) / 1000;
        container.scrollTop += pixelsToScroll;

        // Check if reached bottom
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 8) {
          setIsAutoScrolling(false);
          return;
        }
      }

      autoScrollRafRef.current = requestAnimationFrame(scrollStep);
    };

    autoScrollRafRef.current = requestAnimationFrame(scrollStep);

    return () => {
      if (autoScrollRafRef.current) cancelAnimationFrame(autoScrollRafRef.current);
    };
  }, [isAutoScrolling, scrollSpeed]);

  const scrollToSection = (secId: string) => {
    sectionRefs.current[secId]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFavoriteToggle = React.useCallback(() => {
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
  }, [id, isFav, data, title, type]);

  // Dynamic Dock 2-way event synchronization
  React.useEffect(() => {
    const emitReaderState = () => {
      window.dispatchEvent(
        new CustomEvent('jinvani:reader-state', {
          detail: {
            fontSize,
            isAutoScrolling,
            isFav,
            scrollSpeed,
            title: data?.title || title || '',
            id,
            hasAudio: !!audioTrack,
            isAudioActive: isAudioPlayerActive,
          },
        })
      );
    };

    emitReaderState();

    const handleToggleScroll = (e: any) => {
      if (e.detail?.speed) {
        setScrollSpeed(e.detail.speed);
      }
      setIsAutoScrolling((prev) => !prev);
    };

    const handleToggleFav = () => {
      handleFavoriteToggle();
    };

    const handleToggleAudio = () => {
      setIsAudioPlayerActive((prev) => !prev);
    };

    const handleFontSize = (e: any) => {
      if (e.detail?.mode === 'cycle') {
        const sizes = [16, 18, 20, 22, 24];
        setFontSize((prev) => {
          const nextIdx = (sizes.indexOf(prev) + 1) % sizes.length;
          return sizes[nextIdx !== -1 ? nextIdx : 1];
        });
      } else if (typeof e.detail?.delta === 'number') {
        setFontSize((prev) => Math.min(28, Math.max(14, prev + e.detail.delta)));
      }
    };

    const handleRequestState = () => emitReaderState();

    window.addEventListener('jinvani:reader-toggle-autoscroll', handleToggleScroll as EventListener);
    window.addEventListener('jinvani:reader-toggle-favorite', handleToggleFav as EventListener);
    window.addEventListener('jinvani:toggle-audio', handleToggleAudio as EventListener);
    window.addEventListener('jinvani:reader-font-size', handleFontSize as EventListener);
    window.addEventListener('jinvani:reader-share', handleShare as EventListener);
    window.addEventListener('jinvani:request-reader-state', handleRequestState as EventListener);

    return () => {
      window.removeEventListener('jinvani:reader-toggle-autoscroll', handleToggleScroll as EventListener);
      window.removeEventListener('jinvani:reader-toggle-favorite', handleToggleFav as EventListener);
      window.removeEventListener('jinvani:toggle-audio', handleToggleAudio as EventListener);
      window.removeEventListener('jinvani:reader-font-size', handleFontSize as EventListener);
      window.removeEventListener('jinvani:reader-share', handleShare as EventListener);
      window.removeEventListener('jinvani:request-reader-state', handleRequestState as EventListener);
    };
  }, [fontSize, isAutoScrolling, isFav, scrollSpeed, data, title, id, handleFavoriteToggle, audioTrack, isAudioPlayerActive]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const copyToClipboard = async (textToCopy: string, successMessage: string = 'लिंक कॉपी हो गया!') => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast(successMessage);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(successMessage);
    }
  };

  const handleShare = async () => {
    const shareTitle = data?.title || title || 'जैन जिनवाणी';
    const shareUrl = id ? getCanonicalShareUrl('viewer', { id }) : window.location.href;
    const shareText = hindiSubtitle
      ? `${shareTitle} (${hindiSubtitle})\nजैन जिनवाणी पर पढ़ें:`
      : `${shareTitle} - जैन जिनवाणी पर पढ़ें:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          copyToClipboard(shareUrl, 'लिंक कॉपी हो गया!');
        }
      }
    } else {
      copyToClipboard(shareUrl, 'लिंक कॉपी हो गया!');
    }
  };

  const handleShareVerse = (verseNumber?: string | null, lines?: ParsedLine[], meanings?: string[]) => {
    const verseText = (lines || [])
      .filter((l) => l.type !== 'tag')
      .map((l) => l.text)
      .join('\n');
    const meaningText = (meanings || []).join('\n');
    const shareTitle = data?.title || title || 'जैन जिनवाणी';
    const shareUrl = id ? getCanonicalShareUrl('viewer', { id }) : window.location.href;

    const numLabel = verseNumber ? ` [पद ${verseNumber}]` : '';
    const fullMessage = `❖ ${shareTitle}${numLabel} ❖\n\n${verseText}${
      meaningText ? `\n\n॥ भावार्थ ॥\n${meaningText}` : ''
    }\n\nसंपूर्ण पाठ पढ़ें:\n${shareUrl}`;

    const textForWebShare = `❖ ${shareTitle}${numLabel} ❖\n\n${verseText}${
      meaningText ? `\n\n॥ भावार्थ ॥\n${meaningText}` : ''
    }\n\nसंपूर्ण पाठ पढ़ें:`;

    if (navigator.share) {
      navigator.share({
        title: `${shareTitle}${numLabel}`,
        text: textForWebShare,
        url: shareUrl,
      }).catch((err: any) => {
        if (err?.name !== 'AbortError') {
          copyToClipboard(fullMessage, 'पद कॉपी हो गया!');
        }
      });
    } else {
      copyToClipboard(fullMessage, 'पद कॉपी हो गया!');
    }
  };

  const hindiSubtitle = getCleanHindiSubtitle(data?.subtitle, data?.author);
  const verseCount = data?.verses && Array.isArray(data.verses) ? data.verses.length : 0;
  const chapterCount = data?.chapters && Array.isArray(data.chapters) ? data.chapters.length : 0;

  return (
    <div className="w-full max-w-5xl mx-auto pt-14 md:pt-16 page-bottom-clearance px-3 sm:px-4 md:px-6 flex flex-col min-h-full overflow-x-hidden">
      {/* Floating In-App Feedback Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none px-4"
          >
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0b162c]/95 border border-amber-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(245,158,11,0.25)] text-amber-200 text-xs sm:text-sm font-gotu font-medium backdrop-blur-xl">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sacred Sanctum Header Card */}
      <TiltCard
        maxTilt={4}
        glareMaxOpacity={0.12}
        glareColor="gold"
        className="w-full mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-500/[0.08] via-[#081226]/85 to-slate-950/60 border border-amber-500/25 p-4 sm:p-7 md:p-8 text-center backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.6),0_0_35px_rgba(245,158,11,0.08)] overflow-hidden"
        >
        {/* Subtle Ambient Golden Rim Light & Specular Glow */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-28 bg-amber-400/12 blur-3xl pointer-events-none rounded-full" />

        {/* Top Header Metadata Badges */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap min-w-0 mb-4 sm:mb-6 w-full">
          {data?.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-semibold backdrop-blur-xl shadow-[0_0_15px_rgba(245,158,11,0.15)] font-gotu truncate">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              {CATEGORY_NAMES_HI[data.category] || data.category}
            </span>
          )}
          {verseCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-gotu backdrop-blur-md">
              <Scroll className="w-3 h-3 text-amber-400/80 shrink-0" />
              {verseCount} पद्य
            </span>
          )}
          {chapterCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-gotu backdrop-blur-md">
              <BookOpen className="w-3 h-3 text-amber-400/80 shrink-0" />
              {chapterCount} अध्याय
            </span>
          )}
          {audioTrack && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={() => setIsAudioPlayerActive((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-gotu font-bold cursor-pointer shadow-md transition-[background-color,border-color,box-shadow] ${
                isAudioPlayerActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.4)]'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
              }`}
              title="पवित्र उच्चारण व ऑडियो पाठ सुनें"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isAudioPlayerActive ? 'ऑडियो सक्रिय' : 'ऑडियो पाठ'}</span>
            </motion.button>
          )}
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => setShowFeedbackModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-200 text-xs font-gotu backdrop-blur-md cursor-pointer transition-[background-color,border-color,color]"
            title="इस पाठ में त्रुटि सुधार या सुझाव बताएं"
          >
            <FileEdit className="w-3 h-3 text-amber-400/80 shrink-0" />
            <span>सुधार बताएं</span>
          </motion.button>
        </div>

        {/* Grand Sacred Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-amber-100 to-amber-300 leading-[1.25] tracking-normal mb-2.5 sm:mb-3 drop-shadow-[0_2px_18px_rgba(245,158,11,0.25)] select-none">
          {data?.title || title || 'स्वाध्याय'}
        </h1>

        {/* Refined Subtitle & Author Meta */}
        {hindiSubtitle ? (
          <p className="text-slate-300/90 text-xs sm:text-sm md:text-base font-gotu max-w-2xl mx-auto leading-relaxed px-2">
            {hindiSubtitle}
          </p>
        ) : null}

        {/* Auspicious Mangal Filigree Divider */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 pt-1 opacity-70">
          <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-amber-400/40" />
          <span className="text-amber-400/80 text-[10px] sm:text-xs font-gotu select-none tracking-widest">
            ❖ ॐ नमः सिद्धेभ्यः ❖
          </span>
          <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-amber-400/40" />
        </div>
      </motion.div>
      </TiltCard>

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
              <UnifiedVerseView item={data} fontSize={fontSize} onShareVerse={handleShareVerse} />
            ) : data.chapters ? (
              <ArticleView data={data} sectionRefs={sectionRefs} fontSize={fontSize} />
            ) : (
              <div className="text-center text-slate-400 py-16">प्रारूप समर्थित नहीं है</div>
            )}

            {/* Reader Footer Contribution Prompt */}
            <div className="pt-8 pb-4 text-center">
              <TiltCard
                maxTilt={5}
                glareMaxOpacity={0.12}
                glareColor="gold"
                className="inline-block max-w-md w-full rounded-2xl"
              >
                <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-[#0c1222]/80 border border-amber-500/25 w-full shadow-lg">
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-xs font-bold text-amber-200 font-notoserif">क्या इस पाठ में कोई अशुद्धि मिली?</div>
                    <div className="text-[11px] text-slate-300/80 font-gotu">शुद्ध जिनवाणी संवर्धन हेतु हमें सूचित करें।</div>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    onClick={() => setShowFeedbackModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-gotu font-semibold shrink-0 cursor-pointer transition-colors"
                  >
                    सुधार बताएं →
                  </motion.button>
                </div>
              </TiltCard>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-white/30" />
            </div>
            <h1 className="text-3xl md:text-5xl font-rozha text-white mb-4">
              {title || 'सामग्री उपलब्ध नहीं है'}
            </h1>
            <p className="text-slate-400 font-gotu text-base mb-6">यह रचना अभी उपलब्ध नहीं है अथवा लिंक अधूरा है।</p>
            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={onBack}
              className="px-6 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-sm font-gotu font-semibold shadow-md cursor-pointer transition-[background-color,border-color,box-shadow]"
            >
              ← वापस जाएँ
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Feedback Modal pre-filled with this scripture's name */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        defaultScriptureName={data?.title || title || ''}
      />

      {/* Floating Read-Along Audio Player */}
      <AnimatePresence>
        {isAudioPlayerActive && audioTrack && (
          <AudioPlayer
            track={audioTrack}
            onClose={() => setIsAudioPlayerActive(false)}
            autoPlay={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
