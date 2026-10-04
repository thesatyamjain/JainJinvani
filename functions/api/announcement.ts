/**
 * Cloudflare Pages Serverless Function for Live Sacred Announcements
 * Endpoint: GET /api/announcement, POST /api/announcement
 */

import { verifySession } from './auth.ts';
import { getCorsHeaders, handleOptionsResponse } from './cors.ts';

interface AnnouncementPayload {
  active: boolean;
  type?: 'permanent' | 'scheduled' | 'time_frame';
  badge: string;
  text: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  updatedAt?: string;
}

export async function onRequestOptions(context: { request: Request; env: Record<string, any> }): Promise<Response> {
  return handleOptionsResponse(context.request, context.env, 'GET, POST, OPTIONS');
}

export async function onRequestGet(context: {
  request: Request;
  env: Record<string, any>;
}): Promise<Response> {
  const { request, env } = context;
  const cors = getCorsHeaders(request, env, 'GET, POST, OPTIONS');

  try {
    // 1. Check Cloudflare KV if bound (fastest live edge store)
    if (env.JINVANI_KV) {
      const kvData = await env.JINVANI_KV.get('announcement');
      if (kvData) {
        return new Response(kvData, {
          headers: {
            ...cors,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, max-age=30, s-maxage=30',
          },
        });
      }
    }

    // 2. Fallback to static asset /announcement.json
    const url = new URL(request.url);
    const assetUrl = `${url.origin}/announcement.json`;
    const assetRes = await fetch(assetUrl);
    if (assetRes.ok) {
      const text = await assetRes.text();
      return new Response(text, {
        headers: {
          ...cors,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      });
    }

    // 3. Fallback default
    const fallback: AnnouncementPayload = {
      active: true,
      type: 'permanent',
      badge: 'पर्व एवं महोत्सव',
      text: 'पर्युषण महापर्व के पावन अवसर पर 10 दिवसीय विशेष स्वाध्याय एवं शांतिधारा विधान उपलब्ध है।',
      link: 'festivals',
      updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(fallback), {
      headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error?.message || 'Failed to fetch announcement' }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

export async function onRequestPost(context: {
  request: Request;
  env: Record<string, any>;
}): Promise<Response> {
  const { request, env } = context;
  const cors = getCorsHeaders(request, env, 'GET, POST, OPTIONS');

  try {
    // Requires a session token issued by POST /api/auth
    if (!(await verifySession(request, env))) {
      return new Response(
        JSON.stringify({ ok: false, error: 'अनधिकृत प्रवेश (Unauthorized): कृपया सही क्रेडेंशियल दर्ज करें।' }),
        { status: 401, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const body: AnnouncementPayload = await request.json();

    if (!body.text || !body.text.trim()) {
      return new Response(
        JSON.stringify({ ok: false, error: 'कृपया घोषणा का मुख्य सन्देश अवश्य लिखें।' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const payload: AnnouncementPayload = {
      active: !!body.active,
      type: body.type || 'permanent',
      badge: (body.badge || 'पर्व एवं महोत्सव').trim(),
      text: body.text.trim(),
      link: (body.link || 'festivals').trim(),
      startDate: body.startDate || '',
      endDate: body.endDate || '',
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to Cloudflare KV if bound
    if (env.JINVANI_KV) {
      await env.JINVANI_KV.put('announcement', JSON.stringify(payload));
    }

    // 2. If GitHub token is present in env, commit to repository announcement.json
    let gitCommitted = false;
    const ghToken = env.GITHUB_TOKEN;
    const ghRepo = env.GITHUB_REPO; // e.g. "username/jainjinvani"

    if (ghToken && ghRepo) {
      try {
        const filePath = 'public/announcement.json';
        const getFileUrl = `https://api.github.com/repos/${ghRepo}/contents/${filePath}`;
        const fileRes = await fetch(getFileUrl, {
          headers: {
            Authorization: `Bearer ${ghToken}`,
            'User-Agent': 'JainJinvani-Cloudflare-Worker',
            Accept: 'application/vnd.github.v3+json',
          },
        });

        let sha: string | undefined;
        if (fileRes.ok) {
          const fileInfo: any = await fileRes.json();
          sha = fileInfo.sha;
        }

        const newContentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));
        const putRes = await fetch(getFileUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${ghToken}`,
            'User-Agent': 'JainJinvani-Cloudflare-Worker',
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Update announcement: ${payload.badge} (${payload.type})`,
            content: newContentBase64,
            ...(sha ? { sha } : {}),
          }),
        });

        if (putRes.ok) {
          gitCommitted = true;
        }
      } catch (ghErr) {
        console.error('GitHub commit error:', ghErr);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        announcement: payload,
        gitCommitted,
        message: 'घोषणा सफलतापूर्वक सहेज ली गई!',
      }),
      { status: 200, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error?.message || 'घोषणा सहेजने में त्रुटि हुई।' }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
