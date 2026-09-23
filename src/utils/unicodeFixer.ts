/**
 * Devanagari Unicode & Legacy Krutidev/Chanakya Repair Engine
 * Resolves misplaced reph ('र्'), nukta ordering, inverted matras,
 * and canonical Jain scripture orthography.
 */

// Common words broken during Krutidev -> Unicode regex conversion
const COMMON_KRUTIDEV_REPLACEMENTS: [RegExp, string][] = [
  [/आशीवार्द/g, 'आशीर्वाद'],
  [/निविर्कल्प/g, 'निर्विकल्प'],
  [/धार्मिंक/g, 'धार्मिक'],
  [/अन्तमुर्हूर्त/g, 'अन्तर्मुहूर्त'],
  [/अन्तमुर्हूतर्/g, 'अन्तर्मुहूर्त'],
  [/मुहूतर्/g, 'मुहूर्त'],
  [/तीथर्ंकर/g, 'तीर्थंकर'],
  [/तीथर्/g, 'तीर्थ'],
  [/आशीवर्चन/g, 'आशीर्वचन'],
  [/निमार्ण/g, 'निर्माण'],
  [/प्रवतर्क/g, 'प्रवर्तक'],
  [/कत्तर्व्य/g, 'कर्तव्य'],
  [/सम्पूणर्/g, 'सम्पूर्ण'],
  [/संपूणर्/g, 'संपूर्ण'],
  [/अहर्ंत/g, 'अर्हंत'],
  [/अहर्त्/g, 'अर्हत्'],
  [/अहर्न्त/g, 'अर्हन्त'],
  [/अन्तगर्ता/g, 'अन्तर्गता'],
  [/अंतगर्ता/g, 'अंतर्गता'],
  [/अन्तगर्त/g, 'अन्तर्गत'],
  [/अंतगर्त/g, 'अंतर्गत'],
  [/पदातर््/g, 'पदार्थ'],
  [/आचायर्/g, 'आचार्य'],
  [/संसारार्णव/g, 'संसारार्णव'],
];

/**
 * Repairs Devanagari Unicode text that suffers from legacy font conversion flaws:
 * 1. Misplaced Reph ('र्') at word ends (e.g., धमर् -> धर्म, कमर् -> कर्म, सवर् -> सर्व)
 * 2. Nukta (़) appearing after vowel signs instead of immediately after the consonant
 * 3. Misplaced Anusvara + Reph combinations (e.g. ंर्)
 * 4. Dangling matra combinations or duplicate vowel signs
 */
export function repairDevanagariUnicode(input: string): string {
  if (!input || typeof input !== 'string') return input || '';

  let text = input;

  // 1. Apply canonical whole-word fixes
  for (const [regex, replacement] of COMMON_KRUTIDEV_REPLACEMENTS) {
    text = text.replace(regex, replacement);
  }

  // 2. Fix Nukta (\u093C) appearing after vowel signs (\u093E-\u094C)
  // Unicode standard: Consonant + Nukta + Vowel sign
  text = text.replace(/([\u0915-\u0939])([\u093E-\u094C])\u093C/g, '$1\u093C$2');

  // 3. Fix misplaced Reph at word boundary (e.g. धमर् -> धर्म, कमर् -> कर्म, सवर् -> सर्व, पूणर् -> पूर्ण)
  text = text.replace(
    /([\u0915-\u0939][\u093E-\u094C]?)([\u0915-\u0939])([\u093E-\u094C]?)\u0930\u094D(?=[\s।,॥"'\n\r\\><:;!?()[\]{}]|$)/g,
    (match, prefix, consonant, matra) => {
      // If the word is already a valid Sanskrit prefix/term like 'पुनर्' or 'प्रादुर्' or 'अन्तर', do not swap!
      if (prefix === 'पु' && consonant === 'न' && !matra) return match;
      if (prefix === 'प्रा' && consonant === 'द' && matra === 'ु') return match;
      if (prefix === 'अं' && consonant === 'त' && !matra) return match;
      if (prefix === 'अन्' && consonant === 'त' && !matra) return match;
      if (prefix === 'नि' && consonant === 'स' && !matra) return match;
      if (prefix === 'बहि' && consonant === 'स' && !matra) return match;
      if (prefix === 'दु' && consonant === 'स' && !matra) return match;

      return `${prefix}\u0930\u094D${consonant}${matra}`;
    }
  );

  // 4. Fix Anusvara + Reph inversion
  text = text.replace(/([\u0915-\u0939][\u093E-\u094C]?)\u0902\u0930\u094D/g, '\u0930\u094D$1\u0902');

  // 5. Fix double matras
  text = text.replace(/\u093E{2,}/g, '\u093E'); // ाा -> ा
  text = text.replace(/\u0940{2,}/g, '\u0940'); // ीी -> ी
  text = text.replace(/\u0941{2,}/g, '\u0941'); // ुु -> ु
  text = text.replace(/\u0942{2,}/g, '\u0942'); // ूू -> ू

  // 6. Fix virama followed directly by matra
  text = text.replace(/\u094D\u093F/g, '\u093F');

  return text;
}
