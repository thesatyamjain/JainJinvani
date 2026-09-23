import { repairDevanagariUnicode } from './unicodeFixer';

/**
 * Jain Jinvani Smart Bilingual (Hindi & English/Hinglish) Search Engine
 * Provides phonetic transliteration, Devanagari orthographic normalization,
 * relevance scoring, ranking, and match highlighting.
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
  '।' : ' ', '॥': ' ',
};

// Halant mark
const HALANT = '्';

/**
 * Transliterates Hindi/Devanagari text into natural Romanized English.
 * e.g., "भक्तामर स्तोत्र" -> "bhaktamar stotra"
 */
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
      // If it's a consonant and NOT followed by halant or matra, add inherent 'a'
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

/**
 * Devanagari Orthographic Normalizer
 * Equates Anusvara (ं), Chandrabindu (ँ), and homorganic nasal stops (न्, म्, ङ्, ञ्, ण्).
 * Strips Nuktas (़) and unifies classic Jain variants (e.g. शान्ति == शांति, भक्तांबर == भक्तामर).
 */
export function normalizeDevanagari(text: string): string {
  if (!text) return '';
  let s = repairDevanagariUnicode(text).trim();

  // Replace Chandrabindu (ँ) with Anusvara (ं)
  s = s.replace(/\u0901/g, '\u0902');

  // Normalize nasal + stop consonant conjuncts to Anusvara (ं)
  // e.g., शान्ति -> शांति, पञ्च -> पंच, सम्बन्ध -> संबंध, जिनेन्द्र -> जिनेंद्र, कल्याणमन्दिर -> कल्याणमंदिर
  s = s.replace(/ङ्(?=[कखगघ])/g, 'ं');
  s = s.replace(/ञ्(?=[चछजझ])/g, 'ं');
  s = s.replace(/ण्(?=[टठडढ])/g, 'ं');
  s = s.replace(/न्(?=[तथदधन])/g, 'ं');
  s = s.replace(/म्(?=[पफबभम])/g, 'ं');

  // Remove Nukta mark (़) e.g., ड़ -> ड, ढ़ -> ढ, फ़ -> फ, ज़ -> ज
  s = s.replace(/\u093C/g, '');

  // Normalize common Jain Hindi spelling variants
  s = s.replace(/भक्तांबर/g, 'भक्तामर');
  s = s.replace(/तत्वार्थ/g, 'तत्त्वार्थ');
  s = s.replace(/नवकार/g, 'णमोकार');
  s = s.replace(/नमोकार/g, 'णमोकार');
  s = s.replace(/छेढाला|छ ढाला|छह ढाला/g, 'छहढाला');
  s = s.replace(/पारसनाथ/g, 'पार्श्वनाथ');
  s = s.replace(/ऋषभदेव|ऋषभनाथ/g, 'आदिनाथ');
  s = s.replace(/वर्धमान/g, 'महावीर');
  s = s.replace(/कल्याण\s*मंदिर/g, 'कल्याणमंदिर');
  s = s.replace(/समय\s*सार/g, 'समयसार');
  s = s.replace(/रत्नकरंड/g, 'रत्नकरण्ड');
  s = s.replace(/द्रव्य\s*संग्रह/g, 'द्रव्यसंग्रह');
  s = s.replace(/गोमटेश्वर/g, 'बाहुबली');
  s = s.replace(/शांति\s*धारा|शान्तिधारा/g, 'शांतिधारा');
  s = s.replace(/दश\s*लक्षण/g, 'दशलक्षण');
  s = s.replace(/अष्टांहिका|अष्टान्हिका/g, 'अष्टान्हिका');

  // Clean punctuation & danda
  s = s.replace(/[।॥,.:;!?"'()[\]{}_-]/g, ' ');
  s = s.replace(/\s+/g, ' ');

  return s.trim();
}

/**
 * Phonetic Normalizer: Removes acoustic spelling differences in English & Hinglish.
 * e.g., "pooja" / "puja" -> "puja"
 * "navkar" / "namokar" -> "namokar"
 * "tatvarth" / "tattvartha" -> "tattvart"
 */
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

  // Consolidate repeated letters (e.g. tt -> t, nn -> n)
  s = s.replace(/([a-z])\1+/g, '$1');

  return s;
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
  [key: string]: any;
}

/**
 * Unified content extractor across all scripture data schemas:
 * - string content (HTML or plain text)
 * - verses array: [{ hindi, meaning, english, ... }] or string[] (pujas, stotras, chalisas, paths)
 * - lyrics array (bhajans)
 * - chapters array (shastras)
 * - introHtml & descriptions
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
 * Calculates a search relevance score for an item against a user query.
 * Returns score > 0 if matched, 0 otherwise.
 */
export function calculateRelevanceScore(item: SearchableItem, query: string): number {
  if (!query || !query.trim()) return 100;

  const rawQuery = query.toLowerCase().trim();
  const devQuery = normalizeDevanagari(rawQuery);
  const phoneticQuery = normalizePhonetic(rawQuery);

  const title = (item.title || '').toLowerCase().trim();
  const devTitle = normalizeDevanagari(title);
  const transTitle = transliterateHindiToEnglish(item.title || '');
  const phonTitle = normalizePhonetic(transTitle);

  const id = (item.id || '').toLowerCase().replace(/[-_]/g, ' ');
  const desc = (item.description || '').toLowerCase();
  const devDesc = normalizeDevanagari(desc);
  const cat = (item.category || '').toLowerCase();
  const subCat = (item.subCategory || '').toLowerCase();
  const author = (item.author || '').toLowerCase();
  const devAuthor = normalizeDevanagari(author);
  const badge = (item.badge || '').toLowerCase();
  const tags = Array.isArray(item.tags) ? item.tags : [];

  let score = 0;

  // 1. Exact Title Match
  if (devTitle === devQuery || title === rawQuery || transTitle === rawQuery || phonTitle === phoneticQuery) {
    return 1200;
  }

  // 2. Title Starts With Query
  if (devTitle.startsWith(devQuery) || title.startsWith(rawQuery) || transTitle.startsWith(rawQuery) || phonTitle.startsWith(phoneticQuery)) {
    score += 850;
  }

  // 3. Title Word Boundary Match (e.g. "भक्तामर" in "श्री भक्तामर स्तोत्र")
  const wordBoundaryRegex = new RegExp(`(^|\\s)${devQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
  if (wordBoundaryRegex.test(devTitle) || wordBoundaryRegex.test(title)) {
    score += 650;
  } else if (devTitle.includes(devQuery) || title.includes(rawQuery)) {
    score += 480;
  } else if (transTitle.includes(rawQuery) || phonTitle.includes(phoneticQuery)) {
    score += 380;
  }

  // 4. Tags Match (High Relevance for categorization like 'दशलक्षण', 'तीर्थंकर', 'नित्य-नियम')
  for (const tag of tags) {
    const rawTag = String(tag).toLowerCase().trim();
    const devTag = normalizeDevanagari(rawTag);
    if (devTag === devQuery || rawTag === rawQuery) {
      score += 450;
      break;
    } else if (devTag.includes(devQuery) || rawTag.includes(rawQuery) || devQuery.includes(devTag)) {
      score += 320;
      break;
    }
  }

  // 5. ID Match (e.g., "bhaktamar-stotra")
  if (id.includes(rawQuery) || id.includes(phoneticQuery)) {
    score += 320;
  }

  // 6. Category or SubCategory Exact Match
  if (cat.includes(rawQuery) || subCat.includes(rawQuery) || devQuery.includes(cat) || devQuery.includes(subCat)) {
    score += 260;
  }

  // 7. Author Match
  if (devAuthor.includes(devQuery) || author.includes(rawQuery)) {
    score += 200;
  }

  // 8. Badge Match
  if (badge.includes(rawQuery)) {
    score += 150;
  }

  // 9. Description Match
  if (devDesc.includes(devQuery) || desc.includes(rawQuery)) {
    score += 120;
  }

  // 10. Verses / Lyrics / Body Content Match (ensures pujas/stotras with verses are discoverable)
  const bodyText = extractSearchableText(item);
  if (bodyText) {
    const normBody = normalizeDevanagari(bodyText.toLowerCase());
    if (normBody.includes(devQuery) || bodyText.toLowerCase().includes(rawQuery)) {
      score += 240;
    }
  }

  // 11. Token-level matching: every word in multi-word query
  const queryTokens = rawQuery.split(/\s+/).filter(Boolean);
  if (queryTokens.length > 1) {
    let matchedTokens = 0;
    const tagString = tags.join(' ');
    const directCorpus = `${devTitle} ${id} ${devDesc} ${cat} ${subCat} ${devAuthor} ${badge} ${tagString} ${bodyText.slice(0, 3000)}`;
    const englishCorpus = `${id} ${transTitle} ${phonTitle} ${cat}`;

    for (const token of queryTokens) {
      const normToken = normalizeDevanagari(token);
      const phonToken = normalizePhonetic(token);
      if (
        directCorpus.includes(normToken) ||
        directCorpus.includes(token) ||
        englishCorpus.includes(token) ||
        englishCorpus.includes(phonToken)
      ) {
        matchedTokens++;
      }
    }

    if (matchedTokens === queryTokens.length) {
      score += 300;
    } else if (matchedTokens > 0) {
      score += (matchedTokens / queryTokens.length) * 150;
    }
  }

  return score;
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

  const scoredList: { item: T; score: number }[] = [];

  for (const item of items) {
    if (categoryFilter && categoryFilter !== 'all' && item.category !== categoryFilter) {
      continue;
    }

    const score = calculateRelevanceScore(item, query);
    if (score > 0) {
      scoredList.push({ item, score });
    }
  }

  scoredList.sort((a, b) => b.score - a.score);
  return scoredList.map((entry) => entry.item);
}

/**
 * Checks if a searchable item matches a user query in English or Hindi.
 * Retained for backwards compatibility with existing components.
 */
export function matchSearchQuery(item: SearchableItem, query: string): boolean {
  if (!query || !query.trim()) return true;
  return calculateRelevanceScore(item, query) > 0;
}

/**
 * Splits text into highlighted segments based on search query.
 */
export function getHighlightedSegments(
  text: string,
  query: string
): { text: string; isMatch: boolean }[] {
  if (!text || !query || !query.trim()) {
    return [{ text, isMatch: false }];
  }

  const cleanQuery = query.trim();
  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part) => ({
    text: part,
    isMatch: part.toLowerCase() === cleanQuery.toLowerCase(),
  }));
}

