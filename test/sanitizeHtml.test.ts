import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { sanitizeHtml } from '../src/utils/sanitizeHtml.ts';
import { JSDOM } from 'jsdom';

// JSDOM setup required for testing sanitizeHtml
const dom = new JSDOM();
(global as any).document = dom.window.document;
(global as any).DOMParser = dom.window.DOMParser;

describe('sanitizeHtml Security', () => {
  it('prevents mXSS via template tags', () => {
    const input = '<body><template><img src="x" onerror="alert(1)"></template></body>';
    const output = sanitizeHtml(input);
    assert.ok(!output.includes('onerror'));
    assert.ok(!output.includes('img'));
    assert.strictEqual(output, '');
  });

  it('removes math and svg elements', () => {
    const input = '<body><math><mi><style><g onload="alert(1)"></g></style></mi></math></body>';
    const output = sanitizeHtml(input);
    assert.strictEqual(output, '');
  });
});
