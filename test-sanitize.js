const { JSDOM } = require('jsdom');
const dom = new JSDOM();
global.DOMParser = dom.window.DOMParser;
global.document = dom.window.document;
global.Node = dom.window.Node;

const ALLOWED_TAGS = new Set(['a', 'div', 'span', 'p']);
const ALLOWED_ATTRIBUTES = new Set(['class', 'id']);
const isSafeUrl = () => true;

function sanitizeHtml(html) {
  if (!html || typeof document === 'undefined') return '';

  const documentFragment = new DOMParser().parseFromString(html, 'text/html');

  for (const element of Array.from(documentFragment.body.querySelectorAll('*'))) {
    const tagName = element.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tagName)) {
      if (['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math'].includes(tagName)) {
        element.remove();
      } else {
        element.replaceWith(...Array.from(element.childNodes));
      }
      continue;
    }
  }
  return documentFragment.body.innerHTML;
}

console.log(sanitizeHtml('<template><script>alert(1)</script></template>'));
console.log(sanitizeHtml('<math><mi><script>alert(1)</script></mi></math>'));
