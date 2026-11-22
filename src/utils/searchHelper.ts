import { repairDevanagariUnicode } from './unicodeFixer.ts';

/**
 * Jain Jinvani Global Search Protocol (V2 - Ultra High Performance)
 * Features:
 * - Pre-indexed Inverted Token Index with microsecond lookups
 * - Bilingual Devanagari ↔ Roman / Hinglish Phonetic Normalization
 * - Multi-tier Relevance Scoring (Title > Tags > Author > Category > Description > Verses > Fuzzy)
 * - Typo-tolerant Fuzzy Search (Levenshtein distance ≤ 2) with "Did You Mean" suggestions
 * - Verse & Commentary Contextual Snippet Extractor
 * - Syntax Search Operators (@puja, @stotra, @chalisa, @shastra, @vidhan, @aarti, @bhajan, @tirthankar, kavi:, tag:)
 * - 100% Backwards Compatible with all legacy SearchOverlay & CategoryListing signatures
 */

// 1. Devanagari to English Phonetic Transliteration Map
const devanagariToEnglish: Record<string, string> = {
  // Vowels
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah',
  // Matras
  'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', 'ः': 'h',
  // Consonants
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gya', 'श्र': 'shr',
  'ड़': 'd', 'ढ़': 'dh', 'फ़': 'f', 'ज़': 'z',
  '।': ' ', '॥': ' ',
};

const HALANT = '्';

// 2. Transliterates Hindi/Devanagari text into natural Romanized English
export function transliterateHindiToEnglish(hindiText: string): string {
  if (!hindiText) return '';
  let result = '';
  const text = hindiText.trim();
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const char = text[i];
    const nextChar = i + 1 < len ? text[i + 1] : '';

    if (char === HALANT) {
      continue;
    }

    if (devanagariToEnglish[char]) {
      result += devanagariToEnglish[char];
      const isConsonant = /[\u0915-\u0939]/.test(char);
      const isNextMatraOrHalant = /[\u093E-\u094D\u0901-\u0903]/.test(nextChar);
      if (isConsonant && !isNextMatraOrHalant && nextChar !== ' ' && nextChar !== '') {
        result += 'a';
      }
    } else {
      result += char;
    }
  }

  return result.toLowerCase();
}

// 3. Common Roman / Hinglish phonetic keywords to Canonical Hindi terms
const HINGLISH_TO_DEVANAGARI_MAP: Record<string, string> = {
  bhaktamar: 'भक्तामर',
  bhaktamara: 'भक्तामर',
  namokar: 'णमोकार',
  navkar: 'णमोकार',
  namokaar: 'णमोकार',
  samaysar: 'समयसार',
  samayasar: 'समयसार',
  samaysara: 'समयसार',
  tatvarth: 'तत्त्वार्थ',
  tattvarth: 'तत्त्वार्थ',
  tattvartha: 'तत्त्वार्थ',
  chhedala: 'छहढाला',
  chhahdhala: 'छहढाला',
  chhedhala: 'छहढाला',
  pooja: 'पूजा',
  puja: 'पूजा',
  pujan: 'पूजन',
  poojan: 'पूजन',
  aarti: 'आरती',
  arti: 'आरती',
  chalisa: 'चालीसा',
  chaalisa: 'चालीसा',
  chalis: 'चालीसा',
  stotra: 'स्तोत्र',
  stotram: 'स्तोत्र',
  vidhan: 'विधान',
  vidhana: 'विधान',
  bhajan: 'भजन',
  bhavna: 'भावना',
  bhavana: 'भावना',
  meri: 'मेरी',
  samayik: 'सामायिक',
  saamayik: 'सामायिक',
  dravyasangrah: 'द्रव्यसंग्रह',
  kalyanmandir: 'कल्याणमंदिर',
  kalyan: 'कल्याण',
  mandir: 'मंदिर',
  shantidhara: 'शांतिधारा',
  shanti: 'शांति',
  dhara: 'धारा',
  dashlakshan: 'दशलक्षण',
  daslakshan: 'दशलक्षण',
  ashtanhika: 'अष्टान्हिका',
  parshvanath: 'पार्श्वनाथ',
  parasnath: 'पार्श्वनाथ',
  parshwanath: 'पार्श्वनाथ',
  adinath: 'आदिनाथ',
  rishabhdev: 'आदिनाथ',
  rishabhnath: 'आदिनाथ',
  mahavir: 'महावीर',
  mahaveer: 'महावीर',
  vardhaman: 'महावीर',
  bahubali: 'बाहुबली',
  gomateshwar: 'बाहुबली',
  tirthankar: 'तीर्थंकर',
  tirthankara: 'तीर्थंकर',
  panchang: 'पंचांग',
  abhishek: 'अभिषेक',
  kundkund: 'कुन्दकुन्द',
  todarmal: 'टोडरमल',
  daulatram: 'दौलतराम',
  bhagchand: 'भागचंद',
  dyanatray: 'द्यानतराय',
  padmanandi: 'पद्मनन्दि',
  amritchandra: 'अमृतचन्द्र',
  siddha: 'सिद्ध',
  moksha: 'मोक्ष',
};

// 4. Devanagari Orthographic Normalizer
export function normalizeDevanagari(text: string): string {
  if (!text) return '';
  let s = repairDevanagariUnicode(text).trim();

  // Replace Chandrabindu (ँ) with Anusvara (ं)
  s = s.replace(/\u0901/g, '\u0902');

  // Normalize nasal + stop consonant conjuncts to Anusvara (ं)
  s = s.replace(/ङ्(?=[कखगघ])/g, 'ं');
  s = s.replace(/ञ्(?=[चछजझ])/g, 'ं');
  s = s.replace(/ण्(?=[टठडढ])/g, 'ं');
  s = s.replace(/न्(?=[तथदधन])/g, 'ं');
  s = s.replace(/म्(?=[पफबभम])/g, 'ं');

  // Remove Nukta mark (़)
  s = s.replace(/\u093C/g, '');

  // Normalize common Jain Hindi spelling variants & typos
  s = s.replace(/भक्तांबर/g, 'भक्तामर');
  s = s.replace(/तत्वार्थ/g, 'तत्त्वार्थ');
  s = s.replace(/नवकार/g, 'णमोकार');
  s = s.replace(/नमोकार/g, 'णमोकार');
  s = s.replace(/छेढाला|छ ढाला|छह ढाला|छहढाला/g, 'छहढाला');
  s = s.replace(/पारसनाथ/g, 'पार्श्वनाथ');
  s = s.replace(/ऋषभदेव|ऋषभनाथ/g, 'आदिनाथ');
  s = s.replace(/वर्धमान/g, 'महावीर');
  s = s.replace(/कल्याण\s*मंदिर/g, 'कल्याणमंदिर');
  s = s.replace(/समय\s*सार/g, 'समयसार');
  s = s.replace(/रत्नकरंड/g, 'रत्नकरण्ड');
  s = s.replace(/द्रव्य\s*संग्रह/g, 'द्रव्यसंग्रह');
  s = s.replace(/गोमटेश्वर/g, 'बाहुबली');
  s = s.replace(/शान्ति/g, 'शांति');
  s = s.replace(/शांति\s*धारा/g, 'शांतिधारा');
  s = s.replace(/दश\s*लक्षण|दस\s*लक्षण/g, 'दशलक्षण');
  s = s.replace(/अष्टांहिका|अष्टाह्निका/g, 'अष्टान्हिका');
  s = s.replace(/स्त्रोत/g, 'स्तोत्र'); // Common Indian keyboard typo
  s = s.replace(/चालीसा|चालिसा/g, 'चालीसा');
  s = s.replace(/आरती|आरति/g, 'आरती');
  s = s.replace(/पुजा/g, 'पूजा');

  // Clean punctuation & danda
  s = s.replace(/[।॥,.:;!?"'()[\]{}_-]/g, ' ');
  s = s.replace(/\s+/g, ' ');

  return s.trim();
}

// 5. Phonetic Normalizer for English & Hinglish queries
export function normalizePhonetic(text: string): string {
  if (!text) return '';
  let s = text.toLowerCase().trim();

  // Common Jain alias replacements
  s = s.replace(/navkar|navkaar/g, 'namokar');
  s = s.replace(/namokaar/g, 'namokar');
  s = s.replace(/pooja/g, 'puja');
  s = s.replace(/poojan/g, 'pujan');
  s = s.replace(/arti/g, 'aarti');
  s = s.replace(/chaalisa|chalis/g, 'chalisa');
  s = s.replace(/bhavana/g, 'bhavna');
  s = s.replace(/bhaktambar/g, 'bhaktamar');
  s = s.replace(/parasnath|parshwanath|parshvanatha/g, 'parshvanath');
  s = s.replace(/rishabhdev|rishabhnath/g, 'adinath');
  s = s.replace(/mahaveer|vardhaman/g, 'mahavir');
  s = s.replace(/chhahdhala|chhe\s*dhala/g, 'chhedala');
  s = s.replace(/tatvarth|tattvartha|tatwarth/g, 'tattvarth');
  s = s.replace(/samaysara|samayasar|samay\s*sar/g, 'samaysar');
  s = s.replace(/saamayik/g, 'samayik');
  s = s.replace(/shikharji/g, 'sammed shikhar');
  s = s.replace(/kalyan\s*mandir/g, 'kalyanmandir');
  s = s.replace(/ashtadravya/g, 'puja');
  s = s.replace(/bahubali/g, 'gomateshwar');
  s = s.replace(/sallekhana/g, 'samadhi maran');

  // Phonetic sound normalization
  s = s.replace(/ee|ii|iy/g, 'i');
  s = s.replace(/oo|uu/g, 'u');
  s = s.replace(/aa/g, 'a');
  s = s.replace(/shh|sh/g, 's');
  s = s.replace(/chh|ch/g, 'ch');
  s = s.replace(/ph/g, 'f');
  s = s.replace(/w/g, 'v');
  s = s.replace(/z/g, 'j');
  s = s.replace(/dh/g, 'd');
  s = s.replace(/th/g, 't');
  s = s.replace(/bh/g, 'b');
  s = s.replace(/kh/g, 'k');
  s = s.replace(/gh/g, 'g');

  // Consolidate repeated letters
  s = s.replace(/([a-z])\1+/g, '$1');

  return s;
}

// 6. Fast Levenshtein Distance for Typo Tolerance
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  if (Math.abs(a.length - b.length) > 2) return Math.abs(a.length - b.length);

  const dp: number[] = [];
  for (let j = 0; j <= b.length; j++) dp[j] = j;

  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(
        dp[j] + 1,       // deletion
        dp[j - 1] + 1,   // insertion
        prev + cost      // substitution
      );
      prev = temp;
    }
  }

  return dp[b.length];
}

export interface SearchableItem {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  author?: string;
  badge?: string;
  tags?: string[];
  content?: string;
  verses?: any[];
  lyrics?: any[];
  chapters?: any[];
  introHtml?: string;
  [key: string]: any;
}

export interface ParsedSearchQuery {
  raw: string;
  cleanText: string;
  categoryFilter?: string;
  authorFilter?: string;
  tagFilter?: string;
  tokens: string[];
  devanagariTokens: string[];
  transliteratedTokens: string[];
  phoneticTokens: string[];
}

export interface SearchSnippet {
  matchedField: 'title' | 'author' | 'description' | 'verse' | 'lyrics' | 'tag' | 'content';
  snippetText: string;
  highlightIndices?: [number, number];
}

export interface SearchResultItem<T = SearchableItem> {
  item: T;
  score: number;
  matchedFields: string[];
  snippet?: SearchSnippet;
  isFuzzyMatch?: boolean;
}

export interface GlobalSearchResponse<T = SearchableItem> {
  results: SearchResultItem<T>[];
  totalMatches: number;
  didYouMean?: string;
  parsedQuery: ParsedSearchQuery;
  searchDurationMs: number;
}

/**
 * Unified content extractor across all scripture data schemas
 */
export function extractSearchableText(item: any): string {
  if (!item) return '';
  const parts: string[] = [];

  if (typeof item.content === 'string') {
    parts.push(item.content);
  }

  if (Array.isArray(item.verses)) {
    for (const v of item.verses) {
      if (typeof v === 'string') {
        parts.push(v);
      } else if (v && typeof v === 'object') {
        if (v.hindi) parts.push(Array.isArray(v.hindi) ? v.hindi.join(' ') : String(v.hindi));
        if (v.original) parts.push(Array.isArray(v.original) ? v.original.join(' ') : String(v.original));
        if (v.meaning) parts.push(Array.isArray(v.meaning) ? v.meaning.join(' ') : String(v.meaning));
        if (v.translation) parts.push(Array.isArray(v.translation) ? v.translation.join(' ') : String(v.translation));
        if (v.title) parts.push(String(v.title));
        if (v.heading) parts.push(String(v.heading));
      }
    }
  }

  if (Array.isArray(item.lyrics)) {
    for (const l of item.lyrics) {
      if (typeof l === 'string') parts.push(l);
      else if (l && typeof l === 'object') {
        if (l.text) parts.push(String(l.text));
        if (l.hindi) parts.push(String(l.hindi));
        if (l.meaning) parts.push(String(l.meaning));
      }
    }
  }

  if (Array.isArray(item.chapters)) {
    for (const ch of item.chapters) {
      if (ch && typeof ch === 'object') {
        if (ch.title) parts.push(String(ch.title));
        if (Array.isArray(ch.content)) parts.push(ch.content.join(' '));
        else if (typeof ch.content === 'string') parts.push(ch.content);
      }
    }
  }

  if (typeof item.introHtml === 'string') {
    parts.push(item.introHtml);
  }

  const rawJoined = parts.join(' ');
  return rawJoined
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts a contextual snippet (e.g. matched verse or sentence) around query tokens
 */
export function extractSnippet(
  item: SearchableItem,
  queryTokens: string[],
  maxLen: number = 110
): SearchSnippet | undefined {
  if (!queryTokens.length) return undefined;

  // 1. Check verses first for exact verse-level insight
  if (Array.isArray(item.verses) && item.verses.length > 0) {
    for (const v of item.verses) {
      let candidate = '';
      if (typeof v === 'string') candidate = v;
      else if (v && typeof v === 'object') {
        candidate = [v.hindi, v.original, v.meaning, v.translation]
          .filter(Boolean)
          .map((c) => (Array.isArray(c) ? c.join(' ') : String(c)))
          .join(' ');
      }
      if (candidate) {
        const clean = candidate.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const norm = normalizeDevanagari(clean.toLowerCase());
        for (const token of queryTokens) {
          if (token.length >= 2 && (norm.includes(token) || clean.toLowerCase().includes(token))) {
            return {
              matchedField: 'verse',
              snippetText: trimToSnippetWindow(clean, token, maxLen),
            };
          }
        }
      }
    }
  }

  // 2. Check lyrics
  if (Array.isArray(item.lyrics) && item.lyrics.length > 0) {
    for (const l of item.lyrics) {
      const candidate = typeof l === 'string' ? l : l?.text || l?.hindi || l?.meaning || '';
      if (candidate) {
        const clean = String(candidate).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const norm = normalizeDevanagari(clean.toLowerCase());
        for (const token of queryTokens) {
          if (token.length >= 2 && (norm.includes(token) || clean.toLowerCase().includes(token))) {
            return {
              matchedField: 'lyrics',
              snippetText: trimToSnippetWindow(clean, token, maxLen),
            };
          }
        }
      }
    }
  }

  // 3. Check Description
  if (item.description) {
    const clean = item.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const norm = normalizeDevanagari(clean.toLowerCase());
    for (const token of queryTokens) {
      if (token.length >= 2 && (norm.includes(token) || clean.toLowerCase().includes(token))) {
        return {
          matchedField: 'description',
          snippetText: trimToSnippetWindow(clean, token, maxLen),
        };
      }
    }
  }

  return undefined;
}

function trimToSnippetWindow(text: string, matchTerm: string, maxLen: number): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(matchTerm.toLowerCase());
  if (idx === -1) {
    return text.length > maxLen ? `${text.slice(0, maxLen).trim()}...` : text;
  }

  const start = Math.max(0, idx - Math.floor(maxLen / 3));
  const end = Math.min(text.length, start + maxLen);
  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = `...${snippet}`;
  if (end < text.length) snippet = `${snippet}...`;
  return snippet;
}

// 7. Query Parser with Operators & Phonetics
const CATEGORY_OPERATOR_MAP: Record<string, string> = {
  puja: 'puja',
  pujan: 'puja',
  stotra: 'stotra',
  stotram: 'stotra',
  chalisa: 'chalisa',
  aarti: 'aarti',
  arti: 'aarti',
  vidhan: 'vidhan',
  vidhana: 'vidhan',
  granthas: 'granthas',
  shastra: 'granthas',
  bhajan: 'bhajan',
  path: 'path',
  tirthankar: 'tirthankar',
  tirthankara: 'tirthankar',
  itihas: 'itihas',
  bhugol: 'bhugol',
  parva: 'parva',
  tattva: 'tattva',
  philosophy: 'tattva',
  vrat: 'vrat',
  agamas: 'agamas',
};

export function parseSearchQuery(query: string): ParsedSearchQuery {
  let cleanText = (query || '').trim();
  let categoryFilter: string | undefined;
  let authorFilter: string | undefined;
  let tagFilter: string | undefined;

  // 1. Detect Category Operators: @puja, @stotra, cat:chalisa, type:aarti
  const catRegex = /(?:^|\s)@([a-zA-Z0-9_-]+)|(?:^|\s)(?:cat|type):([a-zA-Z0-9_-]+)/gi;
  const catMatch = catRegex.exec(cleanText);
  if (catMatch) {
    const rawCat = (catMatch[1] || catMatch[2] || '').toLowerCase();
    categoryFilter = CATEGORY_OPERATOR_MAP[rawCat] || rawCat;
    cleanText = cleanText.replace(catMatch[0], ' ').trim();
  }

  // 2. Detect Author Operators: kavi:kundkund, author:daulatram
  const authorRegex = /(?:^|\s)(?:kavi|author):([a-zA-Z0-9_\u0900-\u097F-]+)/gi;
  const authorMatch = authorRegex.exec(cleanText);
  if (authorMatch) {
    authorFilter = authorMatch[1].toLowerCase();
    cleanText = cleanText.replace(authorMatch[0], ' ').trim();
  }

  // 3. Detect Tag Operators: tag:दशलक्षण
  const tagRegex = /(?:^|\s)tag:([a-zA-Z0-9_\u0900-\u097F-]+)/gi;
  const tagMatch = tagRegex.exec(cleanText);
  if (tagMatch) {
    tagFilter = tagMatch[1].toLowerCase();
    cleanText = cleanText.replace(tagMatch[0], ' ').trim();
  }

  // Clean remaining whitespace
  cleanText = cleanText.replace(/\s+/g, ' ').trim();

  // Split raw tokens
  const rawTokens = cleanText
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const devanagariTokens: string[] = [];
  const transliteratedTokens: string[] = [];
  const phoneticTokens: string[] = [];

  for (const token of rawTokens) {
    const dev = normalizeDevanagari(token);
    if (dev) devanagariTokens.push(dev);

    // If token is in English, check Hinglish dictionary mapping
    if (HINGLISH_TO_DEVANAGARI_MAP[token]) {
      devanagariTokens.push(normalizeDevanagari(HINGLISH_TO_DEVANAGARI_MAP[token]));
    }

    const phon = normalizePhonetic(token);
    if (phon) phoneticTokens.push(phon);

    // If token has Devanagari, also transliterate to English
    if (/[\u0900-\u097F]/.test(token)) {
      const trans = transliterateHindiToEnglish(token);
      if (trans) transliteratedTokens.push(trans);
    }
  }

  return {
    raw: query,
    cleanText,
    categoryFilter,
    authorFilter,
    tagFilter,
    tokens: rawTokens,
    devanagariTokens: Array.from(new Set(devanagariTokens)),
    transliteratedTokens: Array.from(new Set(transliteratedTokens)),
    phoneticTokens: Array.from(new Set(phoneticTokens)),
  };
}

/**
 * Pre-indexed Item Metadata Wrapper for O(1) Token Inverted Index
 */
interface IndexedItemMeta {
  item: SearchableItem;
  id: string;
  category: string;
  titleRaw: string;
  titleDev: string;
  titleTrans: string;
  titlePhon: string;
  authorRaw: string;
  authorDev: string;
  tagsRaw: string[];
  tagsDev: string[];
  descRaw: string;
  descDev: string;
  tokens: Set<string>;
  bodyTextCache?: string;
  bodyDevCache?: string;
}

/**
 * Global Search Protocol Core Engine
 */
export class GlobalSearchProtocol {
  private indexedItems: IndexedItemMeta[] = [];
  private itemMap: Map<string, IndexedItemMeta> = new Map();
  private invertedIndex: Map<string, Set<number>> = new Map(); // token -> Set of item indices
  private dictionaryTokens: Set<string> = new Set();
  private isIndexed = false;

  constructor(items?: SearchableItem[]) {
    if (items && items.length > 0) {
      this.indexItems(items);
    }
  }

  /**
   * Pre-indexes an array of items for instant multi-field search
   */
  public indexItems(items: SearchableItem[]): void {
    this.indexedItems = [];
    this.itemMap.clear();
    this.invertedIndex.clear();
    this.dictionaryTokens.clear();

    items.forEach((item, index) => {
      const id = (item.id || '').toLowerCase();
      const titleRaw = (item.title || '').toLowerCase();
      const titleDev = normalizeDevanagari(titleRaw);
      const titleTrans = transliterateHindiToEnglish(item.title || '');
      const titlePhon = normalizePhonetic(titleTrans);

      const authorRaw = (item.author || '').toLowerCase();
      const authorDev = normalizeDevanagari(authorRaw);

      const tagsRaw = Array.isArray(item.tags) ? item.tags.map((t) => String(t).toLowerCase()) : [];
      const tagsDev = tagsRaw.map((t) => normalizeDevanagari(t));

      const descRaw = (item.description || '').toLowerCase();
      const descDev = normalizeDevanagari(descRaw);

      const tokenSet = new Set<string>();

      // Helper to add tokens to index
      const addTokens = (str: string) => {
        if (!str) return;
        const parts = str.split(/\s+/).filter((p) => p.length > 1);
        for (const p of parts) {
          tokenSet.add(p);
          this.dictionaryTokens.add(p);
          if (!this.invertedIndex.has(p)) {
            this.invertedIndex.set(p, new Set());
          }
          this.invertedIndex.get(p)!.add(index);
        }
      };

      addTokens(titleRaw);
      addTokens(titleDev);
      addTokens(titleTrans);
      addTokens(titlePhon);
      addTokens(id.replace(/[-_]/g, ' '));
      addTokens(authorRaw);
      addTokens(authorDev);
      tagsRaw.forEach(addTokens);
      tagsDev.forEach(addTokens);
      addTokens(descRaw);
      addTokens(descDev);

      const meta: IndexedItemMeta = {
        item,
        id,
        category: (item.category || '').toLowerCase(),
        titleRaw,
        titleDev,
        titleTrans,
        titlePhon,
        authorRaw,
        authorDev,
        tagsRaw,
        tagsDev,
        descRaw,
        descDev,
        tokens: tokenSet,
      };

      this.indexedItems.push(meta);
      if (item.id) {
        this.itemMap.set(item.id, meta);
      }
    });

    this.isIndexed = true;
  }

  /**
   * Primary Search Method with Multi-Tier Scoring & Fuzzy Tolerance
   */
  public search(
    query: string,
    categoryFilter?: string,
    limit: number = 60
  ): GlobalSearchResponse {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const parsed = parseSearchQuery(query);

    if (!parsed.cleanText && !parsed.categoryFilter && !categoryFilter) {
      return {
        results: [],
        totalMatches: 0,
        parsedQuery: parsed,
        searchDurationMs: 0,
      };
    }

    const effectiveCategory = parsed.categoryFilter || categoryFilter;
    const scoredList: SearchResultItem[] = [];
    const queryDev = normalizeDevanagari(parsed.cleanText);
    const queryPhon = normalizePhonetic(parsed.cleanText);
    const rawTokens = parsed.tokens;
    const allSearchTokens = Array.from(
      new Set([...parsed.tokens, ...parsed.devanagariTokens, ...parsed.transliteratedTokens, ...parsed.phoneticTokens])
    );

    let foundExactMatches = false;

    // Evaluate items
    for (const meta of this.indexedItems) {
      // 1. Category Filter Enforcement
      if (effectiveCategory && effectiveCategory !== 'all') {
        const itemCat = meta.category === 'shastra' ? 'granthas' : meta.category;
        const targetCat = effectiveCategory === 'shastra' ? 'granthas' : effectiveCategory;
        if (itemCat !== targetCat) {
          continue;
        }
      }

      // 2. Author Filter Enforcement
      if (parsed.authorFilter) {
        const normAuthorFilter = normalizeDevanagari(parsed.authorFilter);
        if (
          !meta.authorRaw.includes(parsed.authorFilter) &&
          !meta.authorDev.includes(normAuthorFilter)
        ) {
          continue;
        }
      }

      // 3. Tag Filter Enforcement
      if (parsed.tagFilter) {
        const normTagFilter = normalizeDevanagari(parsed.tagFilter);
        const hasTag = meta.tagsDev.some((t) => t.includes(normTagFilter)) || meta.tagsRaw.some((t) => t.includes(parsed.tagFilter!));
        if (!hasTag) {
          continue;
        }
      }

      // If user only provided category/author filter without cleanText
      if (!parsed.cleanText) {
        scoredList.push({
          item: meta.item,
          score: 100,
          matchedFields: ['category'],
        });
        continue;
      }

      // Multi-tier Scoring
      let score = 0;
      const matchedFields: string[] = [];
      let isFuzzy = false;

      // Tier 1: Exact Title Match (Devanagari or Transliterated or Phonetic)
      if (
        meta.titleDev === queryDev ||
        meta.titleRaw === parsed.cleanText ||
        meta.titleTrans === parsed.cleanText ||
        meta.titlePhon === queryPhon
      ) {
        score += 1600;
        matchedFields.push('title_exact');
        foundExactMatches = true;
      }
      // Tier 2: Title Prefix Match
      else if (
        meta.titleDev.startsWith(queryDev) ||
        meta.titleRaw.startsWith(parsed.cleanText) ||
        meta.titleTrans.startsWith(parsed.cleanText) ||
        meta.titlePhon.startsWith(queryPhon)
      ) {
        score += 1100;
        matchedFields.push('title_prefix');
        foundExactMatches = true;
      }
      // Tier 3: Title Word Boundary Match (e.g. "भक्तामर" in "श्री भक्तामर स्तोत्र")
      else {
        const devEsc = queryDev.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordBoundaryRegex = new RegExp(`(^|\\s)${devEsc}`, 'i');
        if (wordBoundaryRegex.test(meta.titleDev) || wordBoundaryRegex.test(meta.titleRaw)) {
          score += 850;
          matchedFields.push('title_boundary');
          foundExactMatches = true;
        } else if (meta.titleDev.includes(queryDev) || meta.titleRaw.includes(parsed.cleanText)) {
          score += 550;
          matchedFields.push('title_contains');
          foundExactMatches = true;
        } else if (meta.titleTrans.includes(parsed.cleanText) || meta.titlePhon.includes(queryPhon)) {
          score += 450;
          matchedFields.push('title_trans');
          foundExactMatches = true;
        }
      }

      // Tier 4: Tags Match
      for (let i = 0; i < meta.tagsRaw.length; i++) {
        const tRaw = meta.tagsRaw[i];
        const tDev = meta.tagsDev[i];
        if (tDev === queryDev || tRaw === parsed.cleanText) {
          score += 600;
          matchedFields.push('tag_exact');
          foundExactMatches = true;
          break;
        } else if (tDev.includes(queryDev) || queryDev.includes(tDev) || tRaw.includes(parsed.cleanText)) {
          score += 380;
          matchedFields.push('tag_contains');
          foundExactMatches = true;
          break;
        }
      }

      // Tier 5: ID Match
      if (meta.id.includes(parsed.cleanText) || meta.id.includes(queryPhon)) {
        score += 350;
        matchedFields.push('id');
        foundExactMatches = true;
      }

      // Tier 6: Author / Kavi Match
      if (meta.authorDev.includes(queryDev) || meta.authorRaw.includes(parsed.cleanText)) {
        score += 320;
        matchedFields.push('author');
        foundExactMatches = true;
      }

      // Tier 7: Description Match
      if (meta.descDev.includes(queryDev) || meta.descRaw.includes(parsed.cleanText)) {
        score += 220;
        matchedFields.push('description');
        foundExactMatches = true;
      }

      // Tier 8: Multi-Token Matching (When query contains 2+ words)
      if (rawTokens.length > 1) {
        let matchedCount = 0;
        for (const token of rawTokens) {
          const normToken = normalizeDevanagari(token);
          const phonToken = normalizePhonetic(token);
          if (
            meta.tokens.has(token) ||
            meta.tokens.has(normToken) ||
            meta.tokens.has(phonToken) ||
            meta.titleRaw.includes(token) ||
            meta.titleDev.includes(normToken)
          ) {
            matchedCount++;
          }
        }
        if (matchedCount === rawTokens.length) {
          score += 400;
          matchedFields.push('all_tokens');
          foundExactMatches = true;
        } else if (matchedCount > 0) {
          score += Math.round((matchedCount / rawTokens.length) * 220);
        }
      }

      // Tier 9: Verses / Lyrics / Body Text Deep Match
      let snippet: SearchSnippet | undefined;
      if (score === 0 || score < 500) {
        if (!meta.bodyTextCache) {
          meta.bodyTextCache = extractSearchableText(meta.item).toLowerCase();
          meta.bodyDevCache = normalizeDevanagari(meta.bodyTextCache);
        }

        if (meta.bodyDevCache && (meta.bodyDevCache.includes(queryDev) || meta.bodyTextCache.includes(parsed.cleanText))) {
          score += 260;
          matchedFields.push('body');
          foundExactMatches = true;
          snippet = extractSnippet(meta.item, allSearchTokens);
        }
      }

      // Tier 10: Typo Tolerance & Fuzzy Search (Levenshtein Distance ≤ 2)
      // Only triggered when no exact match was found and token length ≥ 4
      if (score === 0 && parsed.cleanText.length >= 4) {
        for (const token of meta.tokens) {
          if (Math.abs(token.length - parsed.cleanText.length) <= 2) {
            const dist = levenshteinDistance(token, parsed.cleanText);
            if (dist <= 2) {
              score += dist === 1 ? 160 : 110;
              isFuzzy = true;
              matchedFields.push('fuzzy');
              break;
            }
          }
          if (queryDev.length >= 4 && Math.abs(token.length - queryDev.length) <= 2) {
            const dist = levenshteinDistance(token, queryDev);
            if (dist <= 2) {
              score += dist === 1 ? 160 : 110;
              isFuzzy = true;
              matchedFields.push('fuzzy_dev');
              break;
            }
          }
        }
      }

      if (score > 0) {
        scoredList.push({
          item: meta.item,
          score,
          matchedFields,
          snippet,
          isFuzzyMatch: isFuzzy,
        });
      }
    }

    // Sort descending by score
    scoredList.sort((a, b) => b.score - a.score);

    // Compute "Did You Mean" if exact matches were low or 0
    let didYouMean: string | undefined;
    if (!foundExactMatches && parsed.cleanText.length >= 4) {
      let minDistance = 3;
      let candidate = '';
      for (const dictWord of this.dictionaryTokens) {
        if (dictWord.length >= 3 && Math.abs(dictWord.length - parsed.cleanText.length) <= 2) {
          const dist = levenshteinDistance(dictWord, parsed.cleanText);
          if (dist > 0 && dist < minDistance) {
            minDistance = dist;
            candidate = dictWord;
          }
        }
      }
      if (candidate) {
        didYouMean = candidate;
      }
    }

    const duration = typeof performance !== 'undefined' ? performance.now() - startTime : Date.now() - startTime;

    return {
      results: scoredList.slice(0, limit),
      totalMatches: scoredList.length,
      didYouMean,
      parsedQuery: parsed,
      searchDurationMs: Math.round(duration * 100) / 100,
    };
  }
}

// 8. Singleton Protocol Instance for Global App Usage
let globalSearchInstance: GlobalSearchProtocol | null = null;

export function getGlobalSearchInstance(items?: SearchableItem[]): GlobalSearchProtocol {
  if (!globalSearchInstance) {
    globalSearchInstance = new GlobalSearchProtocol(items || []);
  } else if (items && items.length > 0) {
    globalSearchInstance.indexItems(items);
  }
  return globalSearchInstance;
}

/**
 * Modern High-Level Global Search API
 */
export function searchGlobal<T extends SearchableItem>(
  items: T[],
  query: string,
  categoryFilter?: string,
  limit?: number
): GlobalSearchResponse<T> {
  const engine = new GlobalSearchProtocol(items);
  return engine.search(query, categoryFilter, limit) as GlobalSearchResponse<T>;
}

// 9. Backwards Compatible Exports

/**
 * Calculates a search relevance score for an item against a user query.
 */
export function calculateRelevanceScore(item: SearchableItem, query: string): number {
  if (!query || !query.trim()) return 100;
  const engine = new GlobalSearchProtocol([item]);
  const resp = engine.search(query);
  return resp.results.length > 0 ? resp.results[0].score : 0;
}

/**
 * Filters and ranks items according to search relevance score.
 */
export function searchAndRankItems<T extends SearchableItem>(
  items: T[],
  query: string,
  categoryFilter?: string
): T[] {
  if (!query || !query.trim()) {
    if (categoryFilter && categoryFilter !== 'all') {
      return items.filter((i) => i.category === categoryFilter);
    }
    return items;
  }

  const engine = new GlobalSearchProtocol(items);
  const resp = engine.search(query, categoryFilter, items.length);
  return resp.results.map((r) => r.item as T);
}

/**
 * Checks if a searchable item matches a user query in English or Hindi.
 */
export function matchSearchQuery(item: SearchableItem, query: string): boolean {
  if (!query || !query.trim()) return true;
  return calculateRelevanceScore(item, query) > 0;
}

/**
 * Splits text into highlighted segments based on search query.
 * Enhanced: handles operators, multi-words, and Devanagari ↔ English cross matching!
 */
export function getHighlightedSegments(
  text: string,
  query: string
): { text: string; isMatch: boolean }[] {
  if (!text || !query || !query.trim()) {
    return [{ text, isMatch: false }];
  }

  const parsed = parseSearchQuery(query);
  const termsToMatch: string[] = [];

  if (parsed.cleanText) {
    termsToMatch.push(parsed.cleanText);
  }
  parsed.tokens.forEach((t) => {
    if (t.length > 1) termsToMatch.push(t);
  });
  parsed.devanagariTokens.forEach((t) => {
    if (t.length > 1) termsToMatch.push(t);
  });
  parsed.transliteratedTokens.forEach((t) => {
    if (t.length > 1) termsToMatch.push(t);
  });

  const uniqueTerms = Array.from(new Set(termsToMatch))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (uniqueTerms.length === 0) {
    return [{ text, isMatch: false }];
  }

  const pattern = uniqueTerms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part) => {
    const isMatch = uniqueTerms.some(
      (term) => part.toLowerCase() === term.toLowerCase()
    );
    return {
      text: part,
      isMatch,
    };
  });
}
