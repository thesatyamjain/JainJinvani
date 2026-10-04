import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHash, buildPath, buildHash, VALID_PAGES, PAGE_ALIASES } from '../src/utils/urlHelper.ts';
import { repairDevanagariUnicode } from '../src/utils/unicodeFixer.ts';
import { sanitizeHtml } from '../src/utils/sanitizeHtml.ts';

test('URL Router: parseHash defaults to landing', () => {
  assert.deepEqual(parseHash(''), { page: 'landing', params: null });
  assert.deepEqual(parseHash('#'), { page: 'landing', params: null });
  assert.deepEqual(parseHash('#/'), { page: 'landing', params: null });
});

test('URL Router: parseHash resolves REST and query paths', () => {
  const viewerRoute = parseHash('#/viewer/bhaktamar-stotra');
  assert.equal(viewerRoute.page, 'viewer');
  assert.equal(viewerRoute.params?.id, 'bhaktamar-stotra');

  const catRoute = parseHash('#/category?id=stotra');
  assert.equal(catRoute.page, 'category');
  assert.equal(catRoute.params?.id, 'stotra');
});

test('URL Router: aliases map accurately to canonical pages', () => {
  assert.equal(PAGE_ALIASES['parva'], 'festivals');
  assert.equal(PAGE_ALIASES['tirth'], 'pilgrimage');
  assert.equal(PAGE_ALIASES['tattva'], 'philosophy');
  assert.equal(PAGE_ALIASES['puja'], 'rituals');
});

test('URL Router: buildPath constructs valid SEO friendly URLs', () => {
  assert.equal(buildPath('landing'), '/');
  assert.equal(buildPath('viewer', { id: 'bhaktamar' }), '/viewer?id=bhaktamar');
  assert.equal(buildHash('sadhana'), '#sadhana');
});

test('URL Router: VALID_PAGES contains essential navigation keys', () => {
  assert.ok(VALID_PAGES.has('landing'));
  assert.ok(VALID_PAGES.has('sadhana'));
  assert.ok(VALID_PAGES.has('library'));
  assert.ok(VALID_PAGES.has('viewer'));
  assert.ok(VALID_PAGES.has('admin'));
  assert.ok(VALID_PAGES.has('favorites'));
});

test('Unicode Fixer: repairs Devanagari encoding edge cases', () => {
  // Test Krutidev / Chanakya misplaced reph & common ligature fixes
  assert.equal(repairDevanagariUnicode('धमर्'), 'धर्म');
  assert.equal(repairDevanagariUnicode('तीथर्ंकर'), 'तीर्थंकर');
  assert.equal(repairDevanagariUnicode('आशीवार्द'), 'आशीर्वाद');
  assert.equal(repairDevanagariUnicode('सम्पूणर्'), 'सम्पूर्ण');
  // Safe on standard text
  assert.equal(repairDevanagariUnicode('ॐ नमः सिद्धेभ्यः'), 'ॐ नमः सिद्धेभ्यः');
});

test('Sanitizer: safely guards execution outside DOM', () => {
  // In server/node context without DOMParser, returns empty string safely
  const dirty = '<script>alert("xss")</script>';
  assert.equal(sanitizeHtml(dirty), '');
});
