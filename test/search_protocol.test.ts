import test from 'node:test';
import assert from 'node:assert/strict';
import {
  transliterateHindiToEnglish,
  normalizeDevanagari,
  normalizePhonetic,
  levenshteinDistance,
  parseSearchQuery,
  extractSearchableText,
  extractSnippet,
  GlobalSearchProtocol,
  searchGlobal,
  searchAndRankItems,
  calculateRelevanceScore,
  matchSearchQuery,
  getHighlightedSegments,
} from '../src/utils/searchHelper.ts';
import type { SearchableItem } from '../src/utils/searchHelper.ts';

test('Global Search: Devanagari to English phonetic transliteration', () => {
  const trans1 = transliterateHindiToEnglish('भक्तामर स्तोत्र');
  assert.ok(trans1.includes('bhaktamar'));
  assert.ok(trans1.includes('stotr') || trans1.includes('stotra'));

  const trans2 = transliterateHindiToEnglish('णमोकार महामंत्र');
  assert.ok(trans2.includes('namokar') || trans2.includes('nmokar'));
});

test('Global Search: Devanagari orthographic normalization & Jain canonical variants', () => {
  // Homorganic nasal stops to Anusvara
  assert.equal(normalizeDevanagari('शान्ति'), 'शांति');
  assert.equal(normalizeDevanagari('सम्बन्ध'), 'संबंध');
  assert.equal(normalizeDevanagari('जिनेन्द्र'), 'जिनेंद्र');
  assert.equal(normalizeDevanagari('पञ्च'), 'पंच');

  // Spelling variants
  assert.equal(normalizeDevanagari('भक्तांबर'), 'भक्तामर');
  assert.equal(normalizeDevanagari('तत्वार्थ'), 'तत्त्वार्थ');
  assert.equal(normalizeDevanagari('नवकार'), 'णमोकार');
  assert.equal(normalizeDevanagari('नमोकार'), 'णमोकार');
  assert.equal(normalizeDevanagari('पारसनाथ'), 'पार्श्वनाथ');
  assert.equal(normalizeDevanagari('ऋषभदेव'), 'आदिनाथ');
  assert.equal(normalizeDevanagari('वर्धमान'), 'महावीर');
  assert.equal(normalizeDevanagari('स्त्रोत'), 'स्तोत्र');
  assert.equal(normalizeDevanagari('पुजा'), 'पूजा');
  assert.equal(normalizeDevanagari('चालिसा'), 'चालीसा');
});

test('Global Search: Phonetic normalization for Hinglish', () => {
  assert.equal(normalizePhonetic('pooja'), 'puja');
  assert.equal(normalizePhonetic('navkar'), 'namokar');
  assert.equal(normalizePhonetic('bhaktambar'), normalizePhonetic('bhaktamar'));
  assert.equal(normalizePhonetic('parasnath'), normalizePhonetic('parshwanath'));
  assert.equal(normalizePhonetic('tatvarth'), normalizePhonetic('tattvartha'));
  assert.equal(normalizePhonetic('chaalisa'), 'chalisa');
});

test('Global Search: Levenshtein distance calculation', () => {
  assert.equal(levenshteinDistance('bhaktamar', 'bhaktamar'), 0);
  assert.equal(levenshteinDistance('bhaktamar', 'bhaktmar'), 1);
  assert.equal(levenshteinDistance('bhaktamar', 'bhktmar'), 2);
  assert.equal(levenshteinDistance('puja', 'pooja'), 2);
});

test('Global Search: Query parser with operators (@category, kavi:, tag:)', () => {
  const q1 = parseSearchQuery('@puja पार्श्वनाथ');
  assert.equal(q1.categoryFilter, 'puja');
  assert.equal(q1.cleanText, 'पार्श्वनाथ');
  assert.deepEqual(q1.tokens, ['पार्श्वनाथ']);

  const q2 = parseSearchQuery('@stotra bhaktamar');
  assert.equal(q2.categoryFilter, 'stotra');
  assert.equal(q2.cleanText, 'bhaktamar');
  assert.ok(q2.devanagariTokens.includes('भक्तामर'));

  const q3 = parseSearchQuery('kavi:कुन्दकुन्द समयसार');
  assert.equal(q3.authorFilter, 'कुन्दकुन्द');
  assert.equal(q3.cleanText, 'समयसार');

  const q4 = parseSearchQuery('tag:दशलक्षण उत्तम क्षमा');
  assert.equal(q4.tagFilter, 'दशलक्षण');
  assert.equal(q4.cleanText, 'उत्तम क्षमा');
});

test('Global Search: Content extraction & Contextual Snippet extractor', () => {
  const mockItem: SearchableItem = {
    id: 'bhaktamar-hindi',
    title: 'श्री भक्तामर स्तोत्र',
    category: 'stotra',
    verses: [
      {
        hindi: 'भक्तामर-प्रणत-मौलि-मणि-प्रभाणा-मुद्योतकं दलित-पाप-तमो-वितानम्।',
        meaning: 'भक्त अमर अर्थात् देवों के मुकुट की मणियों की कान्ति को चमकाने वाले...',
      },
    ],
  };

  const extracted = extractSearchableText(mockItem);
  assert.ok(extracted.includes('भक्तामर-प्रणत-मौलि-मणि'));
  assert.ok(extracted.includes('देवों के मुकुट की मणियों'));

  const snippet = extractSnippet(mockItem, ['मुकुट']);
  assert.ok(snippet);
  assert.equal(snippet.matchedField, 'verse');
  assert.ok(snippet.snippetText.includes('मुकुट'));
});

test('Global Search: Multi-tier ranking & Inverted Index', () => {
  const items: SearchableItem[] = [
    {
      id: 'bhaktamar-stotra',
      title: 'श्री भक्तामर स्तोत्र',
      category: 'stotra',
      author: 'आचार्य मानतुंग',
      tags: ['स्तोत्र', 'नित्य-नियम'],
      description: 'आचार्य मानतुंग द्वारा रचित अलौकिक चमत्कारी स्तोत्र',
    },
    {
      id: 'parshvanath-puja',
      title: 'श्री पार्श्वनाथ पूजा',
      category: 'puja',
      author: 'कवि द्यानतराय',
      tags: ['पूजा', 'पार्श्वनाथ'],
    },
    {
      id: 'namokar-mantra',
      title: 'णमोकार महामंत्र',
      category: 'stotra',
      tags: ['महामंत्र', 'अनादि निधन'],
    },
    {
      id: 'samaysar-param-aagam',
      title: 'समयसार परमागम',
      category: 'granthas',
      author: 'आचार्य कुन्दकुन्द',
    },
  ];

  const engine = new GlobalSearchProtocol(items);

  // Exact title match should be #1
  const r1 = engine.search('भक्तामर');
  assert.ok(r1.results.length >= 1);
  assert.equal(r1.results[0].item.id, 'bhaktamar-stotra');

  // Romanized / Hinglish query "bhaktamar" should find bhaktamar-stotra as #1
  const r2 = engine.search('bhaktamar');
  assert.ok(r2.results.length >= 1);
  assert.equal(r2.results[0].item.id, 'bhaktamar-stotra');

  // Romanized "namokar" should find namokar-mantra
  const r3 = engine.search('namokar');
  assert.ok(r3.results.length >= 1);
  assert.equal(r3.results[0].item.id, 'namokar-mantra');

  // Author search "मानतुंग"
  const r4 = engine.search('मानतुंग');
  assert.ok(r4.results.length >= 1);
  assert.equal(r4.results[0].item.id, 'bhaktamar-stotra');

  // Category operator search "@puja पार्श्वनाथ"
  const r5 = engine.search('@puja पार्श्वनाथ');
  assert.ok(r5.results.length >= 1);
  assert.equal(r5.results[0].item.id, 'parshvanath-puja');
});

test('Global Search: Typo tolerance & Did You Mean', () => {
  const items: SearchableItem[] = [
    {
      id: 'bhaktamar-stotra',
      title: 'श्री भक्तामर स्तोत्र',
      category: 'stotra',
    },
  ];

  const engine = new GlobalSearchProtocol(items);

  // Typo "bhaktmr" (omitted 'a')
  const r1 = engine.search('bhaktmr');
  assert.ok(r1.results.length > 0 || r1.didYouMean !== undefined);
  if (r1.results.length > 0) {
    assert.equal(r1.results[0].item.id, 'bhaktamar-stotra');
  }
});

test('Global Search: Backwards compatible helper functions', () => {
  const items: SearchableItem[] = [
    { id: '1', title: 'भक्तामर स्तोत्र', category: 'stotra' },
    { id: '2', title: 'पार्श्वनाथ पूजा', category: 'puja' },
  ];

  // searchAndRankItems
  const ranked = searchAndRankItems(items, 'भक्तामर');
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].id, '1');

  // calculateRelevanceScore
  const score1 = calculateRelevanceScore(items[0], 'भक्तामर');
  assert.ok(score1 > 500);

  // matchSearchQuery
  assert.equal(matchSearchQuery(items[0], 'भक्तामर'), true);
  assert.equal(matchSearchQuery(items[0], 'bhaktamar'), true);
  assert.equal(matchSearchQuery(items[0], 'xyzabc999'), false);

  // getHighlightedSegments
  const segments = getHighlightedSegments('श्री भक्तामर स्तोत्र', 'भक्तामर');
  assert.ok(segments.some((s) => s.isMatch && s.text === 'भक्तामर'));
});
