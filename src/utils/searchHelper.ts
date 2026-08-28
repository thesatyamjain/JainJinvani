/**
 * Jain Jinvani Smart Bilingual (Hindi & English/Hinglish) Search Engine
 * Provides phonetic transliteration, fuzzy Romanization, and aliases matching.
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
 * Phonetic Normalizer: Removes acoustic spelling differences.
 * e.g., "pooja" / "puja" -> "puja"
 * "navkar" / "namokar" -> "namkar"
 * "tatvarth" / "tattvartha" -> "tattvart"
 */
export function normalizePhonetic(text: string): string {
  if (!text) return '';
  let s = text.toLowerCase().trim();

  // Common Jain alias replacements
  s = s.replace(/navkar/g, 'namokar');
  s = s.replace(/namokaar/g, 'namokar');
  s = s.replace(/pooja/g, 'puja');
  s = s.replace(/poojan/g, 'pujan');
  s = s.replace(/arti/g, 'aarti');
  s = s.replace(/chaalisa/g, 'chalisa');
  s = s.replace(/chalis/g, 'chalisa');
  s = s.replace(/bhavana/g, 'bhavna');
  s = s.replace(/parasnath/g, 'parshvanath');
  s = s.replace(/parshwanath/g, 'parshvanath');
  s = s.replace(/rishabhdev/g, 'adinath');
  s = s.replace(/rishabhnath/g, 'adinath');
  s = s.replace(/mahaveer/g, 'mahavir');
  s = s.replace(/vardhaman/g, 'mahavir');
  s = s.replace(/chhahdhala/g, 'chhedala');
  s = s.replace(/chhe\s*dhala/g, 'chhedala');
  s = s.replace(/tatvarth/g, 'tattvarth');
  s = s.replace(/tattvartha/g, 'tattvarth');
  s = s.replace(/samaysara/g, 'samaysar');
  s = s.replace(/samayasar/g, 'samaysar');
  s = s.replace(/samay\s*sar/g, 'samaysar');
  s = s.replace(/saamayik/g, 'samayik');
  s = s.replace(/shikharji/g, 'sammed shikhar');
  s = s.replace(/ashtadravya/g, 'puja');

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

/**
 * Checks if a searchable item matches a user query in English or Hindi.
 */
export function matchSearchQuery(
  item: {
    id?: string;
    title?: string;
    description?: string;
    category?: string;
    subCategory?: string;
    author?: string;
    badge?: string;
  },
  query: string
): boolean {
  if (!query || !query.trim()) return true;

  const rawQuery = query.toLowerCase().trim();
  const normalizedQuery = normalizePhonetic(rawQuery);
  const queryTokens = rawQuery.split(/\s+/).filter(Boolean);
  const normalizedTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  // 1. Direct Hindi / English Substring Match
  const title = (item.title || '').toLowerCase();
  const id = (item.id || '').toLowerCase().replace(/[-_]/g, ' ');
  const desc = (item.description || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();
  const subCat = (item.subCategory || '').toLowerCase();
  const author = (item.author || '').toLowerCase();
  const badge = (item.badge || '').toLowerCase();

  const directCorpus = `${title} ${id} ${desc} ${cat} ${subCat} ${author} ${badge}`;

  // If direct match on full query
  if (directCorpus.includes(rawQuery)) return true;

  // 2. Transliterate Hindi text into Romanized English
  const transliteratedTitle = transliterateHindiToEnglish(item.title || '');
  const transliteratedDesc = transliterateHindiToEnglish(item.description || '');
  const transliteratedAuthor = transliterateHindiToEnglish(item.author || '');

  const englishCorpus = `${id} ${transliteratedTitle} ${transliteratedDesc} ${transliteratedAuthor} ${cat} ${subCat}`.toLowerCase();

  // If direct English transliteration matches
  if (englishCorpus.includes(rawQuery)) return true;

  // 3. Phonetic Fuzzy Match
  const normalizedCorpus = normalizePhonetic(`${directCorpus} ${englishCorpus}`);
  if (normalizedCorpus.includes(normalizedQuery)) return true;

  // 4. Token-level matching: every word in the query must match something in the item
  const allTokensMatch = queryTokens.every((token, idx) => {
    const normToken = normalizedTokens[idx] || normalizePhonetic(token);
    return (
      directCorpus.includes(token) ||
      englishCorpus.includes(token) ||
      normalizedCorpus.includes(normToken)
    );
  });

  return allTokensMatch;
}
