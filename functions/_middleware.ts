import { resolveMetadata } from './metaResolver';

// Social crawlers and search bot user-agents
const BOT_USER_AGENTS = [
  'whatsapp',
  'facebookexternalhit',
  'facebot',
  'meta-externalagent',
  'twitterbot',
  'telegrambot',
  'slackbot',
  'linkedinbot',
  'discordbot',
  'googlebot',
  'bingbot',
  'applebot',
  'skypeuripreview',
  'pinterest',
  'threads',
  'redditbot',
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> {
  const { request, next } = context;
  const userAgent = request.headers.get('user-agent');
  const url = new URL(request.url);

  // If this is an API call or static file asset (js, css, webp, etc.), pass through immediately
  if (
    url.pathname.startsWith('/api/') ||
    /\.(js|css|webp|png|jpg|jpeg|svg|ico|woff|woff2|json|webmanifest|xml|txt)$/i.test(url.pathname)
  ) {
    return next();
  }

  // If request is from a normal browser visitor, serve the static SPA directly
  if (!isBot(userAgent)) {
    return next();
  }

  // If request is from a crawler bot, inject dynamic SEO & OpenGraph meta tags
  const meta = resolveMetadata(url);
  const response = await next();

  // Ensure HTMLRewriter is available in Cloudflare Pages Functions runtime
  if (typeof HTMLRewriter === 'undefined') {
    return response;
  }

  return new HTMLRewriter()
    .on('title', {
      element(el) {
        el.setInnerContent(meta.title);
      },
    })
    .on('meta[name="title"]', {
      element(el) {
        el.setAttribute('content', meta.title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute('content', meta.description);
      },
    })
    .on('meta[property="og:title"]', {
      element(el) {
        el.setAttribute('content', meta.title);
      },
    })
    .on('meta[property="og:description"]', {
      element(el) {
        el.setAttribute('content', meta.description);
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute('content', meta.url);
      },
    })
    .on('meta[property="og:image"]', {
      element(el) {
        if (meta.image) {
          el.setAttribute('content', meta.image);
        }
      },
    })
    .on('meta[property="og:image:secure_url"]', {
      element(el) {
        if (meta.image) {
          el.setAttribute('content', meta.image);
        }
      },
    })
    .on('meta[name="twitter:title"]', {
      element(el) {
        el.setAttribute('content', meta.title);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(el) {
        el.setAttribute('content', meta.description);
      },
    })
    .on('meta[name="twitter:image"]', {
      element(el) {
        if (meta.image) {
          el.setAttribute('content', meta.image);
        }
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute('href', meta.url);
      },
    })
    .transform(response);
}
