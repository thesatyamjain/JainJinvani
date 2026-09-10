/**
 * Sanitizes the repository's rich-text content before it is inserted into the
 * DOM. Content is deliberately treated as untrusted so future imports or CMS
 * integrations cannot turn a content record into executable JavaScript.
 */
const ALLOWED_TAGS = new Set([
  'a', 'article', 'b', 'blockquote', 'br', 'caption', 'code', 'div', 'em',
  'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i',
  'li', 'ol', 'p', 'pre', 'small', 'span', 'strong', 'sub', 'sup', 'table',
  'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u', 'ul',
]);

const ALLOWED_ATTRIBUTES = new Set([
  'abbr', 'aria-describedby', 'aria-label', 'aria-labelledby', 'class',
  'colspan', 'headers', 'href', 'id', 'role', 'rowspan', 'scope', 'title',
]);

const isSafeUrl = (value: string) => {
  const url = value.trim();
  return (
    url.startsWith('#') ||
    url.startsWith('/') ||
    url.startsWith('./') ||
    url.startsWith('../') ||
    /^https?:\/\//i.test(url)
  );
};

export function sanitizeHtml(html: string): string {
  if (!html || typeof document === 'undefined') return '';

  const documentFragment = new DOMParser().parseFromString(html, 'text/html');

  for (const element of Array.from(documentFragment.body.querySelectorAll('*'))) {
    const tagName = element.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tagName)) {
      // Keep text from unsupported formatting tags, but discard executable or
      // embedded nodes such as script, iframe, object, and svg entirely.
      if (['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math'].includes(tagName)) {
        element.remove();
      } else {
        element.replaceWith(...Array.from(element.childNodes));
      }
      continue;
    }

    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value;
      if (name.startsWith('on') || name === 'style' || !ALLOWED_ATTRIBUTES.has(name)) {
        element.removeAttribute(attribute.name);
      }
      if ((name === 'href' || name === 'src') && !isSafeUrl(value)) {
        element.removeAttribute(attribute.name);
      }
    }

    if (tagName === 'a') {
      const href = element.getAttribute('href');
      if (href && isSafeUrl(href)) {
        element.setAttribute('rel', 'noopener noreferrer');
      } else {
        element.removeAttribute('href');
      }
    }
  }

  return documentFragment.body.innerHTML;
}
